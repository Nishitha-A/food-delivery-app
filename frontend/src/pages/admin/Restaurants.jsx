// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Plus, Pencil, Trash2, UtensilsCrossed,
//     MapPin, Search, X, Loader2, RefreshCw,
//     AlertTriangle, Check, Image as ImageIcon
// } from 'lucide-react';
// import API from '../../api/axios';
// import AdminLayout from '../../components/AdminLayout';

// const Restaurants = () => {
//     const navigate = useNavigate();
//     const [restaurants, setRestaurants] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');

//     // Modal State
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
//     const [currentRestaurant, setCurrentRestaurant] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '', description: '', address: '', image: '', isActive: true
//     });
//     const [formLoading, setFormLoading] = useState(false);
//     const [formError, setFormError] = useState('');

//     // Delete Confirm State
//     const [deleteId, setDeleteId] = useState(null);

//     // Toast State
//     const [toasts, setToasts] = useState([]);

//     const addToast = (message, type = 'success') => {
//         const id = Date.now();
//         setToasts(prev => [...prev, { id, message, type }]);
//         setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
//     };

//     const fetchRestaurants = async () => {
//         setLoading(true);
//         setError(false);
//         try {
//             const { data } = await API.get('/restaurant');
//             setRestaurants(data || []);
//         } catch (err) {
//             setError(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRestaurants();
//     }, []);

//     const filteredRestaurants = restaurants.filter(res =>
//         res.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const handleOpenModal = (res = null) => {
//         if (res) {
//             setModalMode('edit');
//             setCurrentRestaurant(res);
//             setFormData({
//                 name: res.name,
//                 description: res.description,
//                 address: res.address,
//                 image: res.image || '',
//                 isActive: res.isActive
//             });
//         } else {
//             setModalMode('add');
//             setCurrentRestaurant(null);
//             setFormData({
//                 name: '', description: '', address: '', image: '', isActive: true
//             });
//         }
//         setIsModalOpen(true);
//         setFormError('');
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         setFormLoading(true);
//         setFormError('');
//         try {
//             if (modalMode === 'add') {
//                 const { data } = await API.post('/restaurant', formData);
//                 setRestaurants(prev => [data, ...prev]);
//                 addToast('Restaurant added successfully!');
//             } else {
//                 const { data } = await API.put(`/restaurant/${currentRestaurant._id}`, formData);
//                 setRestaurants(prev => prev.map(r => r._id === data._id ? data : r));
//                 addToast('Restaurant updated successfully!');
//             }
//             setIsModalOpen(false);
//         } catch (err) {
//             setFormError(err.response?.data?.message || 'Something went wrong');
//         } finally {
//             setFormLoading(false);
//         }
//     };

//     const handleToggleStatus = async (res) => {
//         try {
//             const { data } = await API.put(`/restaurant/${res._id}`, { isActive: !res.isActive });
//             setRestaurants(prev => prev.map(r => r._id === data._id ? data : r));
//             addToast(`Restaurant marked as ${data.isActive ? 'Active' : 'Inactive'}`);
//         } catch (err) {
//             addToast('Failed to update status', 'error');
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             await API.delete(`/restaurant/${deleteId}`);
//             setRestaurants(prev => prev.filter(r => r._id !== deleteId));
//             addToast('Restaurant removed successfully');
//             setDeleteId(null);
//         } catch (err) {
//             addToast('Failed to delete restaurant', 'error');
//         }
//     };

//     if (loading) {
//         return (
//             <AdminLayout title="Restaurants">
//                 <div className="flex justify-between mb-8 animate-pulse">
//                     <div className="h-10 bg-gray-800 w-64 rounded-xl"></div>
//                     <div className="h-10 bg-gray-800 w-40 rounded-xl"></div>
//                 </div>
//                 <div className="space-y-4">
//                     {[1, 2, 3, 4, 5].map(i => (
//                         <div key={i} className="bg-gray-900 h-20 rounded-2xl border border-gray-800 animate-pulse"></div>
//                     ))}
//                 </div>
//             </AdminLayout>
//         );
//     }

