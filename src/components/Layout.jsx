import React from 'react';
import { Home, BookOpen, GraduationCap, Search, Menu, Moon, Sun } from 'lucide-react';

export default function Layout({ children, currentTab, onTabChange, isDarkMode, onToggleDarkMode }) {
    const navItems = [
        { id: 'home', label: '홈', icon: Home },
        { id: 'study', label: '학습', icon: BookOpen },
        { id: 'quiz', label: '퀴즈', icon: GraduationCap },
        { id: 'dict', label: '사전', icon: Search },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
            {/* Heavy Header for Desktop / Simple for Mobile */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors duration-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        <span>사자성어 100</span>
                    </h1>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-1 items-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentTab === item.id
                                    ? 'bg-primary-50 dark:bg-slate-700 text-primary-700 dark:text-primary-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                        {/* Dark Mode Toggle (Desktop) */}
                        <button
                            onClick={onToggleDarkMode}
                            className="ml-2 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24 md:pb-8">
                {children}

                {/* Footer */}
                <footer className="mt-8 py-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <p>제작자: hoyakdh@icloud.com</p>
                </footer>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe-area transition-colors duration-200">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                    {/* Dark Mode Toggle (Mobile) */}
                    <button
                        onClick={onToggleDarkMode}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        <span className="text-[10px] font-medium">{isDarkMode ? '라이트' : '다크'}</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
