import React from 'react';
import { useStore } from '../store';
import { guides } from '../data';
import { Trophy, Flame, Target, BookCheck, CheckCircle, Star } from 'lucide-react';
import clsx from 'clsx';

export const ProgressScreen: React.FC = () => {
  const { getCurrentUser, incrementDailyStreak } = useStore();
  const user = getCurrentUser();
  
  if (!user) return null;

  const { completedGuides, passedGuides, isDarkMode, userName, dailyStreak } = user;
  
  const totalGuides = guides.length;
  const completedCount = completedGuides.length;
  const passedCount = passedGuides.length;
  const progressPercentage = Math.round((passedCount / totalGuides) * 100);

  return (
    <div className="p-6 pt-10">
      <header className="mb-8">
        <h1 className={clsx("text-3xl font-bold font-display mb-3", isDarkMode ? "text-sacred-100" : "text-sacred-900")}>
          Tu Progreso
        </h1>
        <p className={clsx("text-base font-serif italic", isDarkMode ? "text-sacred-400" : "text-sacred-600")}>
          ¡Sigue así, {userName}! Estás construyendo un hábito eterno.
        </p>
      </header>

      {/* Main Stats Card */}
      <div className="bg-sacred-gradient rounded-2xl p-6 text-white shadow-xl shadow-sacred-500/20 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={120} />
        </div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-200" />
            <span className="font-bold text-lg font-display tracking-wide">Nivel General</span>
          </div>
          <span className="text-4xl font-bold font-display">{progressPercentage}%</span>
        </div>
        
        <div className="w-full bg-black/20 rounded-full h-3 mb-2 relative z-10">
          <div 
            className="bg-yellow-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-sacred-100 text-right font-serif italic relative z-10">Completado de la Biblia</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={clsx(
          "p-5 rounded-xl border shadow-sm",
          isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-sacred-200"
        )}>
          <div className="flex items-center gap-2 mb-3 text-olive-600 dark:text-olive-400">
            <BookCheck size={20} />
            <span className="font-bold text-xs uppercase tracking-wider">Leídas</span>
          </div>
          <span className={clsx("text-3xl font-bold font-display", isDarkMode ? "text-white" : "text-sacred-900")}>
            {completedCount} <span className="text-sm font-normal text-sacred-400 font-sans">/ {totalGuides}</span>
          </span>
        </div>

        <div className={clsx(
          "p-5 rounded-xl border shadow-sm",
          isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-sacred-200"
        )}>
          <div className="flex items-center gap-2 mb-3 text-yellow-600 dark:text-yellow-400">
            <Star size={20} />
            <span className="font-bold text-xs uppercase tracking-wider">Aprobadas</span>
          </div>
          <span className={clsx("text-3xl font-bold font-display", isDarkMode ? "text-white" : "text-sacred-900")}>
            {passedCount} <span className="text-sm font-normal text-sacred-400 font-sans">/ {totalGuides}</span>
          </span>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className={clsx(
        "p-6 rounded-2xl border relative overflow-hidden transition-all shadow-md",
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white border-sacred-200"
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Flame size={120} />
        </div>
        
        <h3 className={clsx("font-bold text-lg mb-2 flex items-center gap-2 font-display", isDarkMode ? "text-white" : "text-sacred-900")}>
          <Flame className="text-orange-500" fill="currentColor" />
          Reto Diario
        </h3>
        <p className={clsx("text-sm mb-6 font-serif italic", isDarkMode ? "text-sacred-300" : "text-sacred-600")}>
          Lee al menos 1 sección de una guía hoy para mantener tu racha.
        </p>
        
        {dailyStreak > 0 ? (
          <div className="w-full py-3 rounded-xl bg-olive-100 text-olive-800 font-bold text-sm flex items-center justify-center gap-2 dark:bg-olive-900/30 dark:text-olive-300 border border-olive-200 dark:border-olive-800">
            <CheckCircle size={18} />
            ¡Reto Completado!
          </div>
        ) : (
          <button 
            onClick={incrementDailyStreak}
            className="w-full py-3 rounded-xl bg-orange-100 text-orange-800 font-bold text-sm hover:bg-orange-200 transition-colors dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-display tracking-wide"
          >
            Aceptar Reto
          </button>
        )}
      </div>
    </div>
  );
};
