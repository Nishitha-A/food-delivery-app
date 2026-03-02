import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import API from '../../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = 'Full Name is required';
        if (!formData.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email format is invalid';
        }
        if (!formData.password) tempErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            showToast('Account created successfully!', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] animate-in fade-in duration-700">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 animate-in slide-in-from-top-full ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <p className="font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Left Half: Branding & Illustration */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-8 animate-bounce transition-all duration-1000">
                    <span className="text-8xl">🍕</span>
                    <span className="text-8xl">🍔</span>
                    <span className="text-8xl">🌮</span>
                </div>
                <h1 className="text-6xl font-black text-orange-500 mb-4 tracking-tight uppercase">
                    QuickBite
                </h1>
                <p className="text-2xl text-slate-400 font-medium">
                    Your favourite food, <span className="text-orange-400 text-3xl font-bold italic">delivered fast.</span>
                </p>
                <div className="mt-12 grid grid-cols-2 gap-4 opacity-50">
                    <div className="text-6xl grayscale hover:grayscale-0 transition-all cursor-default">🍜</div>
                    <div className="text-6xl grayscale hover:grayscale-0 transition-all cursor-default text-right">🥯</div>
                    <div className="text-6xl grayscale hover:grayscale-0 transition-all cursor-default">🥡</div>
                    <div className="text-6xl grayscale hover:grayscale-0 transition-all cursor-default text-right">🍩</div>
                </div>
            </div>

            {/* Right Half: Form */}
            <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Join thousands of food lovers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.api && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                                {errors.api}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className={`relative group transition-all`}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 ml-1 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
