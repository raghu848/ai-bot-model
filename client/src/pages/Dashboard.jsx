import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Calendar, Award, BookOpen, Clock, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get('/api/interview/sessions');
            setSessions(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

    const chartData = sessions.map(s => ({
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: parseFloat(s.overallScore.toFixed(1))
    })).reverse();

    const stats = {
        total: sessions.length,
        avg: sessions.length ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(1) : 0,
        best: sessions.length ? Math.max(...sessions.map(s => s.overallScore)).toFixed(1) : 0
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold italic mb-2">My Progress</h1>
                    <p className="text-slate-400">Track your interview readiness over time.</p>
                </div>
                <Link to="/setup" className="bg-primary-600 hover:bg-primary-500 px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-600/20">
                    New Session
                </Link>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Sessions', value: stats.total, icon: BookOpen, color: 'text-blue-400' },
                    { label: 'Average Score', value: stats.avg, icon: Award, color: 'text-primary-400' },
                    { label: 'Best Performance', value: stats.best, icon: Clock, color: 'text-emerald-400' }
                ].map((s, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-6">
                        <div className={`p-4 rounded-xl bg-slate-900 border border-white/5 ${s.color}`}>
                            <s.icon size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm uppercase font-bold tracking-wider">{s.label}</p>
                            <p className="text-3xl font-bold">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-2xl border-white/5">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <TrendingUpIcon className="text-primary-500" /> Performance Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                                <Tooltip 
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#0ea5e9' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#0ea5e9" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl border-white/5">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Calendar className="text-emerald-500" /> Activity Breakdown
                    </h3>
                    <div className="space-y-6">
                        {sessions.slice(0, 3).map((s, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-bold text-slate-200 group-hover:text-primary-400 transition-colors">{s.role}</p>
                                    <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">{s.overallScore.toFixed(1)}</p>
                                    <p className="text-[10px] uppercase text-slate-600 font-bold">Score</p>
                                </div>
                            </div>
                        ))}
                        {sessions.length === 0 && <p className="text-slate-500 italic text-sm">No sessions yet. Start your first practice!</p>}
                    </div>
                    <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-sm font-bold text-slate-400 hover:bg-slate-800 transition-colors uppercase tracking-widest">
                        View History
                    </button>
                </div>
            </div>

            {/* Session List Table */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold px-4">Recent Sessions</h3>
                <div className="space-y-3">
                    {sessions.map((s, idx) => (
                        <motion.div 
                            key={s._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link to={`/summary/${s._id}`} className="glass-card p-5 rounded-xl flex items-center justify-between hover:border-primary-500/30 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-primary-500 group-hover:bg-primary-900/20 transition-colors">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{s.role}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
                                            <span>{s.difficulty}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                            <span>{s.interviewType}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                            <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary-400">{s.overallScore.toFixed(1)}</p>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Overall</p>
                                    </div>
                                    <ChevronRight className="text-slate-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TrendingUpIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Dashboard;
