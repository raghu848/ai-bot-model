import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-16"
        >
            <div className="glass-card p-8 rounded-2xl w-full">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-slate-400 mb-8">Join the elite preparation platform</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="John Doe"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Register;
