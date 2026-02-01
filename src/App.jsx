import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import FlashcardMode from './components/FlashcardMode';
import Dictionary from './components/Dictionary';
import { idioms } from './data/idioms';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  // Store IDs of learned idioms
  // Store IDs of learned idioms
  const [learnedIds, setLearnedIds] = useState([]);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize progress, user name, and dark mode
  useEffect(() => {
    const savedProgress = localStorage.getItem('sajaseong-progress');
    if (savedProgress) {
      setLearnedIds(JSON.parse(savedProgress));
    }

    const savedName = localStorage.getItem('sajaseong-username');
    if (savedName) {
      setUserName(savedName);
    }

    const savedTheme = localStorage.getItem('sajaseong-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Level Calculation Logic (Based on learned count)
  const getLevelInfo = (count) => {
    /*
    Lv 1: 0 ~ 19 (서당개) - Next: 20
    Lv 2: 20 ~ 39 (유생) - Next: 40
    Lv 3: 40 ~ 69 (선비) - Next: 70
    Lv 4: 70 ~ 94 (진사) - Next: 95
    Lv 5: 95 ~ 100 (대제학) - Max
    */
    if (count >= 95) return {
      level: 5, title: "대제학", icon: "👑",
      min: 95, max: 100, next: 100,
      desc: "사자성어의 달인, 존경합니다!",
      color: "from-yellow-400 to-amber-600"
    };
    if (count >= 70) return {
      level: 4, title: "진사", icon: "📜",
      min: 70, max: 94, next: 95,
      desc: "과거 급제! 대단한 실력입니다.",
      color: "from-purple-400 to-indigo-600"
    };
    if (count >= 40) return {
      level: 3, title: "선비", icon: "🎩",
      min: 40, max: 69, next: 70,
      desc: "학문의 깊이가 느껴집니다.",
      color: "from-blue-400 to-cyan-600"
    };
    if (count >= 20) return {
      level: 2, title: "유생", icon: "👦",
      min: 20, max: 39, next: 40,
      desc: "배움의 즐거움을 알아가시네요.",
      color: "from-green-400 to-emerald-600"
    };
    return {
      level: 1, title: "서당개", icon: "🐶",
      min: 0, max: 19, next: 20,
      desc: "시작이 반! 풍월을 읊어봅시다.",
      color: "from-stone-400 to-stone-600"
    };
  };

  const levelInfo = getLevelInfo(learnedIds.length);

  // Update Name
  const handleNameChange = (name) => {
    setUserName(name);
    localStorage.setItem('sajaseong-username', name);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sajaseong-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sajaseong-theme', 'light');
      }
      return newMode;
    });
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
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          levelInfo={levelInfo}
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
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
