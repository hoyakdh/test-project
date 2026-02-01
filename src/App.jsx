import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import Dictionary from './components/Dictionary';
import { idioms } from './data/idioms';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [learnedCount, setLearnedCount] = useState(0);

  // Initialize progress
  useEffect(() => {
    // In a real app, load from localStorage
    const saved = localStorage.getItem('sajaseong-progress');
    if (saved) {
      setLearnedCount(JSON.parse(saved).length);
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard onNavigate={setCurrentTab} learnedCount={learnedCount} totalCount={idioms.length} />;
      case 'study':
        return <StudyMode />;
      case 'quiz':
        return <QuizMode />;
      case 'dict':
        return <Dictionary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
