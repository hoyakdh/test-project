import React, { useState, useEffect } from 'react';
import { idioms } from '../data/idioms';
import { CheckCircle, XCircle, RefreshCw, Play, Home, Timer, Zap, Infinity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizMode() {
    const [gameMode, setGameMode] = useState(null); // null(menu), 'normal', 'timeAttack'
    const [gameState, setGameState] = useState('idle'); // idle, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    // Time Attack State
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);

    // Timer Effect
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            finishGame();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const generateQuestion = (excludeId = null) => {
        const pool = [...idioms];
        const target = pool[Math.floor(Math.random() * pool.length)];

        // 50/50 Chance for Meaning vs Blank
        const type = Math.random() > 0.5 ? 'meaning' : 'blank';

        // Distractors
        const distractors = pool
            .filter(i => i.id !== target.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(i => i.idiom);

        const options = [...distractors, target.idiom].sort(() => 0.5 - Math.random());

        const exampleSentence = target.examples
            ? target.examples[Math.floor(Math.random() * target.examples.length)]
            : target.example;

        return {
            target,
            type,
            options,
            questionText: type === 'meaning' ? target.meaning : exampleSentence.replace(target.idiom, 'OOO')
        };
    };

    const startQuiz = (mode) => {
        setGameMode(mode);
        setScore(0);
        setCurrentIndex(0);
        setGameState('playing');
        setFeedback(null);

        if (mode === 'normal') {
            // Normal Mode: Pre-generate 5 questions
            const pool = [...idioms].sort(() => 0.5 - Math.random());
            const selected = pool.slice(0, 5);
            const newQuestions = selected.map(item => {
                const type = Math.random() > 0.5 ? 'meaning' : 'blank';
                const distractors = idioms.filter(i => i.id !== item.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.idiom);
                const options = [...distractors, item.idiom].sort(() => 0.5 - Math.random());
                const example = item.examples ? item.examples[0] : item.example;
                return {
                    target: item,
                    type,
                    options,
                    questionText: type === 'meaning' ? item.meaning : example.replace(item.idiom, 'OOO')
                };
            });
            setQuestions(newQuestions);
        } else {
            // Time Attack: Generate first question, set timer
            setQuestions([generateQuestion()]);
            setTimeLeft(60);
            setIsActive(true);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQ = questions[currentIndex];
        const isCorrect = selectedOption === currentQ.target.idiom;

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#0ea5e9', '#6366f1']
            });

            // Bonus Time logic
            if (gameMode === 'timeAttack') {
                setTimeLeft(t => Math.min(t + 3, 60)); // Max cap at 60s? or unlimited? Let's cap slightly to prevent farming, or maybe unlimited is fun. Let's do uncapped.
            }

        } else {
            setFeedback('wrong');
        }

        // Delay for next question
        setTimeout(() => {
            setFeedback(null);

            if (gameMode === 'normal') {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(c => c + 1);
                } else {
                    finishGame();
                }
            } else {
                // Time Attack: Add next question dynamically
                if (isActive || timeLeft > 0) { // Check if game still active
                    setQuestions(prev => [...prev, generateQuestion(currentQ.target.id)]);
                    setCurrentIndex(c => c + 1);
                }
            }
        }, 1000); // Faster transition for Time Attack? Maybe 1s is fine.
    };

    const finishGame = () => {
        setGameState('finished');
        setIsActive(false);
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    };

    const reset = () => {
        setGameMode(null);
        setGameState('idle');
        setScore(0);
        setQuestions([]);
        setIsActive(false);
    }

    // -- Renders --

    // 1. Menu Selection
    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in max-w-lg mx-auto">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">도전! 사자성어 퀴즈</h2>
                    <p className="text-slate-500 dark:text-slate-400">자신의 실력에 맞는 모드를 선택하세요.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Normal Mode */}
                    <button
                        onClick={() => startQuiz('normal')}
                        className="p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle className="w-24 h-24 text-primary-500" />
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                            <Play className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">일반 퀴즈</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">5문제를 천천히 풀어보세요. <br />초보자에게 추천합니다.</p>
                    </button>

                    {/* Time Attack Mode */}
                    <button
                        onClick={() => startQuiz('timeAttack')}
                        className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl border-2 border-orange-100 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-xl transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Timer className="w-24 h-24 text-orange-500" />
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">타임 어택</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">60초 동안 최대한 많이! <br />정답 시 +3초 보너스.</p>
                    </button>
                </div>
            </div>
        );
    }

    // 2. Result Screen
    if (gameState === 'finished') {
        const isTimeAttack = gameMode === 'timeAttack';
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-8 animate-scale-up">
                <div>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                        {isTimeAttack ? <Timer className="w-10 h-10 text-orange-500" /> : <TrophyIcon score={score} />}
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">
                        {isTimeAttack ? `${score}개 성공!` : `${score * 20}점`}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isTimeAttack
                            ? '빠른 판단력이 돋보이네요! ⚡️'
                            : score === 5 ? '완벽해요! 🎉' : score >= 3 ? '잘했어요! 👏' : '조금만 더 노력해요 💪'}
                    </p>
                </div>

                <button
                    onClick={reset}
                    className="w-full max-w-xs py-3 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    다시 도전하기
                </button>
            </div>
        );
    }

    // 3. Playing Screen
    const currentQ = questions[currentIndex];

    // Safety check
    if (!currentQ) return null;

    return (
        <div className="max-w-md mx-auto relative pb-20">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-6 px-2">
                {gameMode === 'normal' ? (
                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                        Question {currentIndex + 1} / 5
                    </span>
                ) : (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-lg ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                        <Timer className="w-4 h-4" />
                        {timeLeft}s
                    </div>
                )}

                <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Score: {score}
                </span>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center mb-6 relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
                {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm z-10 animate-fade-in ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {feedback === 'correct' ? (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="w-20 h-20 mb-2" />
                                {gameMode === 'timeAttack' && <span className="text-xl font-bold">+3s</span>}
                            </div>
                        ) : (
                            <XCircle className="w-20 h-20" />
                        )}
                    </div>
                )}

                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                    {currentQ.type === 'meaning' ? '뜻에 맞는 사자성어는?' : '빈칸에 들어갈 말은?'}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed word-keep-all">
                    {currentQ.questionText}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => !feedback && handleAnswer(option)}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-700 transition-all text-left animate-slide-up active:scale-[0.98]"
                        style={{ animationDelay: `${idx * 50}ms` }}
                        disabled={!!feedback}
                    >
                        <span className="inline-block w-6 text-slate-300 dark:text-slate-600 mr-2">{idx + 1}.</span>
                        {option}
                    </button>
                ))}
            </div>

            {/* Quit Button */}
            <button onClick={reset} className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-slate-400 text-sm underline hover:text-slate-600">
                그만두기
            </button>
        </div>
    );
}

function TrophyIcon({ score }) {
    if (score === 5) return <span className="text-5xl">🏆</span>;
    if (score >= 3) return <span className="text-5xl">🥇</span>;
    return <span className="text-5xl">🍀</span>;
}
