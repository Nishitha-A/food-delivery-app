import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = user?.role === 'admin'
        ? [
            { name: 'Dashboard', path: '/admin/dashboard' },
            { name: 'Restaurants', path: '/admin/restaurants' },
            { name: 'Orders', path: '/admin/orders' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'My Orders', path: '/orders' },
        ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <NavLink to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
                    <span className="text-2xl">🍕</span>
                    <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                        QuickBite {user?.role === 'admin' && <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter ml-1">Admin</span>}
                    </span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-all duration-300 hover:text-orange-400 ${isActive ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-400'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Right Side Icons & Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {user?.role === 'user' && (
                        <Link
                            to="/cart"
                            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                        >
                            <ShoppingCart
                                className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                            <span className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">{user?.role}</span>
                        </div>
                        <div className="bg-gray-800 p-2 rounded-xl text-orange-500">
                            {user?.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2 group"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden flex items-center gap-4">
                    {user?.role === 'user' && (
                        <NavLink to="/cart" className="relative p-2">
                            <ShoppingCart size={24} className="text-gray-400" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-950">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                    )}
                    <button onClick={toggleMenu} className="text-gray-400 hover:text-white transition-colors">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Slide Down */}
            <div
                className={`md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-8 space-y-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block text-lg font-bold transition-all ${isActive ? 'text-orange-500' : 'text-gray-400'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-white font-bold leading-none">{user?.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black">{user?.role} Portal</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-xl transition-all text-sm font-bold flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
