import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus, Pencil, Trash2, ArrowLeft, Search,
    X, Loader2, RefreshCw, AlertTriangle, Check,
    Image as ImageIcon, Utensils
} from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const FoodItems = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();

    // State
    const [restaurant, setRestaurant] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
    const [currentFood, setCurrentFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', image: '', isAvailable: true
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete Confirm State
    const [deleteId, setDeleteId] = useState(null);

    // Toast State
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [resData, foodsData] = await Promise.all([
                API.get(`/restaurant/${restaurantId}`),
                API.get(`/food/${restaurantId}`)
            ]);

            setRestaurant(resData.data);
            setFoodItems(foodsData.data || []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(foodItems.map(item => item.category).filter(Boolean))];
        return cats;
    }, [foodItems]);

    const filteredItems = useMemo(() => {
        return foodItems.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [foodItems, activeCategory, searchQuery]);

    const handleOpenModal = (food = null) => {
        if (food) {
            setModalMode('edit');
            setCurrentFood(food);
            setFormData({
                name: food.name,
                price: food.price,
                category: food.category || '',
                image: food.image || '',
                isAvailable: food.isAvailable
            });
        } else {
            setModalMode('add');
            setCurrentFood(null);
            setFormData({
                name: '', price: '', category: '', image: '', isAvailable: true
            });
        }
        setIsModalOpen(true);
        setFormError('');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            if (modalMode === 'add') {
                const { data } = await API.post(`/food/${restaurantId}`, formData);
                setFoodItems(prev => [data, ...prev]);
                addToast('Item added to menu');
            } else {
                const { data } = await API.put(`/food/${currentFood._id}`, formData);
                setFoodItems(prev => prev.map(f => f._id === data._id ? data : f));
                addToast('Item updated successfully');
            }
            setIsModalOpen(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save item');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleAvailability = async (food) => {
        try {
            const { data } = await API.put(`/food/${food._id}`, { isAvailable: !food.isAvailable });
            setFoodItems(prev => prev.map(f => f._id === data._id ? data : f));
            addToast(`Item marked as ${data.isAvailable ? 'Available' : 'Sold Out'}`);
        } catch (err) {
            addToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/food/${deleteId}`);
            setFoodItems(prev => prev.filter(f => f._id !== deleteId));
            addToast('Item removed from menu');
            setDeleteId(null);
        } catch (err) {
            addToast('Failed to delete item', 'error');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Menu Management">
                <div className="h-6 w-32 bg-gray-800 rounded mb-4 animate-pulse"></div>
                <div className="h-10 w-64 bg-gray-800 rounded-xl mb-10 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-gray-900 h-64 rounded-3xl border border-gray-800"></div>)}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Inventory: ${restaurant?.name || 'Loading...'}`}>
            {/* Toasts */}
            <div className="fixed bottom-10 right-5 z-[100] flex flex-col gap-3">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                        <p className="font-black text-sm">{t.message}</p>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/admin/restaurants')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} className="text-orange-500" /> Back to Listings
                    </button>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                        Menu Inventory <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-lg border border-orange-500/20">{foodItems.length} items</span>
                    </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative group min-w-[300px]">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Find an item..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Plus size={20} /> Add Food
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeCategory === cat
                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/10'
                            : 'bg-gray-900 text-gray-500 border-gray-800 hover:text-white hover:border-gray-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div key={item._id} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/30 transition-all shadow-xl hover:shadow-2xl">
                            <div className="h-44 relative bg-gray-800">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20"><Utensils size={48} /></div>
                                )}
                                <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                                    <span className="bg-black/40 backdrop-blur-md text-orange-400 text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/10 tracking-widest uppercase">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-orange-500 text-white text-lg font-black px-4 py-1.5 rounded-[1.2rem] shadow-xl">
                                        ₹{item.price}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleToggleAvailability(item)}
                                            className={`w-10 h-6 rounded-full p-1 transition-all duration-300 relative ${item.isAvailable ? 'bg-green-500' : 'bg-gray-700'}`}
                                            title={item.isAvailable ? 'In Stock' : 'Sold Out'}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${item.isAvailable ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-750 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest"
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(item._id)}
                                        className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed">
                    <Utensils size={64} className="text-gray-800 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Empty Kitchen</h3>
                    <p className="text-gray-500 font-medium max-w-xs mx-auto">This menu doesn't have any items matching your current filters.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-3xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white tracking-tight">{modalMode === 'add' ? 'Add Food Item' : 'Edit Food Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-800 text-gray-500 hover:text-white rounded-xl"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Dish Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., Margherita Pizza"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="199"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Pizza / Burgers"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Photo URL</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                    />
                                    <div className="w-14 h-14 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex-shrink-0 flex items-center justify-center">
                                        {formData.image ? <img src={formData.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-600" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-2xl border border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-500'}`}>
                                        <Check size={18} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-300">In Stock</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${formData.isAvailable ? 'bg-green-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${formData.isAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            {formError && <p className="text-red-500 text-xs font-bold text-center">{formError}</p>}

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-[1.5rem] tracking-widest uppercase transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {formLoading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setDeleteId(null)}></div>
                    <div className="bg-gray-900 border border-red-500/20 w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-3xl text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Delete Dish?</h2>
                        <p className="text-gray-500 text-sm font-medium mb-8">This dish will be removed from the restaurant menu permanently.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-all">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default FoodItems;
