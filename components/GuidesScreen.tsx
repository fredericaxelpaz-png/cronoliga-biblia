import React from 'react';
import { useStore } from '../store';
import { guides } from '../data';
import { Lock, Check, Star, BookOpen, Scroll } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface GuidesScreenProps {
  onSelectGuide: (guideId: string) => void;
  onStartQuiz: (guideId: string) => void;
}

export const GuidesScreen: React.FC<GuidesScreenProps> = ({ onSelectGuide, onStartQuiz }) => {
  const { getCurrentUser } = useStore();
  const user = getCurrentUser();
  
  if (!user) return null;

  const { completedGuides, passedGuides, isDarkMode } = user;

  return (
    <div className="p-6 pt-10">
      <header className="mb-12 text-center">
        <h1 className={clsx("text-3xl font-bold font-display mb-3", isDarkMode ? "text-sacred-100" : "text-sacred-900")}>
          Ruta Cronológica
        </h1>
        <p className={clsx("text-base font-serif italic", isDarkMode ? "text-sacred-400" : "text-sacred-600")}>
          "Lámpara es a mis pies tu palabra, y lumbrera a mi camino."
        </p>
      </header>

      <div className="flex flex-col items-center gap-12 max-w-md mx-auto relative pb-20">
        {/* Connecting Line - Styled as a path */}
        <div className={clsx("absolute top-0 bottom-0 w-1.5 left-1/2 -translate-x-1/2 z-0 rounded-full", isDarkMode ? "bg-sacred-800" : "bg-sacred-200")} />

        {guides.map((guide, index) => {
          const isCompleted = completedGuides.includes(guide.id);
          const isPassed = passedGuides.includes(guide.id);
          const isUnlocked = index === 0 || completedGuides.includes(guides[index - 1].id);
          const isQuizUnlocked = isCompleted && (index === 0 || passedGuides.includes(guides[index - 1].id));

          return (
            <motion.div 
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10 w-full flex flex-col items-center"
            >
              <div className="flex items-center gap-6 w-full">
                
                {/* Guide Button */}
                <div className="flex-1 flex justify-end">
                   <button
                    onClick={() => isUnlocked && onSelectGuide(guide.id)}
                    disabled={!isUnlocked}
                    className={clsx(
                      "w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 border-4 relative overflow-hidden group",
                      isCompleted 
                        ? "bg-sacred-gradient border-sacred-300 text-white" 
                        : isUnlocked 
                          ? "bg-white border-sacred-400 text-sacred-600" 
                          : "bg-sacred-100 border-sacred-200 text-sacred-300 cursor-not-allowed dark:bg-stone-800 dark:border-stone-700 dark:text-stone-600"
                    )}
                  >
                    {isCompleted ? (
                      <Check size={36} strokeWidth={3} />
                    ) : (
                      <Scroll size={32} strokeWidth={1.5} />
                    )}
                    
                    {/* Shine effect */}
                    {isUnlocked && !isCompleted && (
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    )}
                  </button>
                </div>

                {/* Center Node */}
                <div className={clsx(
                  "w-5 h-5 rounded-full border-2 z-20 shadow-sm",
                  isPassed 
                    ? "bg-yellow-400 border-yellow-600 shadow-yellow-400/50" 
                    : isCompleted 
                      ? "bg-sacred-500 border-sacred-700"
                      : "bg-sacred-200 border-sacred-300 dark:bg-stone-700 dark:border-stone-600"
                )} />

                {/* Quiz Button */}
                <div className="flex-1 flex justify-start">
                  {isCompleted && (
                    <button
                      onClick={() => isQuizUnlocked && onStartQuiz(guide.id)}
                      disabled={!isQuizUnlocked}
                      className={clsx(
                        "px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 border",
                        isPassed
                          ? "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800"
                          : isQuizUnlocked
                            ? "bg-white text-sacred-700 border-sacred-200 hover:bg-sacred-50 hover:border-sacred-300"
                            : "bg-sacred-50 text-sacred-300 border-sacred-100 cursor-not-allowed opacity-50"
                      )}
                    >
                      {isPassed ? (
                        <>
                          <Star size={14} fill="currentColor" />
                          <span>Aprobado</span>
                        </>
                      ) : (
                        <>
                          {isQuizUnlocked ? <Star size={14} /> : <Lock size={14} />}
                          <span>Reflexión</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Title Label */}
              <div className={clsx(
                "mt-4 px-6 py-3 rounded-xl text-center max-w-[240px] border transition-all",
                isUnlocked 
                  ? isDarkMode 
                    ? "bg-stone-800 border-stone-700 text-sacred-100 shadow-lg" 
                    : "bg-white border-sacred-100 text-sacred-800 shadow-md shadow-sacred-200/50"
                  : "opacity-50 border-transparent"
              )}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sacred-400 block mb-1">Guía {index + 1}</span>
                <span className="font-display font-bold text-lg leading-tight block">{guide.title}</span>
              </div>
            </motion.div>
          );
        })}
        
        {/* Future Path */}
        <div className="relative z-10 pt-4 opacity-40">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-sacred-400 flex items-center justify-center bg-transparent">
            <span className="text-sacred-400 text-2xl font-serif">...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
