import React, { useState, useMemo } from 'react';
import { idioms, categories } from '../data/idioms';
import IdiomModal from './IdiomModal';
import { Search, CheckCircle, ChevronDown } from 'lucide-react';

export default function Dictionary({ learnedIds, onToggleLearned }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIdiom, setSelectedIdiom] = useState(null);


    const [expandedCategories, setExpandedCategories] = useState({});

    // Toggle category expansion
    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Filter idioms
    const filteredIdioms = idioms.filter(item =>
        item.idiom.includes(searchTerm) ||
        item.meaning.includes(searchTerm) ||
        item.hanja.includes(searchTerm)
    );

    // Group by category
    const idiomsByCategory = useMemo(() => {
        const groups = {};
        // Initialize with empty arrays for all categories to maintain order
        categories.forEach(cat => groups[cat] = []);

        filteredIdioms.forEach(idiom => {
            if (groups[idiom.category]) {
                groups[idiom.category].push(idiom);
            }
        });
        return groups;
    }, [filteredIdioms]);

    // Determine which categories to show
    // If searching, show all categories that have results.
    // If not searching, show all categories (but they might be collapsed).
    const activeCategories = categories.filter(cat => idiomsByCategory[cat]?.length > 0);

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

            {/* Results: Accordion List */}
            <div className="space-y-3">
                {activeCategories.length > 0 ? (
                    activeCategories.map((category) => {
                        const isExpanded = searchTerm ? true : expandedCategories[category];
                        const categoryIdioms = idiomsByCategory[category];

                        return (
                            <div key={category} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                {/* Category Header */}
                                <button
                                    onClick={() => !searchTerm && toggleCategory(category)}
                                    className={`w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 dark:text-white ${!searchTerm && 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="textlg">{category}</span>
                                        <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                            {categoryIdioms.length}
                                        </span>
                                    </div>
                                    {!searchTerm && (
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </button>

                                {/* Idioms List (Expanded) */}
                                <div
                                    className={`divide-y divide-slate-100 dark:divide-slate-700 ${isExpanded ? 'block' : 'hidden'}`}
                                >
                                    {categoryIdioms.map(idiom => (
                                        <div
                                            key={idiom.id}
                                            onClick={() => setSelectedIdiom(idiom)}
                                            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex items-center justify-between group"
                                        >
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    <span className="mr-2">{idiom.idiom}</span>
                                                    <span className="text-sm font-normal text-slate-400 font-serif">
                                                        {idiom.hanja}
                                                    </span>
                                                </h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                                    {idiom.meaning}
                                                </p>
                                            </div>
                                            {learnedIds.includes(idiom.id) && (
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-3" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
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
