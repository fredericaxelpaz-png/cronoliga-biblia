import React, { useState } from 'react';
import { useStore } from '../store';
import { Lock } from 'lucide-react';
import { Logo } from './Logo';
import clsx from 'clsx';

export const PinScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { verifyPin, logout, getCurrentUser } = useStore();
  const user = getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyPin(pin);
    if (!isValid) {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-sacred p-4 relative overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none" />

      <div className="w-full max-w-sm text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <Logo size="md" variant="dark" />
        </div>

        <h2 className="text-2xl font-display font-bold text-sacred-100 mb-2">Acceso Restringido</h2>
        <p className="text-sacred-300 mb-8 font-serif italic">
          La paz sea contigo, {user?.userName}.<br/>Ingresa el código sagrado (6789).
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              maxLength={4}
              className={clsx(
                "w-full text-center text-4xl tracking-[1em] font-display py-4 rounded-xl bg-stone-850/50 border-2 outline-none transition-all text-sacred-100 placeholder-sacred-800/50",
                error ? "border-red-500/50 animate-shake" : "border-sacred-700 focus:border-sacred-500"
              )}
              placeholder="••••"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-medium font-serif italic">
              Código incorrecto. Inténtalo de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-sacred-gradient text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-sacred-900/50 font-display tracking-wide"
          >
            Desbloquear Guía
          </button>
        </form>

        <button
          onClick={logout}
          className="mt-8 text-sacred-400 hover:text-sacred-200 text-sm transition-colors font-serif italic"
        >
          Cambiar de cuenta
        </button>
      </div>
    </div>
  );
};
