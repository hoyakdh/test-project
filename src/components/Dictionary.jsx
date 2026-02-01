import React, { useState } from 'react';
import { idioms } from '../data/idioms';
import IdiomModal from './IdiomModal';
import { Search } from 'lucide-react';

export default function Dictionary() {
    const [query, setQuery] = useState("");
    const [selectedIdiom, setSelectedIdiom] = useState(null);

    const filtered = idioms.filter(item =>
        item.idiom.includes(query) ||
        item.meaning.includes(query) ||
        item.hanja.includes(query)
    );

    return (
        <div className="min-h-[60vh]">
            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150 ease-in-out"
                    placeholder="사자성어, 뜻, 한자로 검색..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
                {filtered.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                        {filtered.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setSelectedIdiom(item)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                                >
                                    <div>
                                        <span className="text-lg font-bold text-slate-800">{item.idiom}</span>
                                        <span className="ml-2 text-sm text-slate-400 font-serif">{item.hanja}</span>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.meaning}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )}
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
