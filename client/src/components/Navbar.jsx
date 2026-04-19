import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent italic">
                InterviewAI
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary-400">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/setup" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg font-medium">
                            <PlusCircle size={18} />
                            <span>New Session</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-primary-400">Login</Link>
                        <Link to="/register" className="bg-primary-600 hover:bg-primary-500 px-6 py-2 rounded-lg font-medium">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
