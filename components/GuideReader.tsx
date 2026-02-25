import React, { useState } from 'react';
import { Guide } from '../types';
import { useStore } from '../store';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideReaderProps {
  guide: Guide;
  onBack: () => void;
  onComplete: () => void;
}

export const GuideReader: React.FC<GuideReaderProps> = ({ guide, onBack, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { markGuideCompleted, getCurrentUser } = useStore();
  const user = getCurrentUser();
  const isDarkMode = user?.isDarkMode || false;
  const totalPages = guide.content.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    markGuideCompleted(guide.id);
    onComplete();
  };

  return (
    <div className={clsx(
      "flex flex-col h-screen md:h-[calc(100vh-2rem)] md:mt-4 md:rounded-2xl overflow-hidden relative shadow-2xl",
      isDarkMode ? "bg-stone-900" : "bg-parchment"
    )}>
      {/* Header */}
      <header className={clsx(
        "flex items-center justify-between p-4 border-b z-20 shadow-sm",
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white/80 backdrop-blur-md border-sacred-200"
      )}>
        <button 
          onClick={onBack}
          className={clsx(
            "p-2 rounded-full transition-colors",
            isDarkMode ? "hover:bg-stone-700 text-sacred-200" : "hover:bg-sacred-50 text-sacred-800"
          )}
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <span className={clsx("text-[10px] uppercase tracking-widest font-bold block", isDarkMode ? "text-sacred-400" : "text-sacred-500")}>
            Guía {guide.order}
          </span>
          <h2 className={clsx("font-display font-bold text-lg", isDarkMode ? "text-sacred-100" : "text-sacred-900")}>
            {guide.title}
          </h2>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Progress Bar */}
      <div className={clsx("w-full h-1.5", isDarkMode ? "bg-stone-800" : "bg-sacred-100")}>
        <div 
          className="h-full bg-sacred-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-2xl mx-auto py-4"
          >
            <div className="flex justify-center mb-6">
              <BookOpen size={32} strokeWidth={1} className={isDarkMode ? "text-sacred-600" : "text-sacred-300"} />
            </div>

            <h3 className={clsx(
              "text-3xl font-display font-bold mb-8 text-center leading-tight",
              isDarkMode ? "text-sacred-200" : "text-sacred-800"
            )}>
              {guide.content[currentPage].title}
            </h3>
            
            <div className={clsx(
              "prose prose-lg leading-relaxed font-sans text-justify mx-auto",
              isDarkMode ? "text-sacred-100/90" : "text-sacred-900/90"
            )}>
              {guide.content[currentPage].body.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-6 first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] first-letter:text-sacred-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <footer className={clsx(
        "p-6 border-t flex justify-between items-center z-20",
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white/90 backdrop-blur-md border-sacred-200"
      )}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={clsx(
            "flex items-center px-5 py-3 rounded-xl font-medium transition-colors font-display tracking-wide",
            currentPage === 0 
              ? "text-sacred-300 cursor-not-allowed opacity-50" 
              : isDarkMode ? "text-sacred-200 hover:bg-stone-700" : "text-sacred-800 hover:bg-sacred-50"
          )}
        >
          <ChevronLeft size={20} className="mr-1" />
          Anterior
        </button>

        {currentPage === totalPages - 1 ? (
          <button
            onClick={handleFinish}
            className="flex items-center px-8 py-3 rounded-xl font-bold bg-sacred-gradient text-white shadow-lg shadow-sacred-500/30 hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 font-display tracking-wide"
          >
            <CheckCircle size={20} className="mr-2" />
            Completar Lectura
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={clsx(
              "flex items-center px-8 py-3 rounded-xl font-bold transition-all font-display tracking-wide shadow-md",
              isDarkMode 
                ? "bg-sacred-100 text-stone-900 hover:bg-white" 
                : "bg-sacred-800 text-sacred-50 hover:bg-sacred-900"
            )}
          >
            Siguiente
            <ChevronRight size={20} className="ml-1" />
          </button>
        )}
      </footer>
    </div>
  );
};
