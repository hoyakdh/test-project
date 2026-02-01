import React, { useMemo } from 'react';
import { idioms } from '../data/idioms';
import { Trophy, ChevronRight, Star } from 'lucide-react';

export default function Dashboard({ onNavigate, learnedCount, totalCount }) {
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

    const progress = Math.round((learnedCount / totalCount) * 100);

    return (
        <div className="space-y-6">
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
                <p className="text-lg font-medium opacity-95">{dailyIdiom.meaning}</p>

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
                        나의 학습 현황
                    </h3>
                    <span className="text-sm font-medium text-slate-500">
                        {learnedCount} / {totalCount} 완료
                    </span>
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
            </div>
        </div>
    );
}
