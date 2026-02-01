import React from 'react';
import { Home, BookOpen, GraduationCap, Search, Menu } from 'lucide-react';

export default function Layout({ children, currentTab, onTabChange }) {
    const navItems = [
        { id: 'home', label: '홈', icon: Home },
        { id: 'study', label: '학습', icon: BookOpen },
        { id: 'quiz', label: '퀴즈', icon: GraduationCap },
        { id: 'dict', label: '사전', icon: Search },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Heavy Header for Desktop / Simple for Mobile */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        <span>사자성어 100</span>
                    </h1>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentTab === item.id
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24 md:pb-8">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 pb-safe-area">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === item.id ? 'text-primary-600' : 'text-slate-400'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
