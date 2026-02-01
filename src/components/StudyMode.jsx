```javascript
import React, { useState } from 'react';
import { categories, idioms } from '../data/idioms';
import IdiomModal from './IdiomModal';
import { ChevronRight, CheckCircle } from 'lucide-react';

export default function StudyMode({ learnedIds, onToggleLearned }) {
    const [selectedCategory, setSelectedCategory] = useState('전체'); // New state for category
    const [selectedIdiom, setSelectedIdiom] = useState(null);

    // Filter idioms by category
    const filteredIdioms = selectedCategory === '전체'
        ? idioms
        : idioms.filter(item => item.category === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setSelectedCategory('전체')}
                    className={`px - 4 py - 2 rounded - full whitespace - nowrap text - sm font - bold transition - colors ${
    selectedCategory === '전체'
    ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none'
    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
} `}
                >
                    전체
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px - 4 py - 2 rounded - full whitespace - nowrap text - sm font - bold transition - colors ${
    selectedCategory === cat
    ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none'
    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
} `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Idiom List */}
            <div className="grid gap-3">
                {filteredIdioms.map((idiom) => (
                    <div
                        key={idiom.id}
                        onClick={() => setSelectedIdiom(idiom)}
                        className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[10px]">
                                    {idiom.category}
                                </span>
                                {learnedIds.includes(idiom.id) && (
                                    <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                                        <CheckCircle className="w-3 h-3" />
                                        완료
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {idiom.idiom}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                {idiom.meaning}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                ))}
            </div>

            <IdiomModal
                idiom={selectedIdiom}
                onClose={() => setSelectedIdiom(null)}
                isLearned={selectedIdiom && learnedIds.includes(selectedIdiom.id)}
                onToggle={onToggleLearned}
            />
        </div>
    );
}
```
