import React, { useState, useEffect, useMemo } from 'react';
import {
    ShoppingBag, Clock, IndianRupee, CheckCircle2,
    ArrowRight, Loader2, RefreshCw, User, Package
} from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const { data } = await API.get('/order/admin');
            setOrders(data || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const pending = orders.filter(o => o.status === 'Pending').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const active = orders.filter(o => ['Preparing', 'Out for Delivery'].includes(o.status)).length;
        const revenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Mock "today" count for UI
        const today = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

        return { totalOrders, pending, delivered, revenue, active, today };
    }, [orders]);

    const recentOrders = useMemo(() => {
        return orders.slice(0, 5);
    }, [orders]);

    const formatRelativeTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInHrs < 1) {
            const mins = Math.floor(diffInMs / (1000 * 60));
            return `${mins} mins ago`;
        }
        if (diffInHrs < 24) return `${diffInHrs} hrs ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-900 h-32 rounded-3xl border border-gray-800 animate-pulse"></div>
                    ))}
                </div>
                <div className="bg-gray-900 h-96 rounded-[2.5rem] border border-gray-800 animate-pulse"></div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                        <RefreshCw size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Sync Failed</h2>
                    <p className="text-gray-500 max-w-xs mb-8">We encountered an error while refreshing the dashboard data.</p>
                    <button onClick={fetchData} className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-orange-500/20">
                        Try Again
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 hover:border-blue-500/30 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">+{stats.today} Today</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{stats.totalOrders}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 hover:border-yellow-500/30 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        {stats.pending > 0 && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                        )}
                    </div>
                    <h3 className="text-3xl font-black text-yellow-400 mb-1">{stats.pending}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Orders</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 hover:border-green-500/30 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <IndianRupee size={24} />
                        </div>
                        <span className="text-[10px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">All Time</span>
                    </div>
                    <h3 className="text-3xl font-black text-green-400 mb-1">₹{stats.revenue}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Revenue</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-[2rem] border border-gray-800 hover:border-orange-500/30 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-orange-400 mb-1">{stats.delivered}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Delivered</p>
                </div>
            </div>

            {/* Status Pills */}
            <div className="bg-gray-900 p-2 rounded-[1.5rem] border border-gray-800 inline-flex flex-wrap gap-2 mb-10 shadow-lg">
                <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Live Counts
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    Preparing: {orders.filter(o => o.status === 'Preparing').length}
                </div>
                <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                    On the way: {orders.filter(o => o.status === 'Out for Delivery').length}
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white">Recent Activity</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Latest dispatch requests</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors text-sm"
                    >
                        View Full History <ArrowRight size={16} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {recentOrders.length > 0 ? (
                                recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-lg text-xs font-black uppercase font-mono group-hover:text-orange-400 transition-colors">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-500">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-sm font-bold text-white tracking-tight">{order.userId?.name || 'QuickUser'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-gray-600" />
                                                <span className="text-sm text-gray-400 font-medium">{order.items.length} units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-orange-500 tracking-tighter text-lg">₹{order.totalAmount}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                    order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                        order.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                            'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs text-gray-500 font-bold">{formatRelativeTime(order.createdAt)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No activity yet</p>
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

export default Dashboard;
