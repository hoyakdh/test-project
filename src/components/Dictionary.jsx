```javascript
import React, { useState } from 'react';
import { idioms } from '../data/idioms';
import IdiomModal from './IdiomModal';
import { Search, CheckCircle } from 'lucide-react';

export default function Dictionary({ learnedIds, onToggleLearned }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIdiom, setSelectedIdiom] = useState(null);

    const filteredIdioms = idioms.filter(item =>
        item.idiom.includes(searchTerm) ||
        item.meaning.includes(searchTerm) ||
        item.hanja.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150 ease-in-out"
                    placeholder="사자성어, 뜻, 음 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Results */}
            <div className="space-y-2">
                {filteredIdioms.length > 0 ? (
                    filteredIdioms.map((idiom) => (
                        <div
                            key={idiom.id}
                            onClick={() => setSelectedIdiom(idiom)}
                            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    <span className="mr-2">{idiom.idiom}</span>
                                    <span className="text-sm font-normal text-slate-400 font-serif">
                                        {idiom.hanja}
                                    </span>
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {idiom.meaning}
                                </p>
                            </div>
                            {learnedIds.includes(idiom.id) && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedIdiom && (
                <IdiomModal
                    idiom={selectedIdiom}
                    onClose={() => setSelectedIdiom(null)}
                    isLearned={selectedIdiom && learnedIds.includes(selectedIdiom.id)}
                    onToggle={onToggleLearned}
                />
            )}
        </div>
    );
}
```
