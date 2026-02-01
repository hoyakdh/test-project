import React, { useState } from 'react';
import { categories, idioms } from '../data/idioms';
import IdiomModal from './IdiomModal';
import { ChevronRight } from 'lucide-react';

export default function StudyMode() {
    // Tabs allow scrolling on mobile
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [selectedIdiom, setSelectedIdiom] = useState(null);

    // Filter idioms by category
    const filteredIdioms = idioms.filter(item => item.category === activeCategory);

    return (
        <div>
            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
                {filteredIdioms.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedIdiom(item)}
                        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all text-left"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-400">#{item.id}</span>
                                <h3 className="font-bold text-slate-800 truncate">{item.idiom}</h3>
                            </div>
                            <p className="text-sm text-slate-500 truncate font-serif">{item.hanja}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                ))}
            </div>

            {/* Modal */}
            {selectedIdiom && (
                <IdiomModal
                    idiom={selectedIdiom}
                    onClose={() => setSelectedIdiom(null)}
                />
            )}
        </div>
    );
}
