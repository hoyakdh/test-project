import React from 'react';

export default function HanjaTooltip({ char, meaning, className = "" }) {
    if (!meaning) return <span className={className}>{char}</span>;

    return (
        <span
            className={`relative group inline-block cursor-help ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            <span className="underline decoration-dotted decoration-primary-300 dark:decoration-primary-700 decoration-2 underline-offset-4">{char}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/95 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl translate-y-2 group-hover:translate-y-0">
                {meaning}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
            </div>
        </span>
    );
}
