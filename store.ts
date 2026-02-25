import { create } from 'zustand';
import { UserData } from './types';

interface AppState {
  currentUser: UserData | null;
  isPinVerified: boolean;
  isLoading: boolean;
  
  // Actions
  checkSession: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyPin: (pin: string) => boolean;
  getCurrentUser: () => UserData | null;
  
  // Progress Actions
  markGuideCompleted: (guideId: string) => Promise<void>;
  markGuidePassed: (guideId: string) => Promise<void>;
  incrementDailyStreak: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isPinVerified: false,
  isLoading: true,

  getCurrentUser: () => get().currentUser,

  checkSession: async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        set({ 
          currentUser: {
            id: data.user.id,
            email: data.user.email,
            userName: data.user.name,
            completedGuides: data.user.completed_guides || [],
            passedGuides: data.user.passed_guides || [],
            dailyStreak: data.user.daily_streak || 0,
            isDarkMode: data.user.is_dark_mode || false,
            progressPercentage: 0 // Calculated in component
          },
          isLoading: false 
        });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error('Session check failed', error);
      set({ currentUser: null, isLoading: false });
    }
  },

  register: async (email, password, name) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (res.ok) {
        await get().checkSession();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        await get().checkSession();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ currentUser: null, isPinVerified: false });
    } catch (error) {
      console.error('Logout failed', error);
    }
  },

  verifyPin: (pin: string) => {
    if (pin === '6789') {
      set({ isPinVerified: true });
      return true;
    }
    return false;
  },

  // --- Progress Actions ---

  markGuideCompleted: async (guideId) => {
    const user = get().currentUser;
    if (!user) return;
    
    if (!user.completedGuides.includes(guideId)) {
      const newCompleted = [...user.completedGuides, guideId];
      
      // Optimistic update
      set({ currentUser: { ...user, completedGuides: newCompleted } });
      
      // Sync with server
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedGuides: newCompleted,
          passedGuides: user.passedGuides,
          dailyStreak: user.dailyStreak,
          isDarkMode: user.isDarkMode
        })
      });
    }
  },

  markGuidePassed: async (guideId) => {
    const user = get().currentUser;
    if (!user) return;
    
    if (!user.passedGuides.includes(guideId)) {
      const newPassed = [...user.passedGuides, guideId];
      
      set({ currentUser: { ...user, passedGuides: newPassed } });
      
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedGuides: user.completedGuides,
          passedGuides: newPassed,
          dailyStreak: user.dailyStreak,
          isDarkMode: user.isDarkMode
        })
      });
    }
  },

  incrementDailyStreak: async () => {
    const user = get().currentUser;
    if (!user) return;
    
    const newStreak = user.dailyStreak + 1;
    set({ currentUser: { ...user, dailyStreak: newStreak } });
    
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completedGuides: user.completedGuides,
        passedGuides: user.passedGuides,
        dailyStreak: newStreak,
        isDarkMode: user.isDarkMode
      })
    });
  },

  toggleDarkMode: async () => {
    const user = get().currentUser;
    if (!user) return;
    
    const newMode = !user.isDarkMode;
    set({ currentUser: { ...user, isDarkMode: newMode } });
    
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completedGuides: user.completedGuides,
        passedGuides: user.passedGuides,
        dailyStreak: user.dailyStreak,
        isDarkMode: newMode
      })
    });
  },

  setUserName: async (name) => {
    const user = get().currentUser;
    if (user) {
       set({ currentUser: { ...user, userName: name } });
       // Note: We might want to add a specific endpoint for updating profile info later
    }
  },

  resetProgress: async () => {
    const user = get().currentUser;
    if (!user) return;
    
    set({ 
      currentUser: { 
        ...user, 
        completedGuides: [], 
        passedGuides: [], 
        dailyStreak: 0 
      } 
    });
    
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completedGuides: [],
        passedGuides: [],
        dailyStreak: 0,
        isDarkMode: user.isDarkMode
      })
    });
  }
}));
