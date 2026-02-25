import React, { useState } from 'react';
import { Guide, Question } from '../types';
import { useStore } from '../store';
import { Check, X, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface QuizScreenProps {
  guide: Guide;
  onBack: () => void;
  onPass: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ guide, onBack, onPass }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const { markGuidePassed, getCurrentUser } = useStore();
  const user = getCurrentUser();
  const isDarkMode = user?.isDarkMode || false;
  const currentQuestion = guide.questions[currentQuestionIndex];
  const totalQuestions = guide.questions.length;
  const passingScore = 5;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0) >= passingScore) {
        markGuidePassed(guide.id);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const passed = score >= passingScore;
    return (
      <div className={clsx(
        "flex flex-col items-center justify-center min-h-[60vh] p-6 text-center rounded-2xl",
        isDarkMode ? "bg-stone-900 text-sacred-100" : "bg-parchment text-sacred-900"
      )}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={clsx(
            "w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 shadow-xl",
            passed 
              ? "bg-olive-100 text-olive-600 border-olive-200 dark:bg-olive-900/30 dark:text-olive-400 dark:border-olive-800" 
              : "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
          )}
        >
          {passed ? <Check size={48} strokeWidth={4} /> : <X size={48} strokeWidth={4} />}
        </motion.div>
        
        <h2 className="text-3xl font-bold font-display mb-2">
          {passed ? "¡Bendiciones!" : "Sigue intentando"}
        </h2>
        
        <p className={clsx("text-lg mb-8 font-serif italic", isDarkMode ? "text-sacred-300" : "text-sacred-600")}>
          Obtuviste {score} de {totalQuestions} correctas.
          <br />
          {passed ? "Has comprendido la enseñanza." : "Necesitas 5/5 para avanzar."}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className={clsx(
              "px-6 py-3 rounded-xl font-bold transition-colors font-display tracking-wide border",
              isDarkMode 
                ? "bg-stone-800 text-sacred-200 border-stone-700 hover:bg-stone-700" 
                : "bg-white text-sacred-700 border-sacred-200 hover:bg-sacred-50"
            )}
          >
            Volver
          </button>
          
          {passed ? (
            <button
              onClick={onPass}
              className="px-6 py-3 rounded-xl font-bold bg-sacred-gradient text-white hover:opacity-90 shadow-lg shadow-sacred-500/30 font-display tracking-wide"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="px-6 py-3 rounded-xl font-bold bg-sacred-gradient text-white hover:opacity-90 shadow-lg shadow-sacred-500/30 flex items-center font-display tracking-wide"
            >
              <RefreshCw size={20} className="mr-2" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex flex-col h-screen md:h-[calc(100vh-2rem)] md:mt-4 md:rounded-2xl overflow-hidden shadow-2xl",
      isDarkMode ? "bg-stone-900" : "bg-parchment"
    )}>
      {/* Header */}
      <div className={clsx(
        "p-4 flex items-center justify-between border-b",
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white/80 backdrop-blur-md border-sacred-200"
      )}>
        <button onClick={onBack} className={clsx("hover:text-sacred-500 transition-colors", isDarkMode ? "text-sacred-400" : "text-sacred-600")}>
          <X size={24} />
        </button>
        <div className={clsx("w-full mx-4 h-2 rounded-full", isDarkMode ? "bg-stone-700" : "bg-sacred-100")}>
          <div 
            className="h-full bg-sacred-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <span className={clsx("font-bold font-mono", isDarkMode ? "text-sacred-400" : "text-sacred-500")}>
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
        <h2 className={clsx(
          "text-xl md:text-2xl font-bold mb-8 leading-snug font-display text-center",
          isDarkMode ? "text-sacred-100" : "text-sacred-900"
        )}>
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswer;
            
            let buttonStyle = isDarkMode 
              ? "bg-stone-800 border-stone-700 text-sacred-200 hover:bg-stone-700" 
              : "bg-white border-sacred-200 text-sacred-800 hover:bg-sacred-50";
            
            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = "bg-olive-100 border-olive-500 text-olive-800 dark:bg-olive-900/30 dark:border-olive-500 dark:text-olive-400";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400";
              } else {
                buttonStyle = "opacity-50 " + buttonStyle;
              }
            } else if (isSelected) {
              buttonStyle = "border-sacred-500 bg-sacred-50 text-sacred-900 dark:bg-sacred-900/20 dark:border-sacred-500 dark:text-sacred-100 ring-1 ring-sacred-500";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={clsx(
                  "w-full p-5 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between font-sans shadow-sm",
                  buttonStyle
                )}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <Check size={20} className="text-olive-600 dark:text-olive-400" />}
                {isAnswered && isSelected && !isCorrect && <X size={20} className="text-red-600 dark:text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "mt-8 p-5 rounded-xl border flex gap-4 shadow-md",
                selectedOption === currentQuestion.correctAnswer
                  ? "bg-olive-50 border-olive-200 text-olive-900 dark:bg-olive-900/20 dark:border-olive-800 dark:text-olive-100"
                  : "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100"
              )}
            >
              <div className="shrink-0 mt-1">
                {selectedOption === currentQuestion.correctAnswer 
                  ? <Check size={24} /> 
                  : <AlertCircle size={24} />
                }
              </div>
              <div>
                <p className="font-bold mb-1 font-display text-lg">
                  {selectedOption === currentQuestion.correctAnswer ? "¡Correcto!" : "Incorrecto"}
                </p>
                <p className="text-sm opacity-90 font-serif leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action */}
      <div className={clsx(
        "p-6 border-t",
        isDarkMode ? "bg-stone-800 border-stone-700" : "bg-white/90 backdrop-blur-md border-sacred-200"
      )}>
        {!isAnswered ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className={clsx(
              "w-full py-4 rounded-xl font-bold text-white transition-all font-display tracking-wide text-lg shadow-lg",
              selectedOption !== null 
                ? "bg-sacred-gradient hover:opacity-90 shadow-sacred-500/30" 
                : "bg-sacred-200 cursor-not-allowed dark:bg-stone-700 text-sacred-400 dark:text-stone-500"
            )}
          >
            Comprobar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={clsx(
              "w-full py-4 rounded-xl font-bold text-white transition-all font-display tracking-wide text-lg shadow-lg",
              selectedOption === currentQuestion.correctAnswer
                ? "bg-olive-600 hover:bg-olive-700 shadow-olive-500/30"
                : "bg-red-600 hover:bg-red-700 shadow-red-500/30"
            )}
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};
