
import React, { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
    onSignUp: (name: string, email: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSignUp }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (activeTab === 'signup') {
            if (!name || !email || !password || !confirmPassword) {
                setError('All fields are required');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            // Strong password checks
            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
            if (!/[A-Z]/.test(password)) {
                setError('Password must contain at least one uppercase letter');
                return;
            }
            if (!/[0-9]/.test(password)) {
                setError('Password must contain at least one number');
                return;
            }
            if (!/[!@#$%^&*]/.test(password)) {
                setError('Password must contain at least one special character (!@#$%^&*)');
                return;
            }

            onSignUp(name, email, password);
            resetForm();
        } else {
            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            onLogin(email, password);
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative glass-card rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/30 animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-smooth"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-primary p-3 rounded-2xl text-white inline-block mb-4 shadow-lg">
                        <i className="fas fa-graduation-cap text-3xl"></i>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 font-heading">
                        Welcome to EduDesigner AI
                    </h2>
                    <p className="text-slate-600 text-sm">
                        {activeTab === 'login' ? 'Sign in to continue' : 'Create your account'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => { setActiveTab('login'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'login'
                            ? 'bg-white text-orange-600 shadow-md'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        Login
                    </button>
                    <button
                        onClick={() => { setActiveTab('signup'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'signup'
                            ? 'bg-white text-orange-600 shadow-md'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <i className="fas fa-user-plus mr-2"></i>
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'signup' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {activeTab === 'signup' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3"
                    >
                        <i className={`fas ${activeTab === 'login' ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                        {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => { setActiveTab(activeTab === 'login' ? 'signup' : 'login'); setError(''); }}
                        className="text-orange-600 font-bold hover:underline"
                    >
                        {activeTab === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
