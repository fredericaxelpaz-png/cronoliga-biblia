import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { GuidesScreen } from './components/GuidesScreen';
import { GuideReader } from './components/GuideReader';
import { QuizScreen } from './components/QuizScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthScreen } from './components/AuthScreen';
import { PinScreen } from './components/PinScreen';
import { useStore } from './store';
import { guides } from './data';

type ViewState = 
  | { type: 'main', tab: 'guides' | 'progress' | 'profile' }
  | { type: 'reading', guideId: string }
  | { type: 'quiz', guideId: string };

const App: React.FC = () => {
  const { currentUser, isPinVerified, checkSession, isLoading } = useStore();
  
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const user = currentUser;
  const isDarkMode = user?.isDarkMode || false;

  const [viewState, setViewState] = useState<ViewState>({ type: 'main', tab: 'guides' });

  // Apply dark mode to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sacred-300 border-t-sacred-600"></div>
      </div>
    );
  }

  // Auth Flow Checks
  if (!currentUser) {
    return <AuthScreen />;
  }

  if (!isPinVerified) {
    return <PinScreen />;
  }

  const handleTabChange = (tab: 'guides' | 'progress' | 'profile') => {
    setViewState({ type: 'main', tab });
  };

  const handleSelectGuide = (guideId: string) => {
    setViewState({ type: 'reading', guideId });
  };

  const handleStartQuiz = (guideId: string) => {
    setViewState({ type: 'quiz', guideId });
  };

  const handleBackToMain = () => {
    setViewState({ type: 'main', tab: 'guides' });
  };

  // Render content based on state
  const renderContent = () => {
    if (viewState.type === 'reading') {
      const guide = guides.find(g => g.id === viewState.guideId);
      if (!guide) return null;
      return (
        <GuideReader 
          guide={guide} 
          onBack={handleBackToMain}
          onComplete={handleBackToMain}
        />
      );
    }

    if (viewState.type === 'quiz') {
      const guide = guides.find(g => g.id === viewState.guideId);
      if (!guide) return null;
      return (
        <QuizScreen 
          guide={guide} 
          onBack={handleBackToMain}
          onPass={handleBackToMain}
        />
      );
    }

    // Main Tabs
    return (
      <Layout activeTab={viewState.tab} onTabChange={handleTabChange}>
        {viewState.tab === 'guides' && (
          <GuidesScreen 
            onSelectGuide={handleSelectGuide} 
            onStartQuiz={handleStartQuiz} 
          />
        )}
        {viewState.tab === 'progress' && <ProgressScreen />}
        {viewState.tab === 'profile' && <ProfileScreen />}
      </Layout>
    );
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-stone-900 transition-colors duration-300">
      {renderContent()}
    </div>
  );
};

export default App;
