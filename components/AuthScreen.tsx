import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import clsx from 'clsx';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, checkSession } = useStore();

  useEffect(() => {
    // Listen for OAuth success message
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkSession();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Correo o contraseña incorrectos.');
        }
      } else {
        if (!name || !email || !password) {
          setError('Todos los campos son obligatorios.');
          setLoading(false);
          return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Por favor ingresa un correo válido.');
          setLoading(false);
          return;
        }

        const success = await register(email, password, name);
        if (!success) {
          setError('El usuario ya existe.');
        }
      }
    } catch (err) {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();
      
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        url,
        'google_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (err) {
      console.error(err);
      setError('Error al iniciar con Google. Verifica tu conexión.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-sacred-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sacred-300 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm w-full max-w-md p-8 rounded-3xl shadow-xl border border-sacred-200 relative z-10">
        <div className="mb-8">
          <Logo size="lg" />
          <p className="text-center text-sacred-600 mt-4 font-sans italic">
            {isLogin ? 'Bienvenido a tu espacio de reflexión' : 'Comienza tu viaje espiritual hoy'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-sacred-700 uppercase tracking-widest">Nombre</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sacred-400 group-focus-within:text-sacred-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-sacred-50 border border-sacred-200 focus:border-sacred-500 focus:ring-1 focus:ring-sacred-500 outline-none transition-all text-sacred-900 placeholder-sacred-300"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-sacred-700 uppercase tracking-widest">Correo</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sacred-400 group-focus-within:text-sacred-600 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-sacred-50 border border-sacred-200 focus:border-sacred-500 focus:ring-1 focus:ring-sacred-500 outline-none transition-all text-sacred-900 placeholder-sacred-300"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-sacred-700 uppercase tracking-widest">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sacred-400 group-focus-within:text-sacred-600 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-sacred-50 border border-sacred-200 focus:border-sacred-500 focus:ring-1 focus:ring-sacred-500 outline-none transition-all text-sacred-900 placeholder-sacred-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-sacred-gradient text-white font-display font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-sacred-500/20 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px bg-sacred-200 flex-1" />
          <span className="text-sacred-400 text-sm font-serif italic">o continúa con</span>
          <div className="h-px bg-sacred-200 flex-1" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl border border-sacred-200 bg-white text-sacred-700 font-bold hover:bg-sacred-50 transition-all flex items-center justify-center gap-2"
        >
          <Chrome size={20} />
          Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-sacred-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-sacred-800 font-bold hover:underline font-display"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
