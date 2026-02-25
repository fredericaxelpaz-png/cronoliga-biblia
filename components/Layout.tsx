import React from 'react';
import { useStore } from '../store';
import { BookOpen, Trophy, User, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'guides' | 'progress' | 'profile';
  onTabChange: (tab: 'guides' | 'progress' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { getCurrentUser } = useStore();
  const user = getCurrentUser();
  const isDarkMode = user?.isDarkMode || false;

  return (
    <div className={clsx('min-h-screen flex flex-col transition-colors duration-300', isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900')}>
      <main className="flex-1 pb-20 md:pb-0 md:pl-20 max-w-3xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={clsx(
        "fixed bottom-0 left-0 w-full border-t md:hidden z-50",
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => onTabChange('guides')}
            className={clsx("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === 'guides' ? "text-brand-500" : "text-slate-400")}
          >
            <BookOpen size={24} />
            <span className="text-xs mt-1 font-medium">Guías</span>
          </button>
          <button 
            onClick={() => onTabChange('progress')}
            className={clsx("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === 'progress' ? "text-brand-500" : "text-slate-400")}
          >
            <Trophy size={24} />
            <span className="text-xs mt-1 font-medium">Progreso</span>
          </button>
          <button 
            onClick={() => onTabChange('profile')}
            className={clsx("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === 'profile' ? "text-brand-500" : "text-slate-400")}
          >
            <User size={24} />
            <span className="text-xs mt-1 font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className={clsx(
        "hidden md:flex fixed top-0 left-0 h-full w-20 flex-col items-center py-8 border-r z-50",
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="mb-8">
           <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
             {user?.userName.charAt(0).toUpperCase() || 'B'}
           </div>
        </div>
        
        <div className="flex flex-col gap-8 w-full">
          <button 
            onClick={() => onTabChange('guides')}
            className={clsx("flex flex-col items-center p-2 w-full transition-colors hover:bg-black/5 dark:hover:bg-white/5", activeTab === 'guides' ? "text-brand-500 border-r-2 border-brand-500" : "text-slate-400")}
          >
            <BookOpen size={28} />
            <span className="text-xs mt-2 font-medium">Guías</span>
          </button>
          <button 
            onClick={() => onTabChange('progress')}
            className={clsx("flex flex-col items-center p-2 w-full transition-colors hover:bg-black/5 dark:hover:bg-white/5", activeTab === 'progress' ? "text-brand-500 border-r-2 border-brand-500" : "text-slate-400")}
          >
            <Trophy size={28} />
            <span className="text-xs mt-2 font-medium">Progreso</span>
          </button>
          <button 
            onClick={() => onTabChange('profile')}
            className={clsx("flex flex-col items-center p-2 w-full transition-colors hover:bg-black/5 dark:hover:bg-white/5", activeTab === 'profile' ? "text-brand-500 border-r-2 border-brand-500" : "text-slate-400")}
          >
            <User size={28} />
            <span className="text-xs mt-2 font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
