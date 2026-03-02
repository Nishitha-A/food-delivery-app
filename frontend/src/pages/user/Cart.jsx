import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();

    // State
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState({}); // { foodId: bool }
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const fetchCart = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/cart');
            setCartItems(data.items || []);
            updateCartCount(data.items?.length || 0);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            addToast('Failed to load cart. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.foodId.price * item.quantity), 0);
    }, [cartItems]);

    const deliveryFee = subtotal > 0 ? 40 : 0;
    const grandTotal = subtotal + deliveryFee;

    const handleUpdateQuantity = async (foodId, delta) => {
        const currentItem = cartItems.find(item => item.foodId._id === foodId);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + delta;

        if (newQuantity < 1) {
            handleRemoveItem(foodId);
            return;
        }

        setUpdatingItems(prev => ({ ...prev, [foodId]: true }));
        try {
            await API.post('/cart/add', { foodId, quantity: delta });
            // Optimistic update
            setCartItems(prev => prev.map(item =>
                item.foodId._id === foodId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (err) {
            addToast('Failed to update quantity', 'error');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [foodId]: false }));
        }
    };

    const handleRemoveItem = async (foodId) => {
        setUpdatingItems(prev => ({ ...prev, [foodId]: true }));
        try {
            await API.delete(`/cart/remove/${foodId}`);
            setCartItems(prev => prev.filter(item => item.foodId._id !== foodId));
            updateCartCount(cartCount - 1);
            addToast('Item removed from cart');
        } catch (err) {
            addToast('Failed to remove item', 'error');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [foodId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 pt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="h-10 bg-gray-800 w-48 rounded-lg animate-pulse mb-8"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-900 h-32 rounded-2xl border border-gray-800 animate-pulse"></div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 h-80 rounded-2xl border border-gray-800 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center p-6">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <ShoppingCart className="w-32 h-32 text-gray-800 mx-auto" strokeWidth={1} />
                        <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white border-4 border-gray-950 font-black text-2xl">0</div>
                    </div>
                    <h2 className="text-3xl font-black text-white mt-8 mb-4 tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
                        Looks like you haven't added anything yet. Explore our top restaurants and find something delicious!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-sm"
                    >
                        Browse Restaurants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-20 relative">
            {/* Toast Container */}
            <div className="fixed bottom-10 right-5 z-[100] flex flex-col gap-3">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}
                    >
                        {t.type === 'success' ? <Check size={20} className="text-white" /> : <div className="font-bold">!</div>}
                        <p className="font-bold">{t.message}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        Your Cart <span className="text-2xl animate-bounce">🛒</span>
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-orange-500 font-bold hover:text-orange-400 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add more items
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.foodId._id}
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-5 group hover:border-orange-500/30 transition-all flex flex-col sm:flex-row items-center gap-6"
                            >
                                {/* Item Image */}
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-800">
                                    {item.foodId.image ? (
                                        <img src={item.foodId.image} className="w-full h-full object-cover" alt={item.foodId.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">
                                        {item.foodId.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{item.foodId.category}</p>
                                    <p className="text-orange-400 font-bold">₹{item.foodId.price} <span className="text-gray-600 font-medium text-xs">per unit</span></p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center bg-gray-800/50 p-1 rounded-2xl border border-gray-700">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.foodId._id, -1)}
                                        disabled={updatingItems[item.foodId._id]}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-700 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="w-12 text-center text-white font-black text-lg">
                                        {updatingItems[item.foodId._id] ? (
                                            <Loader2 size={16} className="animate-spin mx-auto text-orange-500" />
                                        ) : (
                                            item.quantity
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.foodId._id, 1)}
                                        disabled={updatingItems[item.foodId._id]}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-500 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="min-w-[80px] text-right">
                                    <p className="text-2xl font-black text-white">₹{item.foodId.price * item.quantity}</p>
                                </div>

                                {/* Trash */}
                                <button
                                    onClick={() => handleRemoveItem(item.foodId._id)}
                                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                >
                                    <Trash2 size={22} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                                    <span className="text-white font-black text-lg">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Delivery Fee</span>
                                    <span className={`font-black text-lg ${deliveryFee === 0 ? 'text-green-500' : 'text-white'}`}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                {subtotal > 1000 && (
                                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-xl text-xs font-bold text-center">
                                        Congratulations! You saved ₹40 on delivery.
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-800 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Amount</p>
                                        <p className="text-4xl font-black text-orange-500 tracking-tighter">₹{grandTotal}</p>
                                    </div>
                                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-right">
                                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-5 rounded-[1.5rem] text-lg shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transform transition-all active:scale-[0.98] group"
                            >
                                Checkout
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-4 text-gray-500 font-bold hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <ArrowLeft size={16} /> Continue Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
