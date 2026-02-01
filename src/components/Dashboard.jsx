import React, { useMemo, useState } from 'react';
import { idioms } from '../data/idioms';
import { Trophy, ChevronRight, Star, RotateCcw, User, Edit2, Check } from 'lucide-react';

export default function Dashboard({ onNavigate, learnedCount, totalCount, onReset, userName, onNameChange }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    // Random daily idiom (consistent for the day based on date)
    const dailyIdiom = useMemo(() => {
        const today = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = today.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % idioms.length;
        return idioms[index] || idioms[0];
    }, []);

    const handleSaveName = () => {
        if (tempName.trim()) {
            onNameChange(tempName.trim());
            setIsEditingName(false);
        }
    };

    const progress = Math.round((learnedCount / totalCount) * 100);

    return (
        <div className="space-y-6">
            {/* Greeting / Name Input */}
            <div className="flex items-center justify-between">
                {!userName || isEditingName ? (
                    <div className="flex items-center gap-2 w-full animate-fade-in">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150 ease-in-out"
                                placeholder="이름을 입력해주세요"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            />
                            <button
                                onClick={handleSaveName}
                                className="absolute inset-y-1 right-1 px-3 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-700 transition"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <h1 className="text-2xl font-bold text-slate-800">
                            반가워요, <span className="text-primary-600">{userName}</span>님! 👋
                        </h1>
                        <button
                            onClick={() => {
                                setTempName(userName);
                                setIsEditingName(true);
                            }}
                            className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Daily Banner */}
            <section className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        오늘의 사자성어
                    </span>
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <h2 className="text-3xl font-extrabold mb-1">{dailyIdiom.idiom}</h2>
                <p className="text-xl opacity-90 font-serif mb-4">{dailyIdiom.hanja}</p>
                <p className="text-lg font-medium opacity-95 text-pretty line-clamp-2 md:line-clamp-none whitespace-pre-line">{dailyIdiom.meaning}</p>

                <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm italic opacity-80">
                        "{dailyIdiom.examples ? dailyIdiom.examples[0] : dailyIdiom.example}"
                    </p>
                </div>
            </section>

            {/* Learning Progress */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        {userName ? `${userName}님의 ` : '나의 '}학습 현황
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">
                            {learnedCount} / {totalCount} 완료
                        </span>
                        {learnedCount > 0 && (
                            <button
                                onClick={onReset}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                title="학습 기록 초기화"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-right text-xs text-slate-400 mt-2">
                    {progress}% 달성
                </p>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onNavigate('study')}
                    className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                        <span className="text-xl">📚</span>
                    </div>
                    <h3 className="font-bold text-slate-800">학습하기</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        카테고리별 공부
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </div>
                </button>

                <button
                    onClick={() => onNavigate('quiz')}
                    className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                        <span className="text-xl">📝</span>
                    </div>
                    <h3 className="font-bold text-slate-800">퀴즈 풀기</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        실력 테스트
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </div>
                </button>

                <button
                    onClick={() => onNavigate('flashcard')}
                    className="col-span-2 p-5 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all text-left group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-xl">🃏</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">플래시카드 (깜빡이)</h3>
                            <div className="text-sm text-slate-500 mt-1">
                                뒤집으며 재미있게 암기하기
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}
