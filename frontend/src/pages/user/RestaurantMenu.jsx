import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingCart, Search, Check, Loader2, Star, Utensils } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const RestaurantMenu = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();

    // State
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // UI State
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [addingItems, setAddingItems] = useState({}); // { foodId: bool }
    const [addedItems, setAddedItems] = useState({}); // { foodId: bool }
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [resResponse, foodResponse] = await Promise.all([
                API.get(`/restaurant/${restaurantId}`),
                API.get(`/food/${restaurantId}`)
            ]);
            setRestaurant(resResponse.data);
            setFoods(foodResponse.data);
        } catch (err) {
            console.error('Error fetching menu data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(foods.map(item => item.category))];
        return cats;
    }, [foods]);

    const filteredFoods = useMemo(() => {
        return foods.filter(food => {
            const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
            const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [foods, activeCategory, searchQuery]);

    const handleAddToCart = async (food) => {
        if (!food.isAvailable) return;

        setAddingItems(prev => ({ ...prev, [food._id]: true }));
        try {
            await API.post('/cart/add', { foodId: food._id, quantity: 1 });
            updateCartCount(cartCount + 1);

            // Success State
            setAddedItems(prev => ({ ...prev, [food._id]: true }));
            addToast(`Added ${food.name} to cart!`);

            // Reset after 2 seconds
            setTimeout(() => {
                setAddedItems(prev => ({ ...prev, [food._id]: false }));
            }, 2000);
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to add item', 'error');
        } finally {
            setAddingItems(prev => ({ ...prev, [food._id]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] pt-16">
                {/* Banner Skeleton */}
                <div className="w-full h-64 md:h-80 bg-slate-800 animate-pulse relative">
                    <div className="absolute bottom-10 left-10 space-y-4 w-full max-w-xl">
                        <div className="h-10 bg-slate-700 rounded-lg w-2/3"></div>
                        <div className="h-4 bg-slate-700 rounded-lg w-1/2"></div>
                    </div>
                </div>
                {/* Tabs Skeleton */}
                <div className="sticky top-16 bg-gray-950/95 py-4 border-b border-gray-800 px-6 flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 bg-slate-800 rounded-full w-24 animate-pulse"></div>
                    ))}
                </div>
                {/* Cards Skeleton */}
                <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl h-[400px] animate-pulse overflow-hidden">
                            <div className="h-48 bg-slate-800"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-slate-800 w-3/4 rounded-full"></div>
                                <div className="h-4 bg-slate-800 w-full rounded-full"></div>
                                <div className="flex justify-between items-center pt-8">
                                    <div className="h-8 bg-slate-800 w-24 rounded-full"></div>
                                    <div className="h-10 bg-slate-800 w-32 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 pt-20">
                <div className="text-8xl mb-6">🍽️</div>
                <h2 className="text-3xl font-bold text-white mb-2">{error ? 'Oops! Something went wrong' : 'Restaurant Not Found'}</h2>
                <p className="text-slate-400 mb-8 max-w-sm text-center">
                    {error ? 'We had trouble loading the menu. Please check your connection and try again.' : 'We couldn\'t find the restaurant you were looking for.'}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-2xl hover:bg-slate-700 transition-all font-bold"
                    >
                        <ArrowLeft size={20} /> Back to Home
                    </button>
                    {error && (
                        <button
                            onClick={fetchData}
                            className="bg-orange-500 text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition-all font-bold shadow-lg shadow-orange-500/20"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] pt-16 relative">
            {/* Toast Container */}
            <div className="fixed bottom-10 right-5 z-[100] flex flex-col gap-3">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}
                    >
                        {t.type === 'success' ? <Check size={20} /> : <div className="font-bold">!</div>}
                        <p className="font-bold">{t.message}</p>
                    </div>
                ))}
            </div>

            {/* Restaurant Banner */}
            <div className="relative w-full h-64 md:h-96 overflow-hidden">
                {restaurant.image ? (
                    <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-orange-950 flex items-center justify-center text-9xl text-white/5 font-black">
                        {restaurant.name.charAt(0)}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 p-3 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-orange-500 transition-all shadow-xl border border-white/10 group"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Banner Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{restaurant.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${restaurant.isActive ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'
                                    }`}>
                                    {restaurant.isActive ? '🟢 Open Now' : '🔴 Closed'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 font-medium">
                                <MapPin size={18} className="text-orange-500" />
                                <span>{restaurant.address}</span>
                            </div>
                            <p className="text-slate-400 text-sm md:text-lg max-w-3xl font-medium leading-relaxed">
                                {restaurant.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl">
                            <div className="text-center">
                                <div className="flex items-center gap-1 text-orange-500 mb-1 justify-center">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-white font-black">4.8</span>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">500+ Ratings</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className="text-center px-4">
                                <div className="text-white font-black text-lg mb-1">30</div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Mins Away</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Category Tabs */}
            <div className="sticky top-16 z-40 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-5 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeCategory === cat ? 'text-orange-500' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full shadow-[0_-4px_10px_rgba(249,115,22,0.5)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
                {/* Search in Menu */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <Utensils className="text-orange-500" />
                            {activeCategory} {activeCategory === 'All' ? 'Items' : ''}
                        </h2>
                        <p className="text-slate-500 mt-1">Found {filteredFoods.length} items</p>
                    </div>

                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search in menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Food Grid */}
                {filteredFoods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFoods.map(item => (
                            <div
                                key={item._id}
                                className="group bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-orange-500/40 hover:shadow-orange-500/5 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Item Image */}
                                <div className="h-52 relative overflow-hidden bg-slate-800">
                                    {item.image ? (
                                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-6xl text-slate-700/50 select-none">
                                            <span>🍔</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>

                                    {/* Badges */}
                                    <span className="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                                        {item.category}
                                    </span>
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="bg-red-600 text-white font-black uppercase tracking-tighter px-4 py-2 rounded-xl text-sm shadow-2xl rotate-12">Sold Out</span>
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">
                                        {item.description || "A delicious addition to your meal, prepared with the freshest ingredients."}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-orange-400">
                                            <span className="text-xs font-bold mr-0.5">₹</span>
                                            <span className="text-2xl font-black">{item.price}</span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            disabled={!item.isAvailable || addingItems[item._id] || addedItems[item._id]}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-xl ${addedItems[item._id]
                                                    ? 'bg-green-500 text-white cursor-default'
                                                    : addingItems[item._id]
                                                        ? 'bg-orange-500/50 text-white cursor-wait'
                                                        : !item.isAvailable
                                                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                                }`}
                                        >
                                            {addingItems[item._id] ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : addedItems[item._id] ? (
                                                <>
                                                    <Check size={18} />
                                                    Added
                                                </>
                                            ) : !item.isAvailable ? (
                                                'Out of stock'
                                            ) : (
                                                <>
                                                    <ShoppingCart size={18} />
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-32 bg-slate-900/40 rounded-[3rem] border border-slate-800/50 animate-in fade-in zoom-in duration-500">
                        <div className="text-8xl mb-6">🍽️</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No items in this category</h3>
                        <p className="text-slate-500 font-medium">Try searching for something else or explore a different category.</p>
                        <button
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            className="mt-8 text-orange-500 font-black hover:text-orange-400 flex items-center gap-2 mx-auto uppercase tracking-widest text-sm"
                        >
                            Reset Menu Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RestaurantMenu;
