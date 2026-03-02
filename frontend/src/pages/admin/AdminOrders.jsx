import React, { useState, useEffect, useMemo } from 'react';
import {
    ShoppingBag, Search, Clock, MapPin,
    CreditCard, Banknote, ChevronDown, ChevronUp,
    Loader2, RefreshCw, CheckCircle2, User,
    Package, Filter, ExternalLink
} from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/order/admin');
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await API.put(`/order/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const statusTabs = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesTab = activeTab === 'All' || o.status === activeTab;
            const matchesSearch =
                o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (o.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (o.userId?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [orders, activeTab, searchQuery]);

    const formatRelativeTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHrs < 1) return 'Recently';
        if (diffInHrs < 24) return `${diffInHrs}h ago`;
        return date.toLocaleDateString();
    };

    if (loading && orders.length === 0) {
        return (
            <AdminLayout title="Order Management">
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 bg-gray-900 w-full max-w-lg rounded-2xl mb-8"></div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-gray-900 w-full rounded-[2rem] border border-gray-800"></div>
                    ))}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dispatch Hub">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                        Order Control <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-lg border border-orange-500/20">{orders.length} TOTAL</span>
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <RefreshCw size={12} className={loading ? 'animate-spin text-orange-500' : ''} />
                        <span>Last sync: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative group flex-1 min-w-[300px]">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Order ID, Customer Name or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
                        />
                    </div>
                    <button onClick={fetchOrders} className="p-3.5 bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 rounded-2xl transition-all shadow-lg active:scale-95">
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
                {statusTabs.map(tab => {
                    const count = orders.filter(o => tab === 'All' || o.status === tab).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border flex items-center gap-2 ${activeTab === tab
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20'
                                    : 'bg-gray-900 text-gray-500 border-gray-800 hover:text-white hover:border-gray-700'
                                }`}
                        >
                            {tab}
                            <span className={`px-2 py-0.5 rounded-lg ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-600'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <React.Fragment key={order._id}>
                                        <tr
                                            className={`hover:bg-gray-800/20 transition-all group cursor-pointer ${expandedOrder === order._id ? 'bg-orange-500/[0.03]' : ''}`}
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-slate-800 text-gray-400 px-3 py-1 rounded-lg text-xs font-black font-mono group-hover:text-orange-400 transition-colors uppercase">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </span>
                                                    {expandedOrder === order._id ? <ChevronUp size={14} className="text-orange-500" /> : <ChevronDown size={14} className="text-gray-600" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-500">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">{order.userId?.name || 'QuickUser'}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold max-w-[120px] truncate">{order.userId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-white tracking-tighter">₹{order.totalAmount}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`px-2 py-1 rounded-lg inline-flex items-center gap-2 border ${order.paymentMethod === 'COD' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {order.paymentMethod === 'COD' ? <Banknote size={10} /> : <CreditCard size={10} />}
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{order.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                        order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                            order.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                                'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                                                <div className="relative group/sel">
                                                    <select
                                                        value={order.status}
                                                        disabled={updatingId === order._id}
                                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                        className="bg-gray-800 border-none outline-none rounded-xl text-xs font-black uppercase tracking-widest text-white px-4 py-2 appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/10 pr-10 hover:bg-gray-750 transition-all disabled:opacity-50"
                                                    >
                                                        {statusTabs.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                        {updatingId === order._id ? <Loader2 size={14} className="animate-spin text-orange-500" /> : <ChevronDown size={14} />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-gray-500 font-bold">{formatRelativeTime(order.createdAt)}</p>
                                            </td>
                                        </tr>
                                        {/* Expanded View */}
                                        {expandedOrder === order._id && (
                                            <tr>
                                                <td colSpan="7" className="px-8 py-8 bg-gray-950/50 border-y border-gray-800/50">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-top-4 duration-500">
                                                        {/* Items */}
                                                        <div className="lg:col-span-2 space-y-6">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4 flex items-center gap-2">
                                                                    <Package size={14} className="text-orange-500" /> Ordered Items
                                                                </p>
                                                                <div className="space-y-3 bg-gray-900/50 rounded-3xl p-6 border border-gray-800/50">
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex items-center justify-between group/itm">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-black text-gray-500">
                                                                                    {item.quantity}x
                                                                                </div>
                                                                                <span className="text-sm font-bold text-white group-hover/itm:text-orange-400 transition-colors uppercase tracking-tight">{item.name}</span>
                                                                            </div>
                                                                            <span className="text-sm font-black text-gray-500">₹{item.price * item.quantity}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Delivery Info */}
                                                        <div className="space-y-6">
                                                            <div className="bg-slate-800/30 rounded-3xl p-6 border border-gray-800/50 space-y-6">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">Delivery Details</p>
                                                                    <div className="flex items-start gap-3">
                                                                        <MapPin size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                                                                        <p className="text-sm text-gray-400 font-medium leading-relaxed">{order.deliveryAddress}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-6 border-t border-gray-800/50 flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Total Impact</p>
                                                                        <p className="text-2xl font-black text-white tracking-tighter">₹{order.totalAmount}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Payment</p>
                                                                        <p className="text-xs font-black text-orange-500 uppercase tracking-widest">{order.paymentMethod}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-32 text-center">
                                        <div className="relative inline-block mb-6">
                                            <ShoppingBag size={80} strokeWidth={1} className="text-gray-800" />
                                            <div className="absolute inset-0 flex items-center justify-center text-3xl">📭</div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">No processing orders</h3>
                                        <p className="text-gray-500 text-sm font-medium">Sit tight! New orders will appear here as soon as customers checkout.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
