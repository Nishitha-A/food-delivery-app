import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
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

            if (user.role !== 'admin') {
                const msg = 'Access denied. Admins only.';
                setErrors({ api: msg });
                showToast(msg, 'error');
                return;
            }

            showToast('Admin access granted!', 'success');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Authentication failed.';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 animate-in slide-in-from-top-full ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <p className="font-semibold">{toast.message}</p>
                </div>
            )}

            <div className="w-full max-w-md z-10 animate-in zoom-in-95 duration-500">
                <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-10 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20">
                            <Shield className="text-orange-500" size={48} />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Admin Portal</h1>
                        <p className="text-red-400 font-medium text-sm border-y border-red-500/10 py-1 inline-block uppercase tracking-widest px-4">
                            Restricted Access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.api && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium text-center border-l-4 border-l-red-500">
                                {errors.api}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Admin Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-orange-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-4 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium`}
                                    placeholder="admin@quickbite.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-orange-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Shield size={18} />
                                    <span>Authenticate</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-800 flex justify-center">
                        <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft size={16} />
                            Back to User Login
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-600 text-xs font-medium uppercase tracking-[0.2em]">
                    Authorized Personnel Only • IP Logged
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