//     return (
//         <AdminLayout title="Restaurants">
//             {/* Toasts */}
//             <div className="fixed bottom-10 right-5 z-[100] flex flex-col gap-3">
//                 {toasts.map(t => (
//                     <div key={t.id} className={`flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
//                         {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
//                         <p className="font-black text-sm">{t.message}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//                 <div>
//                     <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
//                         Listings <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded-lg border border-orange-500/20">{restaurants.length}</span>
//                     </h2>
//                     <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage global venue directory</p>
//                 </div>
//                 <button
//                     onClick={() => handleOpenModal()}
//                     className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-sm uppercase tracking-widest"
//                 >
//                     <Plus size={20} /> Add Restaurant
//                 </button>
//             </div>

//             {/* Search & Actions */}
//             <div className="bg-gray-900 p-4 border border-gray-800 rounded-[2rem] flex flex-col md:flex-row gap-4 mb-8 shadow-xl">
//                 <div className="relative flex-1 group">
//                     <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
//                     <input
//                         type="text"
//                         placeholder="Search by name, cuisine, or area..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full pl-12 pr-6 py-3 bg-gray-800 border border-transparent rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium"
//                     />
//                 </div>
//                 <button onClick={fetchRestaurants} className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl transition-all">
//                     <RefreshCw size={20} />
//                 </button>
//             </div>

//             {/* List */}
//             <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-800/50">
//                             <tr>
//                                 <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Venue</th>
//                                 <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Location</th>
//                                 <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Visibility</th>
//                                 <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Settings</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-800">
//                             {filteredRestaurants.length > 0 ? (
//                                 filteredRestaurants.map(res => (
//                                     <tr key={res._id} className="hover:bg-gray-800/20 transition-all group">
//                                         <td className="px-8 py-6">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-md flex-shrink-0">
//                                                     {res.image ? (
//                                                         <img src={res.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
//                                                     ) : (
//                                                         <div className="w-full h-full flex items-center justify-center text-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-black">
//                                                             {res.name.charAt(0)}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-black text-white group-hover:text-orange-500 transition-colors tracking-tight">{res.name}</p>
//                                                     <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">ID: #{res._id.slice(-6).toUpperCase()}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <div className="flex items-center gap-2 text-gray-400 max-w-[200px]">
//                                                 <MapPin size={14} className="text-orange-500 flex-shrink-0" />
//                                                 <span className="text-xs font-medium truncate">{res.address}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <div className="flex justify-center">
//                                                 <button
//                                                     onClick={() => handleToggleStatus(res)}
//                                                     className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${res.isActive ? 'bg-green-500' : 'bg-gray-700'}`}
//                                                 >
//                                                     <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${res.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
//                                                 </button>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <div className="flex items-center justify-end gap-2">
//                                                 <button
//                                                     onClick={() => navigate(`/admin/restaurants/${res._id}/foods`)}
//                                                     className="p-2.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-lg shadow-blue-500/5 flex items-center gap-2 group/btn"
//                                                     title="Manage Menu"
//                                                 >
//                                                     <UtensilsCrossed size={16} />
//                                                     <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Menu</span>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleOpenModal(res)}
//                                                     className="p-2.5 bg-gray-800 text-gray-400 hover:bg-white hover:text-gray-900 rounded-xl transition-all shadow-lg"
//                                                     title="Edit Details"
//                                                 >
//                                                     <Pencil size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setDeleteId(res._id)}
//                                                     className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/5 outline-none"
//                                                     title="Delete Venue"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="4" className="px-8 py-20 text-center">
//                                         <UtensilsCrossed size={48} className="text-gray-800 mx-auto mb-4" />
//                                         <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No matching restaurants found</p>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
//                     <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
//                     <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-3xl animate-in zoom-in-95 duration-300">
//                         <div className="flex items-center justify-between mb-8">
//                             <h3 className="text-2xl font-black text-white tracking-tight">{modalMode === 'add' ? 'Add Venue' : 'Edit Venue'}</h3>
//                             <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-800 text-gray-500 hover:text-white rounded-xl"><X size={20} /></button>
//                         </div>

//                         <form onSubmit={handleFormSubmit} className="space-y-6">
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Restaurant Name</label>
//                                 <input
//                                     required
//                                     type="text"
//                                     placeholder="e.g., The Italian Palace"
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                     className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold"
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Address</label>
//                                 <input
//                                     required
//                                     type="text"
//                                     placeholder="Street, Landmark, City"
//                                     value={formData.address}
//                                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                     className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold"
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
//                                 <textarea
//                                     rows={3}
//                                     placeholder="Tell something about this place..."
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     className="w-full bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold resize-none"
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Imagery URL</label>
//                                 <div className="flex gap-4">
//                                     <input
//                                         type="text"
//                                         placeholder="https://images.unsplash.com/..."
//                                         value={formData.image}
//                                         onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//                                         className="flex-1 bg-gray-800 border border-transparent rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
//                                     />
//                                     <div className="w-14 h-14 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex-shrink-0 flex items-center justify-center">
//                                         {formData.image ? <img src={formData.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-600" />}
//                                     </div>
//                                 </div>
//                             </div>

