import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-16"
        >
            <div className="glass-card p-8 rounded-2xl w-full">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-slate-400 mb-8">Sign in to continue your preparation</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="name@example.com"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="text-primary-400 hover:underline">Register now</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Login;
