import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, CreditCard, Banknote, ShoppingBag,
    Loader2, CheckCircle2, ShieldCheck, Info
} from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    // State
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [progress, setProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        deliveryAddress: '',
        paymentMethod: 'COD'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const { data } = await API.get('/cart');
                if (!data.items || data.items.length === 0) {
                    navigate('/cart');
                    return;
                }
                setCartItems(data.items);
            } catch (err) {
                console.error('Checkout fetch error:', err);
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.foodId.price * item.quantity), 0);
    }, [cartItems]);

    const deliveryFee = subtotal > 1000 ? 0 : 40;
    const grandTotal = subtotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
            newErrors.deliveryAddress = 'Please enter a valid full delivery address (min 10 chars).';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setPlacingOrder(true);
        try {
            await API.post('/order', formData);
            updateCartCount(0); // Reset navbar badge
            setShowSuccess(true);

            // Progress Bar Animation
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);

            setTimeout(() => {
                navigate('/orders');
            }, 3500);
        } catch (err) {
            console.error('Order placement fail:', err);
            setErrors({ api: err.response?.data?.message || 'Failed to place order. Please try again.' });
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Secure Checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-20 relative px-4">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
                    <div className="bg-gray-900 border border-green-500/30 rounded-[3rem] p-10 md:p-16 max-w-sm w-full text-center relative z-10 shadow-2xl shadow-green-500/10 animate-in zoom-in-95 duration-500 delay-200">
                        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 border border-green-500/20 animate-bounce">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Order Placed! 🎉</h2>
                        <p className="text-gray-400 font-medium mb-10 leading-relaxed">
                            Hang tight! Your delicious meal is being prepared with love.
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black tracking-widest px-1">
                                <span>Redirecting to tracking</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-orange-500 transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                {/* Header & Back */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors font-bold text-sm group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to cart
                        </button>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                            Checkout <span className="text-2xl">⚡</span>
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl">
                        <ShieldCheck size={20} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secured 256-bit Connection</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Address Card */}
                            <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-8 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                    <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500">
                                        <MapPin size={20} />
                                    </div>
                                    Delivery Address
                                </h3>
                                <div className="space-y-4">
                                    <textarea
                                        name="deliveryAddress"
                                        value={formData.deliveryAddress}
                                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                        className={`w-full bg-gray-800/50 border ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-700'} rounded-2xl p-6 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-medium resize-none`}
                                        rows={4}
                                        placeholder="Flat No, Street Name, Landmark, Area, City - Pincode"
                                    ></textarea>
                                    {errors.deliveryAddress && (
                                        <p className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                                            <Info size={12} /> {errors.deliveryAddress}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method Card */}
                            <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-8 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                                        <CreditCard size={20} />
                                    </div>
                                    Payment Method
                                </h3>

                                <div className="space-y-4">
                                    {/* COD Card */}
                                    <div
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                                        className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.paymentMethod === 'COD'
                                                ? 'border-orange-500 bg-orange-500/5'
                                                : 'border-gray-800 bg-gray-800/40 hover:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-colors ${formData.paymentMethod === 'COD' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-500'}`}>
                                                <Banknote size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-white">Cash on Delivery</p>
                                                <p className="text-xs text-gray-500 font-medium">Pay when your order arrives</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === 'COD' ? 'border-orange-500' : 'border-gray-700'
                                            }`}>
                                            {formData.paymentMethod === 'COD' && <div className="w-3 h-3 bg-orange-500 rounded-full animate-in zoom-in"></div>}
                                        </div>
                                    </div>

                                    {/* Online Payment Card */}
                                    <div
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'Online' })}
                                        className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.paymentMethod === 'Online'
                                                ? 'border-blue-500 bg-blue-500/5'
                                                : 'border-gray-800 bg-gray-800/40 hover:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-colors ${formData.paymentMethod === 'Online' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-500'}`}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-white">Online Payment</p>
                                                <p className="text-xs text-gray-500 font-medium">Cards, UPI, Netbanking (Simulator)</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === 'Online' ? 'border-blue-500' : 'border-gray-700'
                                            }`}>
                                            {formData.paymentMethod === 'Online' && <div className="w-3 h-3 bg-blue-500 rounded-full animate-in zoom-in"></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={placingOrder}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-6 rounded-[2rem] text-xl shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {placingOrder ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>Placing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={24} />
                                        <span>Place Order Now</span>
                                    </>
                                )}
                            </button>
                            {errors.api && <p className="text-red-500 text-center font-bold text-sm">{errors.api}</p>}
                        </form>
                    </div>

                    {/* Right: Summary Container */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 sticky top-24 shadow-xl">
                            <h3 className="text-xl font-black text-white mb-8 border-b border-gray-800 pb-4">Order Summary</h3>

                            {/* Items List (Simplified) */}
                            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div key={item.foodId._id} className="flex justify-between items-center pr-2">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-tight">{item.foodId.name}</span>
                                            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.quantity} units</span>
                                        </div>
                                        <span className="text-slate-300 font-black text-sm">₹{item.foodId.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Section */}
                            <div className="space-y-4 border-t border-gray-800 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white font-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Delivery Fee</span>
                                    <span className={`font-black ${deliveryFee === 0 ? 'text-green-500' : 'text-white'}`}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-800/50">
                                    <div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Grand total</p>
                                        <p className="text-3xl font-black text-white">₹{grandTotal}</p>
                                    </div>
                                    <div className="bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">
                                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-tighter">Points +{Math.floor(grandTotal / 10)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
