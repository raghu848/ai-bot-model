import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ScoreRing from '../components/ScoreRing';
import { Download, Share2, Home, CheckCircle2, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Summary = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSession();
    }, [id]);

    const fetchSession = async () => {
        try {
            const res = await api.get(`/api/interview/sessions/${id}`);
            setSession(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const exportPDF = () => {
        const input = document.getElementById('report-content');
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`InterviewAI_Result_${id}.pdf`);
        });
    };

    if (loading) return <div className="text-center py-20">Loading Report...</div>;

    const stats = {
        total: session.questions.length,
        avg: session.overallScore.toFixed(1),
        strongest: [...session.questions].sort((a, b) => b.score - a.score)[0].category,
        weakest: [...session.questions].sort((a, b) => a.score - b.score)[0].category
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold italic">Session Summary</h1>
                <div className="flex gap-4">
                    <button onClick={exportPDF} className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-white/10">
                        <Download size={18} /> Export PDF
                    </button>
                    <Link to="/setup" className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-lg hover:bg-primary-500 font-medium">
                        <Home size={18} /> New Practice
                    </Link>
                </div>
            </div>

            <div id="report-content" className="space-y-8">
                {/* Header Card */}
                <div className="glass-card p-10 rounded-3xl flex flex-col md:flex-row items-center gap-12 border-l-8 border-primary-500">
                    <ScoreRing score={session.overallScore} size={180} strokeWidth={15} />
                    <div className="flex-1 space-y-4">
                        <div>
                            <span className="text-primary-400 font-bold tracking-widest uppercase text-xs">AI FEEDBACK SUMMARY</span>
                            <h2 className="text-2xl font-bold leading-tight mt-1">{session.overallFeedback}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Role</p>
                                <p className="font-medium">{session.role}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Difficulty</p>
                                <p className="font-medium">{session.difficulty}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Duration</p>
                                <p className="font-medium">{Math.floor(session.duration / 60)}m {session.duration % 60}s</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Questions</p>
                                <p className="font-medium">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border-t border-emerald-500/20">
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <TrendingUp size={24} />
                            <h3 className="font-bold uppercase tracking-wider">Strongest Area</h3>
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.strongest}</p>
                        <p className="text-slate-400 text-sm">You demonstrated exceptional depth here. Keep honing this expertise.</p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border-t border-amber-500/20">
                        <div className="flex items-center gap-3 text-amber-400 mb-4">
                            <AlertCircle size={24} />
                            <h3 className="font-bold uppercase tracking-wider">Focus Area</h3>
                        </div>
                        <p className="text-3xl font-bold mb-2">{stats.weakest}</p>
                        <p className="text-slate-400 text-sm">This category shows room for improvement. AI suggests more DSA drills.</p>
                    </div>
                </div>

                {/* Per Question Breakdown */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold px-4 flex items-center gap-3">
                        <FileText className="text-primary-500" /> Question-by-Question Breakdown
                    </h3>
                    {session.questions.map((q, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 rounded-2xl border-white/5"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="max-w-[80%]">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{q.category}</span>
                                    <h4 className="text-xl font-bold mt-1">{q.questionText}</h4>
                                </div>
                                <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-primary-400">{q.score}</p>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold">Score</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-900/40 p-5 rounded-xl border border-white/5">
                                    <p className="text-xs font-bold text-primary-400 uppercase mb-2">AI Feedback</p>
                                    <p className="text-slate-300 italic">"{q.feedback}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={14} /> Strengths
                                        </p>
                                        <ul className="space-y-2">
                                            {q.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" /> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-2">
                                            <AlertCircle size={14} /> Improvements
                                        </p>
                                        <ul className="space-y-2">
                                            {q.improvements.map((im, i) => (
                                                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-amber-500 rounded-full" /> {im}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Summary;
