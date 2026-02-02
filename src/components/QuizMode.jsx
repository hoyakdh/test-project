import React, { useState, useEffect } from 'react';
import { idioms } from '../data/idioms';
import { CheckCircle, XCircle, RefreshCw, Play, Home, Timer, Zap, Infinity, Keyboard, Lightbulb, VolumeX, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizMode() {
    const [gameMode, setGameMode] = useState(null); // null(menu), 'normal', 'timeAttack', 'typing'
    const [gameState, setGameState] = useState('idle'); // idle, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [inputValue, setInputValue] = useState(""); // For typing mode
    const [showHint, setShowHint] = useState(false); // Hint state

    // Time Attack State
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Audio toggle state

    // Audio Context Ref
    const audioCtxRef = React.useRef(null);

    // Initialize Audio Context on user interaction
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    // Play Tick Sound
    const playTickSound = () => {
        if (!audioCtxRef.current || isMuted) return; // Respect mute state

        const oscillator = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        // Sound characteristics: Short, high-ish pitch for "Tick"
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtxRef.current.currentTime); // 800Hz

        // Envelope: swift attack and decay
        gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtxRef.current.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtxRef.current.currentTime + 0.1);
    };

    // Timer Effect
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => {
                    playTickSound(); // Play sound on tick
                    return time - 1;
                });
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
            questionText: type === 'meaning' ? target.meaning : exampleSentence.replace(target.idiom, 'OOOO')
        };
    };

    const startQuiz = (mode) => {
        initAudio(); // Initialize audio for sound effects
        setGameMode(mode);
        setScore(0);
        setCurrentIndex(0);
        setGameState('playing');
        setFeedback(null);
        setInputValue("");
        setShowHint(false);

        if (mode === 'normal' || mode === 'typing') {
            // Normal & Typing Mode: Pre-generate 5 questions
            const pool = [...idioms].sort(() => 0.5 - Math.random());
            const selected = pool.slice(0, 5);
            const newQuestions = selected.map(item => {
                const type = Math.random() > 0.5 ? 'meaning' : 'blank';
                // Options not needed for typing mode strictly speaking, but keep for structure consistency
                const distractors = idioms.filter(i => i.id !== item.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.idiom);
                const options = [...distractors, item.idiom].sort(() => 0.5 - Math.random());
                const example = item.examples ? item.examples[0] : item.example;
                return {
                    target: item,
                    type,
                    options,
                    questionText: type === 'meaning' ? item.meaning : example.replace(item.idiom, 'OOOO')
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

        processResult(isCorrect);
    };

    const handleTypingSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentQ = questions[currentIndex];
        const isCorrect = inputValue.trim().replace(/\s+/g, '') === currentQ.target.idiom.replace(/\s+/g, '');

        processResult(isCorrect);
    };

    const processResult = (isCorrect) => {
        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#0ea5e9', '#6366f1']
            });

            if (gameMode === 'timeAttack') {
                setTimeLeft(t => Math.min(t + 3, 60));
            }

        } else {
            setFeedback('wrong');

            // Penalty for Time Attack: -3 seconds
            if (gameMode === 'timeAttack') {
                setTimeLeft(t => Math.max(0, t - 3));
            }
        }

        // Delay for next question
        setTimeout(() => {
            setFeedback(null);
            setInputValue("");
            setShowHint(false);

            if (gameMode === 'normal' || gameMode === 'typing') {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(c => c + 1);
                } else {
                    finishGame();
                }
            } else {
                // Time Attack
                const currentQ = questions[currentIndex];
                if (isActive || timeLeft > 0) {
                    setQuestions(prev => [...prev, generateQuestion(currentQ.target.id)]);
                    setCurrentIndex(c => c + 1);
                }
            }
        }, 1500); // Slightly longer delay to read feedback
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
        setInputValue("");
        setShowHint(false);
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

                    {/* Typing Mode */}
                    <button
                        onClick={() => startQuiz('typing')}
                        className="col-span-1 md:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Keyboard className="w-24 h-24 text-purple-500" />
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                            <Keyboard className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">타자 퀴즈</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">직접 사자성어를 입력하여 맞춰보세요. <br />진정한 실력자를 위한 모드!</p>
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
                {gameMode === 'normal' || gameMode === 'typing' ? (
                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                        Question {currentIndex + 1} / 5
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-lg ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                            <Timer className="w-4 h-4" />
                            {timeLeft}s
                        </div>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title={isMuted ? "소리 켜기" : "소리 끄기"}
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                        Score: {score}
                    </span>
                    <button
                        onClick={reset}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="그만두기"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center mb-6 relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
                {feedback && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 animate-fade-in ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {feedback === 'correct' ? (
                            <>
                                <CheckCircle className="w-16 h-16 mb-2" />
                                <span className="text-2xl font-bold">정답입니다!</span>
                                {gameMode === 'timeAttack' && <span className="text-sm font-bold mt-1">+3s</span>}
                            </>
                        ) : (
                            <>
                                <XCircle className="w-16 h-16 mb-2" />
                                <span className="text-2xl font-bold">틀렸습니다!</span>
                                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">정답</span>
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">{currentQ.target.idiom}</span>
                                    <span className="text-xs text-slate-400 block">({currentQ.target.hanja})</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                    {gameMode === 'typing'
                        ? '설명을 보고 사자성어를 입력하세요'
                        : currentQ.type === 'meaning' ? '뜻에 맞는 사자성어는?' : '빈칸에 들어갈 말은?'
                    }
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed word-keep-all whitespace-pre-line">
                    {currentQ.questionText}
                </h3>

                {/* Hint Display */}
                {gameMode === 'typing' && showHint && (
                    <div className="mt-4 animate-fade-in">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                            <Lightbulb className="w-4 h-4" />
                            💡 힌트: 첫 글자는 "{currentQ.target.idiom[0]}" 입니다.
                        </span>
                    </div>
                )}
            </div>

            {/* Options or Input */}
            {gameMode === 'typing' ? (
                <div className="space-y-4">
                    <form onSubmit={handleTypingSubmit} className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="정답 입력 (예: 기고만장)"
                            className="w-full text-center text-xl p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all font-bold placeholder-slate-300"
                            autoFocus
                            disabled={!!feedback}
                        />

                        {/* Hint Button */}
                        {!showHint && !feedback && (
                            <button
                                type="button"
                                onClick={() => setShowHint(true)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-full transition-colors"
                                title="힌트 보기"
                            >
                                <Lightbulb className="w-5 h-5" />
                            </button>
                        )}
                    </form>

                    <button
                        type="button" // Change to button to prevent double submit with form? No form needs submit. Wait, the form has onSubmit. Button should be type=submit.
                        onClick={handleTypingSubmit}
                        disabled={!inputValue.trim() || !!feedback}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                        제출하기
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2">
                        엔터(Enter) 키를 눌러 제출할 수 있습니다.
                    </p>
                </div>
            ) : (
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
            )}

        </div>
    );
}

function TrophyIcon({ score }) {
    if (score === 5) return <span className="text-5xl">🏆</span>;
    if (score >= 3) return <span className="text-5xl">🥇</span>;
    return <span className="text-5xl">🍀</span>;
}
