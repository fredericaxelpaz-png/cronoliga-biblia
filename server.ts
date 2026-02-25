import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './server/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.SESSION_SECRET || 'dev-secret-key';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// --- Database Helpers ---

function getUser(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as any;
}

function getUserById(id: number) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as any;
}

function createUser(email: string, password: string | null, name: string, googleId: string | null) {
  const stmt = db.prepare('INSERT INTO users (email, password, name, google_id) VALUES (?, ?, ?, ?)');
  const info = stmt.run(email, password, name, googleId);
  
  // Initialize progress
  const progressStmt = db.prepare('INSERT INTO progress (user_id) VALUES (?)');
  progressStmt.run(info.lastInsertRowid);
  
  return info.lastInsertRowid;
}

function getProgress(userId: number) {
  const stmt = db.prepare('SELECT * FROM progress WHERE user_id = ?');
  const progress = stmt.get(userId) as any;
  if (progress) {
    return {
      ...progress,
      completed_guides: JSON.parse(progress.completed_guides),
      passed_guides: JSON.parse(progress.passed_guides),
      is_dark_mode: Boolean(progress.is_dark_mode)
    };
  }
  return null;
}

function updateProgress(userId: number, data: any) {
  const current = getProgress(userId);
  const newProgress = { ...current, ...data };
  
  const stmt = db.prepare(`
    UPDATE progress 
    SET completed_guides = ?, passed_guides = ?, daily_streak = ?, is_dark_mode = ?
    WHERE user_id = ?
  `);
  
  stmt.run(
    JSON.stringify(newProgress.completed_guides),
    JSON.stringify(newProgress.passed_guides),
    newProgress.daily_streak,
    newProgress.is_dark_mode ? 1 : 0,
    userId
  );
}

// --- Middleware ---

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const existingUser = getUser(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const userId = createUser(email, hashedPassword, name, null);
    const token = jwt.sign({ id: userId, email }, JWT_SECRET);
    
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none' 
    });
    
    res.json({ user: { id: userId, email, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = getUser(email);
  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  
  res.cookie('token', token, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none' 
  });
  
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none' 
  });
  res.json({ success: true });
});

// Get Current User & Progress
app.get('/api/me', authenticateToken, (req: any, res) => {
  const user = getUserById(req.user.id);
  if (!user) return res.sendStatus(404);
  
  const progress = getProgress(user.id);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      ...progress
    }
  });
});

// Update Progress
app.post('/api/progress', authenticateToken, (req: any, res) => {
  const { completedGuides, passedGuides, dailyStreak, isDarkMode } = req.body;
  
  try {
    updateProgress(req.user.id, {
      completed_guides: completedGuides,
      passed_guides: passedGuides,
      daily_streak: dailyStreak,
      is_dark_mode: isDarkMode
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// --- Google OAuth ---

app.get('/api/auth/google/url', (req, res) => {
  const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl });
});

// Google Callback Handler (HTML response for popup)
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.send('Error: No code provided');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    const googleUser = await userResponse.json();
    
    // Find or create user
    let user = getUser(googleUser.email);
    let userId;

    if (!user) {
      userId = createUser(googleUser.email, null, googleUser.name, googleUser.id);
    } else {
      userId = user.id;
      // Update google_id if missing?
      if (!user.google_id) {
        const stmt = db.prepare('UPDATE users SET google_id = ? WHERE id = ?');
        stmt.run(googleUser.id, userId);
      }
    }

    // Create session token
    const token = jwt.sign({ id: userId, email: googleUser.email }, JWT_SECRET);
    
    // Set cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none' 
    });

    // Send success message to window.opener
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Autenticación exitosa. Cerrando ventana...</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});


// --- Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
