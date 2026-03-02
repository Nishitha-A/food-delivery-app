import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!formData.email || !formData.password) {
            setErrors({
                email: !formData.email ? 'Email is required' : null,
                password: !formData.password ? 'Password is required' : null
            });
            return;
        }

        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            showToast('Login successful!', 'success');

            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
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

            {/* Left Half: Login Form Card */}
            <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 order-2 md:order-1">
                <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back 👋</h2>
                        <p className="text-slate-400">Sign in to continue your food journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.api && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center animate-pulse">
                                {errors.api}
                            </div>
                        )}

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
                                    placeholder="your@email.com"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <button type="button" className="text-xs text-orange-500 font-semibold hover:text-orange-400">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-3 bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-orange-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">or</span></div>
                    </div>

                    <div className="text-center text-slate-400 text-sm">
                        New here?{" "}
                        <Link to="/register" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Half: Imagery */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col items-center justify-center p-12 text-center order-1 md:order-2 overflow-hidden">
                <div className="relative flex flex-wrap justify-center gap-6 max-w-lg">
                    <span className="text-7xl animate-bounce" style={{ animationDelay: '0.1s' }}>🍔</span>
                    <span className="text-7xl animate-pulse" style={{ animationDelay: '0.3s' }}>🍕</span>
                    <span className="text-7xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍱</span>
                    <span className="text-7xl animate-pulse" style={{ animationDelay: '0.2s' }}>🍜</span>
                    <span className="text-7xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌮</span>
                    <span className="text-7xl animate-pulse" style={{ animationDelay: '0.6s' }}>🥤</span>
                </div>

                <h1 className="text-5xl font-black text-orange-500 mt-12 mb-4 drop-shadow-2xl">
                    Hungry?
                </h1>
                <p className="text-xl text-slate-400 max-w-xs">
                    Get the freshest meals delivered straight to your doorstep in minutes.
                </p>
            </div>
        </div>
    );
};

export default Login;
