import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Briefcase, BarChart, Settings, FileText, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Setup = () => {
    const [config, setConfig] = useState({
        role: 'Frontend Developer',
        difficulty: 'Intermediate',
        type: 'Mixed',
        count: 5,
        resumeText: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStart = () => {
        setLoading(true);
        // Store config in session storage for the Interview page to pick up
        sessionStorage.setItem('interviewConfig', JSON.stringify(config));
        toast.success(`Preparing your ${config.role} session...`);
        setTimeout(() => navigate('/interview'), 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Configure Your Session</h1>
                <p className="text-slate-400">Tailor the AI to your specific needs or upload your resume for personalization.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Briefcase size={16} /> Job Role
                        </label>
                        <select 
                            value={config.role}
                            onChange={(e) => setConfig({...config, role: e.target.value})}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-primary-500"
                        >
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>Full Stack Engineer</option>
                            <option>Data Scientist</option>
                            <option>Product Manager</option>
                            <option>DevOps Engineer</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <BarChart size={16} /> Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => setConfig({...config, difficulty: lvl})}
                                    className={`py-2 rounded-lg border transition-all ${config.difficulty === lvl ? 'bg-primary-600 border-primary-500 font-bold' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Settings size={16} /> Interview Type
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Technical', 'HR', 'Mixed'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setConfig({...config, type: t})}
                                    className={`py-2 rounded-lg border transition-all ${config.type === t ? 'bg-primary-600 border-primary-500 font-bold' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl space-y-6 flex flex-col justify-between">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <FileText size={16} /> Resume Text (Optional)
                        </label>
                        <textarea 
                            value={config.resumeText}
                            onChange={(e) => setConfig({...config, resumeText: e.target.value})}
                            className="w-full h-48 bg-slate-900 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-primary-500 resize-none text-sm"
                            placeholder="Paste your resume content here for personalized questions..."
                        ></textarea>
                    </div>

                    <button 
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Initializing AI...' : <>Start Interview <Play size={18} fill="currentColor" /></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setup;
