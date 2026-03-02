import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Clock, MapPin, CheckCircle2, Truck,
    ChefHat, ClipboardList, CreditCard, Banknote,
    ChevronDown, ChevronUp, RefreshCw, ArrowLeft, Loader2
} from 'lucide-react';
import API from '../../api/axios';

const Orders = () => {
    const navigate = useNavigate();

    // State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedOrders, setExpandedOrders] = useState({}); // { orderId: bool }

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await API.get('/orders/user');
            // Handle both array and object responses
            const ordersData = Array.isArray(res.data)
                ? res.data
                : res.data.orders || [];
            setOrders(ordersData);
        } catch (error) {
            console.error('Orders fetch error:',
                error.response?.data || error.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const statusMap = {
        'Pending': { color: 'yellow', icon: ClipboardList, step: 1 },
        'Preparing': { color: 'blue', icon: ChefHat, step: 2 },
        'Out for Delivery': { color: 'purple', icon: Truck, step: 3 },
        'Delivered': { color: 'green', icon: CheckCircle2, step: 4 },
        'Cancelled': { color: 'red', icon: Package, step: 0 }
    };

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'Active', label: 'Active' },
        { id: 'Delivered', label: 'Delivered' },
        { id: 'Cancelled', label: 'Cancelled' }
    ];

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (activeTab === 'All') return true;
            if (activeTab === 'Active') return ['Pending', 'Preparing', 'Out for Delivery'].includes(order.status);
            return order.status === activeTab;
        });
    }, [orders, activeTab]);

    const getTabCount = (tabId) => {
        if (tabId === 'All') return orders.length;
        if (tabId === 'Active') return orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
        return orders.filter(o => o.status === tabId).length;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        return `${date.toLocaleDateString('en-US', options)} • ${date.toLocaleTimeString('en-US', timeOptions)}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="h-10 bg-gray-900 w-48 rounded-lg animate-pulse mb-8"></div>
                    <div className="flex gap-2 mb-8 h-12 bg-gray-900 w-full max-w-md rounded-2xl animate-pulse"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-3xl h-64 mb-6 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <RefreshCw size={32} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Failed to load orders</h2>
                <p className="text-gray-500 max-w-xs mb-8">We couldn't retrieve your order history. This might be a temporary connection issue.</p>
                <button
                    onClick={fetchOrders}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl shadow-orange-500/20"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-20 relative px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        My Orders <span className="text-2xl animate-bounce">📦</span>
                    </h1>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-400 font-medium">Track and manage your food orders</p>
                        <p className="text-gray-600 text-xs font-black uppercase tracking-widest">{orders.length} orders placed</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-gray-900/50 p-1.5 rounded-[2rem] inline-flex gap-1 mb-10 border border-gray-800 overflow-x-auto no-scrollbar max-w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                                : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                                }`}>
                                {getTabCount(tab.id)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const currentStatus = statusMap[order.status] || statusMap['Pending'];
                            const isActive = ['Pending', 'Preparing', 'Out for Delivery'].includes(order.status);
                            const isExpanded = expandedOrders[order._id];
                            const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);

                            return (
                                <div
                                    key={order._id}
                                    className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl hover:border-gray-700 transition-all duration-300 group"
                                >
                                    {/* Card Header */}
                                    <div className="bg-slate-800/40 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/50">
                                        <div className="space-y-1">
                                            <p className="text-xl font-black text-white group-hover:text-orange-500 transition-colors">
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </p>
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                                <Clock size={14} className="text-orange-500/60" />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>

                                        <div className={`px-4 py-2 rounded-2xl flex items-center gap-3 border ${order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                            order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                order.status === 'Out for Delivery' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                                                    order.status === 'Preparing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' :
                                                order.status === 'Cancelled' ? 'bg-red-500' :
                                                    order.status === 'Out for Delivery' ? 'bg-purple-500 animate-pulse' :
                                                        order.status === 'Preparing' ? 'bg-blue-500 animate-pulse' :
                                                            'bg-yellow-500 animate-pulse'
                                                }`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{order.status}</span>
                                        </div>
                                    </div>

                                    {/* Progress Tracker (Only if not cancelled) */}
                                    {order.status !== 'Cancelled' && (
                                        <div className="px-8 py-10 bg-gray-900/30 border-b border-gray-800/50">
                                            <div className="relative flex justify-between">
                                                {/* Connecting Lines */}
                                                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-800 -z-0">
                                                    <div
                                                        className="h-full bg-orange-500 transition-all duration-1000"
                                                        style={{ width: `${((currentStatus.step - 1) / 3) * 100}%` }}
                                                    ></div>
                                                </div>

                                                {/* Steps */}
                                                {[
                                                    { id: 'Pending', icon: ClipboardList, label: 'Placed' },
                                                    { id: 'Preparing', icon: ChefHat, label: 'Kitchen' },
                                                    { id: 'Out for Delivery', icon: Truck, label: 'Delivery' },
                                                    { id: 'Delivered', icon: CheckCircle2, label: 'Arrived' }
                                                ].map((step, idx) => {
                                                    const isCompleted = currentStatus.step > idx + 1;
                                                    const isCurrent = currentStatus.step === idx + 1;
                                                    const StepIcon = step.icon;

                                                    return (
                                                        <div key={idx} className="relative z-10 flex flex-col items-center">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-orange-500 text-white' :
                                                                isCurrent ? 'bg-orange-500 text-white ring-4 ring-orange-500/20 animate-pulse' :
                                                                    'bg-gray-800 text-gray-600'
                                                                }`}>
                                                                {isCompleted ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                                                            </div>
                                                            <span className={`mt-3 text-[10px] font-black uppercase tracking-widest hidden sm:block ${isCurrent ? 'text-orange-500' : 'text-gray-500'
                                                                }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {/* Mobile Current Status Display */}
                                            <div className="sm:hidden mt-6 text-center">
                                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Status</p>
                                                <p className="text-orange-500 font-black text-lg">{order.status}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="px-8 py-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Items Ordered</p>
                                        <div className="space-y-3">
                                            {visibleItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm group/item">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center text-xs font-black text-gray-500">
                                                            {item.quantity}x
                                                        </div>
                                                        <span className="text-white font-medium group-hover/item:text-orange-400 transition-colors">{item.name}</span>
                                                    </div>
                                                    <span className="text-gray-500 font-bold tracking-tight">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {order.items.length > 3 && (
                                            <button
                                                onClick={() => toggleExpand(order._id)}
                                                className="mt-6 text-orange-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-orange-400 transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <><ChevronUp size={14} /> Show Less</>
                                                ) : (
                                                    <><ChevronDown size={14} /> + {order.items.length - 3} more items</>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-8 py-6 bg-slate-800/20 border-t border-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-500 max-w-sm">
                                                <MapPin size={16} className="text-orange-500" />
                                                <span className="text-xs font-medium truncate">{order.deliveryAddress}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-800/60 px-3 py-1 rounded-lg flex items-center gap-2 border border-gray-700">
                                                    {order.paymentMethod === 'COD' ? <Banknote size={12} className="text-green-500" /> : <CreditCard size={12} className="text-blue-500" />}
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Total Paid</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-3xl font-black text-white tracking-tighter">₹{order.totalAmount}</span>
                                                <span className="text-gray-600 font-bold text-[10px] mb-1">+ ₹40 Delivery</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty States */
                    <div className="bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed py-24 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative mb-8">
                            {activeTab === 'All' ? (
                                <Package size={100} strokeWidth={1} className="text-gray-800" />
                            ) : (
                                <RefreshCw size={100} strokeWidth={1} className="text-gray-800" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                {activeTab === 'All' ? '🧊' : '🔍'}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                            {activeTab === 'All' ? 'No orders yet' : `No ${activeTab} orders`}
                        </h3>
                        <p className="text-gray-500 font-medium max-w-xs mx-auto mb-10">
                            {activeTab === 'All'
                                ? "Looks like you haven't placed any orders yet. Delicious food is just a few clicks away!"
                                : `We couldn't find any orders with the status "${activeTab}". Try checking a different category.`}
                        </p>

                        {activeTab === 'All' ? (
                            <button
                                onClick={() => navigate('/')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-sm"
                            >
                                Start Ordering
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveTab('All')}
                                className="text-orange-500 font-bold hover:text-orange-400 transition-colors uppercase tracking-widest text-sm"
                            >
                                View All Orders
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
