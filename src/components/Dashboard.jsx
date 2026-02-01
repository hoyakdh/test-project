import React, { useMemo, useState } from 'react';
import { idioms } from '../data/idioms';
import HanjaTooltip from './HanjaTooltip';
import { Trophy, ChevronRight, Star, RotateCcw, User, Edit2, Check, Moon, Sun } from 'lucide-react';

export default function Dashboard({ onNavigate, learnedCount, totalCount, onReset, userName, onNameChange, isDarkMode, onToggleDarkMode, levelInfo }) {
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
                                className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150 ease-in-out"
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
                    <div className="flex items-center justify-between w-full animate-fade-in">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                반가워요, <span className="text-primary-600 dark:text-primary-400">{userName}</span>님! 👋
                            </h1>
                            <button
                                onClick={() => {
                                    setTempName(userName);
                                    setIsEditingName(true);
                                }}
                                className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={onToggleDarkMode}
                            className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title={isDarkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
                <div className="flex gap-1 mb-4">
                    {dailyIdiom.hanja.split('').map((char, index) => (
                        <HanjaTooltip
                            key={index}
                            char={char}
                            meaning={dailyIdiom.hanjaMeanings?.[index]}
                            className="text-xl opacity-90 font-serif text-white"
                        />
                    ))}
                </div>
                <p className="text-lg font-medium opacity-95 text-pretty line-clamp-2 md:line-clamp-none whitespace-pre-line">{dailyIdiom.meaning}</p>

                <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm italic opacity-80">
                        "{dailyIdiom.examples ? dailyIdiom.examples[0] : dailyIdiom.example}"
                    </p>
                </div>
            </section>

            {/* Learning Status & Level Card */}
            <section className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${levelInfo ? levelInfo.color : 'from-gray-400 to-gray-600'} -translate-y-1/2 translate-x-1/2`} />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="text-xl">{levelInfo ? levelInfo.icon : '🐶'}</span>
                            {userName ? `${userName}님의 ` : '나의 '}서당 등급
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${levelInfo ? levelInfo.color : 'from-gray-400 to-gray-600'} text-white shadow-sm`}>
                                Lv. {levelInfo ? levelInfo.level : 1}
                            </span>
                            {learnedCount > 0 && (
                                <button
                                    onClick={onReset}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                    title="학습 기록 초기화"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md bg-gradient-to-br ${levelInfo ? levelInfo.color : 'from-gray-100 to-gray-300'} text-white ring-4 ring-white dark:ring-slate-700`}>
                            {levelInfo ? levelInfo.icon : '🐶'}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5">
                                {levelInfo ? levelInfo.title : '서당개'}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {levelInfo ? levelInfo.desc : '시작이 반!'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-800 dark:text-white">
                                {learnedCount} <span className="text-xs font-medium text-slate-400">/ {totalCount}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learned</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
                            <span>
                                {levelInfo?.level < 5 ? `다음 레벨까지 ${levelInfo.next - learnedCount}개 남음` : '최고 레벨 달성!'}
                            </span>
                            <span>{Math.round((learnedCount / totalCount) * 100)}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-1 relative bg-gradient-to-r ${levelInfo ? levelInfo.color : 'from-gray-400 to-gray-600'}`}
                                style={{ width: `${(learnedCount / totalCount) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onNavigate('study')}
                    className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <span className="text-xl">📚</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">학습하기</h3>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        카테고리별 공부
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </div>
                </button>

                <button
                    onClick={() => onNavigate('quiz')}
                    className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                        <span className="text-xl">📝</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">퀴즈 풀기</h3>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        실력 테스트
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </div>
                </button>

                <button
                    onClick={() => onNavigate('flashcard')}
                    className="col-span-2 p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500 hover:shadow-md transition-all text-left group flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                            <span className="text-xl">🃏</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">플래시카드 (깜빡이)</h3>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                뒤집으며 재미있게 암기하기
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}
