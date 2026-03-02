import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, UtensilsCrossed, TrendingUp, Clock, Users } from 'lucide-react';
import API from '../../api/axios';

const Home = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRestaurants = async () => {
        setLoading(true);
        setError(false);
        try {
            const { data } = await API.get('/restaurants');
            // Filter isActive directly as per requirements
            const activeOnly = data.filter(res => res.isActive);
            setRestaurants(activeOnly);
            setFilteredRestaurants(activeOnly);
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        const filtered = restaurants.filter(res =>
            res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    }, [searchQuery, restaurants]);

    return (
        <div className="min-h-screen bg-[#0f172a] pt-16">
            {/* Hero Section */}
            <section className="relative w-full min-h-[420px] bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 flex shadow-2xl overflow-hidden">
                {/* Decorative background overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between w-full py-12 md:py-20 z-10">
                    {/* Left Content */}
                    <div className="md:w-3/5 space-y-6 text-center md:text-left animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-500 font-bold text-xs uppercase tracking-widest">
                            <TrendingUp size={14} className="animate-pulse" />
                            Fast Delivery
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                            Hungry? <br />
                            <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">We've Got You.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-lg">
                            Order from the best restaurants near you and get your favorite food delivered in minutes.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-lg group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search restaurants or cuisines..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 backdrop-blur-xl border border-slate-700/50 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Right Content: Food Collage */}
                    <div className="md:w-2/5 mt-12 md:mt-0 relative hidden md:flex justify-center animate-in slide-in-from-right duration-700">
                        <div className="relative flex flex-wrap max-w-xs gap-4 justify-center">
                            {['🍕', '🍔', '🌮', '🍜'].map((emoji, i) => (
                                <div
                                    key={i}
                                    className={`w-24 h-24 bg-slate-800/80 backdrop-blur rounded-3xl border border-slate-700 flex items-center justify-center text-5xl shadow-2xl animate-bounce`}
                                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: '3s' }}
                                >
                                    {emoji}
                                </div>
                            ))}
                            {/* Floating Floating labels */}
                            <div className="absolute -top-4 -right-10 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter rotate-12 shadow-lg animate-pulse">Hot Now</div>
                            <div className="absolute -bottom-4 -left-10 bg-white/10 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter -rotate-12 border border-white/20 shadow-lg">Premium</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="bg-orange-500 py-4 shadow-xl relative z-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-0 text-white">
                    <div className="flex items-center gap-3 font-bold group">
                        <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <UtensilsCrossed size={20} />
                        </div>
                        <span className="whitespace-nowrap">500+ Restaurants</span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-white/30"></div>
                    <div className="flex items-center gap-3 font-bold group">
                        <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="whitespace-nowrap">50k+ Happy Customers</span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-white/30"></div>
                    <div className="flex items-center gap-3 font-bold group">
                        <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Clock size={20} />
                        </div>
                        <span className="whitespace-nowrap">30 min avg delivery</span>
                    </div>
                </div>
            </div>

            {/* Restaurants Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-black text-white relative inline-block">
                        Popular Restaurants
                        <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-orange-500 rounded-full"></div>
                    </h2>
                    <p className="mt-4 text-slate-400">Discover the best food near you</p>
                </div>

                {loading ? (
                    /* Skeletons */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[400px] animate-pulse">
                                <div className="h-52 bg-slate-800"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-slate-800 rounded-full w-2/3"></div>
                                    <div className="h-4 bg-slate-800 rounded-full w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                                    <div className="pt-4 flex justify-between">
                                        <div className="h-8 bg-slate-800 rounded-lg w-20"></div>
                                        <div className="h-10 bg-slate-800 rounded-xl w-32"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="text-center py-20 bg-red-500/5 rounded-[2.5rem] border border-red-500/10">
                        <p className="text-xl text-red-500 font-bold mb-4">Failed to load restaurants</p>
                        <button
                            onClick={fetchRestaurants}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl shadow-orange-500/20"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredRestaurants.length === 0 ? (
                    /* Search Empty State */
                    <div className="text-center py-32 bg-slate-900/50 rounded-[2.5rem] border border-slate-800">
                        <div className="text-6xl mb-4">😕</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No restaurants found</h3>
                        <p className="text-slate-500">Try adjusting your search criteria</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-orange-500 font-bold hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    /* Restaurants Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRestaurants.map((res) => (
                            <div
                                key={res._id}
                                className="group relative bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden hover:border-orange-500/50 shadow-lg hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Active Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/20">
                                        {res.isActive ? '🟢 Open' : '🔴 Closed'}
                                    </span>
                                </div>

                                {/* Image Section */}
                                <div className="h-52 overflow-hidden relative">
                                    {res.image ? (
                                        <img
                                            src={res.image}
                                            alt={res.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-6xl font-black text-slate-700">
                                            {res.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-1 transition-colors group-hover:text-orange-500">
                                        {res.name}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                                        <MapPin size={14} className="text-orange-500" />
                                        <span className="text-xs font-medium truncate">{res.address}</span>
                                    </div>

                                    <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
                                        {res.description}
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <span className="text-orange-500 font-black">★</span>
                                            <span className="text-white text-sm font-bold">4.8</span>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold ml-1">Rating</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/restaurant/${res._id}`)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black transition-all transform active:scale-95 shadow-lg shadow-orange-500/20 flex items-center gap-2"
                                        >
                                            View Menu
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
