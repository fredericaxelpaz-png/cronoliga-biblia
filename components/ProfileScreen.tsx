import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Moon, Sun, Trash2, Save, LogOut } from 'lucide-react';
import clsx from 'clsx';

export const ProfileScreen: React.FC = () => {
  const { setUserName, toggleDarkMode, resetProgress, logout, getCurrentUser } = useStore();
  const user = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.userName || '');

  if (!user) return null;

  const handleSaveName = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      resetProgress();
    }
  };

  return (
    <div className="p-6 pt-10">
      <header className="mb-8">
        <h1 className={clsx("text-3xl font-bold font-display mb-3", user.isDarkMode ? "text-sacred-100" : "text-sacred-900")}>
          Perfil
        </h1>
        <p className={clsx("text-base font-serif italic", user.isDarkMode ? "text-sacred-400" : "text-sacred-600")}>
          Gestiona tu cuenta y preferencias.
        </p>
      </header>

      <div className="space-y-6">
        {/* User Card */}
        <div className={clsx(
          "p-6 rounded-2xl border flex items-center gap-5 shadow-sm",
          user.isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-sacred-200"
        )}>
          <div className="w-20 h-20 rounded-full bg-sacred-100 text-sacred-600 flex items-center justify-center shrink-0 border-2 border-sacred-200">
            <User size={36} />
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={clsx(
                    "w-full px-3 py-2 rounded-lg border outline-none font-display",
                    user.isDarkMode ? "bg-stone-700 border-stone-600 text-white" : "bg-sacred-50 border-sacred-300 text-sacred-900"
                  )}
                  autoFocus
                />
                <button 
                  onClick={handleSaveName}
                  className="p-2 bg-sacred-500 text-white rounded-lg hover:bg-sacred-600"
                >
                  <Save size={18} />
                </button>
              </div>
            ) : (
              <div>
                <h2 className={clsx("text-2xl font-bold truncate font-display", user.isDarkMode ? "text-sacred-100" : "text-sacred-900")}>
                  {user.userName}
                </h2>
                <p className="text-sm text-sacred-400 truncate mb-2 font-serif">{user.email}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-sacred-600 hover:text-sacred-800 hover:underline font-bold uppercase tracking-wider"
                >
                  Editar nombre
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className={clsx(
          "rounded-2xl border overflow-hidden shadow-sm",
          user.isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-sacred-200"
        )}>
          <div className="p-5 border-b dark:border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.isDarkMode ? <Moon size={22} className="text-sacred-300" /> : <Sun size={22} className="text-sacred-500" />}
              <span className={clsx("font-medium", user.isDarkMode ? "text-sacred-200" : "text-sacred-800")}>Modo Oscuro</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={clsx(
                "w-12 h-6 rounded-full p-1 transition-colors relative",
                user.isDarkMode ? "bg-sacred-500" : "bg-sacred-200"
              )}
            >
              <div className={clsx(
                "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                user.isDarkMode ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>

          <div className="p-5 border-b dark:border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sacred-500">
              <LogOut size={22} />
              <span className="font-medium">Cerrar Sesión</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-bold text-sacred-600 border border-sacred-200 rounded-lg hover:bg-sacred-50 dark:text-sacred-300 dark:border-stone-600 dark:hover:bg-stone-700 uppercase tracking-wider"
            >
              Salir
            </button>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-500">
              <Trash2 size={22} />
              <span className="font-medium">Reiniciar Progreso</span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 uppercase tracking-wider"
            >
              Reiniciar
            </button>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-xs text-sacred-400 font-serif italic">
            Guía Cronológica de la Biblia v1.1
            <br />
            Hecho con fe y dedicación.
          </p>
        </div>
      </div>
    </div>
  );
};
