import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, ShoppingBag,
    LogOut, Menu, X, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Restaurants', icon: UtensilsCrossed, path: '/admin/restaurants' },
        { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-950 flex overflow-hidden">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl">🍕</span>
                        <h1 className="text-xl font-black text-white tracking-tight">QuickBite</h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-9">Admin Panel</p>
                </div>

                <nav className="mt-6 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-2xl mx-3 mb-2 transition-all duration-300 group
                                ${isActive
                                    ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500 shadow-lg shadow-orange-500/5'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }
                            `}
                        >
                            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Profile Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-800/30 border border-gray-800 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] font-bold text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-bold"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black text-white tracking-tight">{title}</h2>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Admin</span>
                                <span>/</span>
                                <span className="text-orange-500/80">{title}</span>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for notifications/search */}
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 animate-pulse hidden md:block"></div>
                        <div className="w-32 h-8 rounded-xl bg-gray-800 border border-gray-700 animate-pulse hidden md:block"></div>
                    </div>
                </header>

                <div className="p-6 md:p-8 flex-1 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
