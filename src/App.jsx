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
  // Store IDs of learned idioms
  const [learnedIds, setLearnedIds] = useState([]);
  const [userName, setUserName] = useState('');

  // Initialize progress and user name
  useEffect(() => {
    const savedProgress = localStorage.getItem('sajaseong-progress');
    if (savedProgress) {
      setLearnedIds(JSON.parse(savedProgress));
    }

    const savedName = localStorage.getItem('sajaseong-username');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Update Name
  const handleNameChange = (name) => {
    setUserName(name);
    localStorage.setItem('sajaseong-username', name);
  };

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

  // Reset progress
  const resetProgress = () => {
    if (window.confirm('정말 모든 학습 기록을 초기화하시겠습니까? 되돌릴 수 없습니다.')) {
      setLearnedIds([]);
      localStorage.removeItem('sajaseong-progress');
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard
          onNavigate={setCurrentTab}
          learnedCount={learnedIds.length}
          totalCount={idioms.length}
          onReset={resetProgress}
          userName={userName}
          onNameChange={handleNameChange}
        />;
      case 'study':
        return <StudyMode learnedIds={learnedIds} onToggleLearned={toggleLearned} />;
      case 'flashcard':
        return <FlashcardMode />;
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
