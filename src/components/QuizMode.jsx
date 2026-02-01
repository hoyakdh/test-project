import React, { useState, useEffect } from 'react';
import { idioms } from '../data/idioms';
import { CheckCircle, XCircle, RefreshCw, Play, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizMode() {
    const [gameState, setGameState] = useState('idle'); // idle, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

    // Generate Questions
    const startQuiz = () => {
        // Pick 5 random questions for short session
        const pool = [...idioms].sort(() => 0.5 - Math.random());
        const selected = pool.slice(0, 5); // 5 questions

        const newQuestions = selected.map(item => {
            // 50/50 Chance for Meaning vs Blank
            const type = Math.random() > 0.5 ? 'meaning' : 'blank';

            // Generate distractors
            const distractors = idioms
                .filter(i => i.id !== item.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(i => i.idiom);

            const options = [...distractors, item.idiom].sort(() => 0.5 - Math.random());

            return {
                target: item,
                type,
                options,
                questionText: type === 'meaning' ? item.meaning : item.example.replace(item.idiom, 'OOO')
            };
        });

        setQuestions(newQuestions);
        setScore(0);
        setCurrentIndex(0);
        setGameState('playing');
        setFeedback(null);
    };

    const handleAnswer = (selectedOption) => {
        const currentQ = questions[currentIndex];
        const isCorrect = selectedOption === currentQ.target.idiom;

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#0ea5e9', '#6366f1']
            });
        } else {
            setFeedback('wrong');
        }

        // Next question delay
        setTimeout(() => {
            setFeedback(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
            } else {
                finishGame();
            }
        }, 1500);
    };

    const finishGame = () => {
        setGameState('finished');
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    };

    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-5xl mb-4">
                    🎓
                </div>
                <h2 className="text-2xl font-bold text-slate-800">사자성어 실력 테스트</h2>
                <p className="text-slate-500">
                    총 5문제가 출제됩니다.<br />
                    뜻 맞추기와 빈칸 채우기에 도전해보세요!
                </p>
                <button
                    onClick={startQuiz}
                    className="w-full max-w-xs py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-5 h-5 fill-current" />
                    퀴즈 시작하기
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-8 animate-scale-up">
                <div>
                    <span className="text-6xl font-black text-primary-600">{score * 20}</span>
                    <span className="text-2xl text-slate-400 font-bold"> 점</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {score === 5 ? '완벽해요! 🎉' : score >= 3 ? '잘했어요! 👏' : '조금만 더 노력해요 💪'}
                </h2>
                <p className="text-slate-500">
                    5문제 중 {score}문제를 맞혔습니다.
                </p>
                <button
                    onClick={startQuiz}
                    className="w-full max-w-xs py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    다시 도전하기
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-md mx-auto relative pb-20">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6 px-2">
                <span className="text-sm font-bold text-primary-600">
                    Question {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-sm font-bold text-slate-400">
                    Score: {score}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center mb-6 relative overflow-hidden">
                {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 animate-fade-in ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {feedback === 'correct' ? (
                            <CheckCircle className="w-20 h-20" />
                        ) : (
                            <XCircle className="w-20 h-20" />
                        )}
                    </div>
                )}

                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500 mb-4">
                    {currentQ.type === 'meaning' ? '뜻에 맞는 사자성어는?' : '빈칸에 들어갈 말은?'}
                </span>
                <h3 className="text-xl font-bold text-slate-800 leading-relaxed word-keep-all">
                    {currentQ.questionText}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => !feedback && handleAnswer(option)}
                        className="w-full p-4 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-slate-700 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all text-left animate-slide-up"
                        style={{ animationDelay: `${idx * 100}ms` }}
                        disabled={!!feedback}
                    >
                        {idx + 1}. {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
