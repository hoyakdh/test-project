import React, { useState, useEffect } from 'react';
import { idioms } from '../data/idioms';
import { ChevronLeft, ChevronRight, Shuffle, Repeat } from 'lucide-react';

export default function FlashcardMode() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [shuffledIdioms, setShuffledIdioms] = useState([...idioms]);

    // Shuffle on mount
    useEffect(() => {
        // Simple shuffle for variety
        setShuffledIdioms([...idioms].sort(() => Math.random() - 0.5));
    }, []);

    const currentCard = shuffledIdioms[currentIndex];

    const handleNext = (e) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % shuffledIdioms.length);
        }, 150); // Small delay for better UX if flipping back? No, just reset immediate.
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + shuffledIdioms.length) % shuffledIdioms.length);
    };

    const handleShuffle = (e) => {
        e.stopPropagation();
        setIsFlipped(false);
        setShuffledIdioms([...idioms].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px]">
            {/* Controls Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    {currentIndex + 1} / {shuffledIdioms.length}
                </span>
                <button
                    onClick={handleShuffle}
                    className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 hover:border-primary-200 transition-colors"
                >
                    <Shuffle className="w-4 h-4" />
                    섞기
                </button>
            </div>

            {/* Card Area */}
            <div className="flex-1 perspective-1000 relative w-full max-w-lg mx-auto">
                <div
                    onClick={handleCardClick}
                    className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front Face (Idiom) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 hover:border-primary-200 hover:shadow-2xl transition-all">
                        <span className="text-sm font-bold text-primary-500 mb-6 bg-primary-50 px-3 py-1 rounded-full">
                            터치해서 뜻 보기
                        </span>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-6 break-keep leading-tight">
                            {currentCard.idiom}
                        </h2>
                        <p className="text-3xl md:text-4xl font-serif text-slate-400">
                            {currentCard.hanja}
                        </p>
                    </div>

                    {/* Back Face (Meaning) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8">
                        <span className="text-sm font-bold text-slate-400 mb-6 border border-slate-600 px-3 py-1 rounded-full">
                            {currentCard.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-8 leading-snug">
                            {currentCard.meaning}
                        </h3>
                        <div className="w-full bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <p className="text-lg opacity-90 italic">
                                "{currentCard.examples[0]}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons (Bottom) */}
            <div className="flex items-center justify-between gap-4 mt-8 px-4 max-w-lg mx-auto w-full">
                <button
                    onClick={handlePrev}
                    className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200 transition-all flex-1 flex items-center justify-center gap-2 group"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">이전</span>
                </button>
                <button
                    onClick={handleNext}
                    className="p-4 bg-primary-600 rounded-2xl shadow-md shadow-primary-200 text-white hover:bg-primary-700 transition-all flex-1 flex items-center justify-center gap-2 group"
                >
                    <span className="font-bold">다음</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