//                             {formError && <p className="text-red-500 text-xs font-bold text-center mt-2">{formError}</p>}

//                             <button
//                                 type="submit"
//                                 disabled={formLoading}
//                                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-[1.5rem] tracking-widest uppercase transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
//                             >
//                                 {formLoading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Details'}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation */}
//             {deleteId && (
//                 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
//                     <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setDeleteId(null)}></div>
//                     <div className="bg-gray-900 border border-red-500/20 w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-3xl text-center animate-in zoom-in-95 duration-300">
//                         <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
//                             <AlertTriangle size={32} />
//                         </div>
//                         <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Delete Listing?</h2>
//                         <p className="text-gray-500 text-sm font-medium mb-8">This action is permanent and will also delete all associated menu items.</p>
//                         <div className="flex gap-3">
//                             <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-all">Cancel</button>
//                             <button onClick={handleDelete} className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">Yes, Delete</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </AdminLayout>
//     );
// };

// export default Restaurants;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Pencil, Trash2, UtensilsCrossed,
    MapPin, Search, X, Loader2, RefreshCw,
    AlertTriangle, Check, Image as ImageIcon
} from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const Restaurants = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', address: '', image: '', isActive: true
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const fetchRestaurants = async () => {
        setLoading(true);
        setError(false);
        try {
            const { data } = await API.get('/restaurants'); // ✅ FIXED
            setRestaurants(data || []);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(res =>
        res.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (res = null) => {
        if (res) {
            setModalMode('edit');
            setCurrentRestaurant(res);
            setFormData({
                name: res.name,
                description: res.description,
                address: res.address,
                image: res.image || '',
                isActive: res.isActive
            });
        } else {
            setModalMode('add');
            setCurrentRestaurant(null);
            setFormData({
                name: '', description: '', address: '', image: '', isActive: true
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
                const { data } = await API.post('/restaurants', formData); // ✅ FIXED
                setRestaurants(prev => [data, ...prev]);
                addToast('Restaurant added successfully!');
            } else {
                const { data } = await API.put(`/restaurants/${currentRestaurant._id}`, formData); // ✅ FIXED
                setRestaurants(prev => prev.map(r => r._id === data._id ? data : r));
                addToast('Restaurant updated successfully!');
            }
            setIsModalOpen(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (res) => {
        try {
            const { data } = await API.put(`/restaurants/${res._id}`, { isActive: !res.isActive }); // ✅ FIXED
            setRestaurants(prev => prev.map(r => r._id === data._id ? data : r));
            addToast(`Restaurant marked as ${data.isActive ? 'Active' : 'Inactive'}`);
        } catch (err) {
            addToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/restaurants/${deleteId}`); // ✅ FIXED
            setRestaurants(prev => prev.filter(r => r._id !== deleteId));
            addToast('Restaurant removed successfully');
            setDeleteId(null);
        } catch (err) {
            addToast('Failed to delete restaurant', 'error');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Restaurants">
                <div className="text-center py-20 text-white">Loading...</div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title="Restaurants">
                <div className="text-center py-20">
                    <p className="text-red-500 font-bold text-lg">Failed to load restaurants</p>
                    <button
                        onClick={fetchRestaurants}
                        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Restaurants">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Restaurant Listings</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Add Restaurant
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                {filteredRestaurants.length === 0 ? (
                    <p className="text-gray-400 text-center">No restaurants found</p>
                ) : (
                    filteredRestaurants.map(res => (
                        <div key={res._id} className="flex justify-between items-center border-b border-gray-800 py-4">
                            <div>
                                <p className="text-white font-semibold">{res.name}</p>
                                <p className="text-gray-500 text-sm">{res.address}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleOpenModal(res)}>
                                    <Pencil size={18} className="text-yellow-400" />
                                </button>
                                <button onClick={() => setDeleteId(res._id)}>
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
};

export default Restaurants;
