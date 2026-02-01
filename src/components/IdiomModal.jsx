import React from 'react';
import { X, Volume2, BookOpen } from 'lucide-react';

export default function IdiomModal({ idiom, onClose }) {
    if (!idiom) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">

                {/* Header */}
                <div className="bg-primary-50 p-6 text-center border-b border-primary-100">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white/50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <span className="inline-block text-xs font-bold tracking-wider text-primary-600 bg-white px-2 py-1 rounded-full mb-3 uppercase shadow-sm">
                        {idiom.category}
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{idiom.idiom}</h2>
                    <p className="text-2xl font-serif text-slate-600">{idiom.hanja}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Meaning */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <BookOpen className="w-4 h-4" /> 뜻풀이
                        </h3>
                        <p className="text-lg text-slate-800 font-medium leading-relaxed">
                            {idiom.meaning}
                        </p>
                    </div>

                    {/* Example */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">
                            실생활 예시
                        </h3>
                        <p className="text-slate-700 italic leading-relaxed">
                            "{idiom.example}"
                        </p>
                    </div>

                </div>

                {/* Action (Optional: TTS or Mark Learned) */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
