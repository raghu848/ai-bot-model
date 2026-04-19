import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronRight, HelpCircle, Loader2, Award, AlertTriangle } from 'lucide-react';
import ScoreRing from '../components/ScoreRing';

const Interview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [evaluations, setEvaluations] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [startTime, setStartTime] = useState(null);

    // Load config and fetch questions
    useEffect(() => {
        const storedConfig = sessionStorage.getItem('interviewConfig');
        if (!storedConfig) {
            navigate('/setup');
            return;
        }
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
        fetchQuestions(parsedConfig);
    }, []);

    const fetchQuestions = async (cfg) => {
        try {
            setLoading(true);
            const res = await api.post('/api/interview/generate', cfg);
            setQuestions(res.data);
            setStartTime(Date.now());
            setLoading(false);
        } catch (error) {
            toast.error('Failed to generate interview questions');
            navigate('/setup');
        }
    };

    const handleAnswerSubmit = async () => {
        if (!answer.trim()) return;
        
        try {
            setSubmitting(true);
            const currentQ = questions[currentIndex];
            const res = await api.post('/api/interview/evaluate', {
                question: currentQ.question,
                answer: answer,
                role: config.role
            });

            const evaluation = {
                ...res.data,
                questionText: currentQ.question,
                category: currentQ.category,
                userAnswer: answer
            };

            setEvaluations([...evaluations, evaluation]);
            setSubmitting(false);
            
            if (currentIndex < questions.length - 1) {
                // Next question
                setCurrentIndex(currentIndex + 1);
                setAnswer('');
                setShowHint(false);
            } else {
                // Finish session
                saveSession([...evaluations, evaluation]);
            }
        } catch (error) {
            toast.error('Evaluation failed. Please try again.');
            setSubmitting(false);
        }
    };

    const saveSession = async (allEvals) => {
        try {
            setLoading(true);
            const duration = Math.floor((Date.now() - startTime) / 1000);
            const res = await api.post('/api/interview/session', {
                ...config,
                questions: allEvals,
                duration
            });
            toast.success('Interview complete! Generating your report...');
            navigate(`/summary/${res.data._id}`);
        } catch (error) {
            toast.error('Failed to save session');
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <Loader2 className="animate-spin text-primary-500" size={64} />
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Generating Questions...</h2>
                <p className="text-slate-400">Claude is crafting a personalized interview for you.</p>
            </div>
        </div>
    );

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-primary-500 font-bold tracking-widest uppercase text-xs">Question {currentIndex + 1} of {questions.length}</span>
                    <h2 className="text-3xl font-bold mt-1">{config.role} Role</h2>
                </div>
                <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        className="h-full bg-primary-600"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-primary-600/20 rounded-xl text-primary-400">
                            <HelpCircle size={32} />
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 mb-2 border border-white/10 uppercase italic">
                                {currentQuestion.category}
                            </span>
                            <h3 className="text-2xl font-medium leading-relaxed">
                                {currentQuestion.question}
                            </h3>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={submitting}
                            className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-primary-500 transition-all resize-none text-lg text-slate-200 placeholder:text-slate-600"
                            placeholder="Type your answer here..."
                        ></textarea>
                        
                        {!answer && !submitting && (
                            <div className="absolute bottom-4 left-6 flex items-center gap-2 text-slate-500 text-sm italic">
                                <AlertTriangle size={14} />
                                Answer should be detailed for better evaluation
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => setShowHint(!showHint)}
                            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium"
                        >
                            <Settings size={16} /> {showHint ? 'Hide Hint' : 'Need a tip?'}
                        </button>

                        <button 
                            onClick={handleAnswerSubmit}
                            disabled={!answer.trim() || submitting}
                            className="bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all transform active:scale-95"
                        >
                            {submitting ? (
                                <>Evaluating... <Loader2 className="animate-spin" size={18} /></>
                            ) : (
                                <>Submit Answer <Send size={18} /></>
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showHint && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-6 p-4 bg-primary-600/10 border-l-4 border-primary-500 rounded-r-xl"
                            >
                                <p className="text-sm italic text-primary-200">
                                    <span className="font-bold uppercase not-italic mr-2">Hint:</span>
                                    {currentQuestion.hint}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Interview;
