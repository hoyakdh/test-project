import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import Dictionary from './components/Dictionary';
import { idioms } from './data/idioms';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  // Store IDs of learned idioms
  const [learnedIds, setLearnedIds] = useState([]);

  // Initialize progress
  useEffect(() => {
    const saved = localStorage.getItem('sajaseong-progress');
    if (saved) {
      setLearnedIds(JSON.parse(saved));
    }
  }, []);

  // Toggle learned status
  const toggleLearned = (id) => {
    setLearnedIds(prev => {
      const newIds = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];

      localStorage.setItem('sajaseong-progress', JSON.stringify(newIds));
      return newIds;
    });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard onNavigate={setCurrentTab} learnedCount={learnedIds.length} totalCount={idioms.length} />;
      case 'study':
        return <StudyMode learnedIds={learnedIds} onToggleLearned={toggleLearned} />;
      case 'quiz':
        return <QuizMode />;
      case 'dict':
        return <Dictionary learnedIds={learnedIds} onToggleLearned={toggleLearned} />;
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
