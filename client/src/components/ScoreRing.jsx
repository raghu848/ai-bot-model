import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScoreRing = ({ score, size = 120, strokeWidth = 10 }) => {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const timer = setTimeout(() => setProgress(score * 10), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const offset = circumference - (progress / 100) * circumference;

    const getColor = (s) => {
        if (s >= 8) return '#10b981'; // green-500
        if (s >= 5) return '#f59e0b'; // amber-500
        return '#ef4444'; // red-500
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Score</span>
            </div>
        </div>
    );
};

export default ScoreRing;
