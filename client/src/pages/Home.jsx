import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Shield, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-32 py-12">
            {/* Hero Section */}
            <section className="text-center space-y-8 max-w-4xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 text-sm font-bold uppercase tracking-widest"
                >
                    <Sparkles size={16} /> AI-Powered Career Growth
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black italic tracking-tighter leading-tight"
                >
                    Master Your <br />
                    <span className="bg-gradient-to-r from-primary-400 via-primary-600 to-primary-200 bg-clip-text text-transparent">Interview.</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-400 max-w-2xl mx-auto"
                >
                    The smartest way to prepare for your next big role. Get role-specific questions, instant AI feedback, and visual progress tracking.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                >
                    <Link to="/register" className="group bg-primary-600 hover:bg-primary-500 px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-2xl shadow-primary-600/30 transition-all hover:-translate-y-1">
                        Get Started Free
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="px-10 py-5 rounded-2xl font-bold text-xl border border-white/10 hover:bg-white/5 transition-all">
                        Sign In
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Personalized AI', desc: 'Claude generating questions tailored to your target role and experience level.', icon: Zap, color: 'text-yellow-400' },
                    { title: 'Real-time Grading', desc: 'Instant feedback on your answers with scores, strengths, and improvement tips.', icon: Target, color: 'text-primary-400' },
                    { title: 'Data-Driven', desc: 'Visualize your growth with detailed performance charts and session history.', icon: Shield, color: 'text-emerald-400' }
                ].map((f, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="glass-card p-10 rounded-3xl border-white/5 space-y-6"
                    >
                        <div className={`p-4 w-fit rounded-2xl bg-slate-900 border border-white/5 ${f.color}`}>
                            <f.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold">{f.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="glass-card p-16 rounded-[3rem] border-white/5 bg-gradient-to-br from-primary-900/20 to-transparent flex flex-col items-center text-center space-y-8">
                <h2 className="text-5xl font-bold italic">Ready to land that offer?</h2>
                <p className="text-slate-400 max-w-xl">Join thousands of candidates who used InterviewAI to boost their confidence and performance.</p>
                <Link to="/register" className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all">
                    Start Preparing Now
                </Link>
            </section>
        </div>
    );
};

export default Home;
