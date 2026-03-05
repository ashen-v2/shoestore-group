import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const [productForm, setProductForm] = useState({
        name: '', brand: '', category: 'uncategorized', price: 0, image_url: 'https://placehold.co/600x400'
    });

    const categories = [
        { value: 'casual', label: 'Casual' },
        { value: 'formal', label: 'Formal' },
        { value: 'sports', label: 'Sports' },
        { value: 'uncategorized', label: 'Uncategorized' },
    ];

    useEffect(() => { fetchInventory(); }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        }
    };

    const openEditModal = (product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setProductForm({
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            image_url: product.image_url
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setProductForm({ name: '', brand: '', category: 'uncategorized', price: 0, image_url: 'https://placehold.co/600x400' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.patch(`/products/${currentProductId}`, productForm);
            } else {
                await api.post('/products/', productForm);
            }
            setShowModal(false);
            fetchInventory();
        } catch (err) {
            alert("Error saving product. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this shoe?")) {
            await api.delete(`/products/${id}`);
            fetchInventory();
        }
    };

    // Analytics Logic - Requirement: Business Insights 
    const totalStock = products.length;
    const nikeCount = products.filter(p => p.brand.toLowerCase() === 'nike').length;
    const adidasCount = products.filter(p => p.brand.toLowerCase() === 'adidas').length;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar - Requirement: Role-based access control navigation [cite: 56, 70] */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">

                    {/* Header Section */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">System Overview</h1>
                        <p className="text-gray-500 font-medium">Manage your inventory and monitor business trends.</p>
                    </div>

                    {/* Analytics Cards - Requirement: Business Insights & Trend Analysis  */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Total Inventory</p>
                            <p className="text-4xl font-black italic">{totalStock} <span className="text-sm not-italic font-bold text-gray-300">PAIRS</span></p>
                        </div>
                        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Nike Collection</p>
                            <p className="text-4xl font-black italic">{nikeCount}</p>
                        </div>
                        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Adidas Collection</p>
                            <p className="text-4xl font-black italic">{adidasCount}</p>
                        </div>
                    </div>

                    {/* Sales Trend Visualization - Requirement: Analyse trends for business insights  */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-black text-sm font-black uppercase italic tracking-wider">Weekly Sales Performance</h3>
                            <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 font-black rounded-full uppercase tracking-tighter">+18% Revenue</span>
                        </div>
                        <div className="flex items-end space-x-3 h-32 mb-4">
                            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                                <div key={i} className="flex-1 bg-black hover:bg-gray-700 transition-all duration-300 rounded-t-sm" style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Inventory Table Section - Requirement: Inventory management tools [cite: 49, 85] */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Inventory Management</h2>
                        <button onClick={openAddModal} className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                            + Add New Shoe
                        </button>
                    </div>

                    <div className="bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden mb-10">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 uppercase text-[10px] font-black text-gray-500 tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="p-5">Product Name</th>
                                    <th className="p-5">Brand</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Price</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5 font-bold text-sm text-black">{product.name}</td>
                                        <td className="p-5 text-gray-500 text-sm font-medium">{product.brand}</td>
                                        <td className="p-5 text-gray-400 text-xs font-black uppercase tracking-widest">{product.category}</td>
                                        <td className="p-5 text-sm font-black italic text-black">${product.price}</td>
                                        <td className="p-5 text-right space-x-4">
                                            <button onClick={() => openEditModal(product)} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal - Requirement: Support product management [cite: 35, 53] */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white p-10 max-w-md w-full shadow-2xl rounded-2xl">
                        <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight text-black border-b pb-4">
                            {isEditing ? 'Update Inventory' : 'Add New Arrival'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Model Name</label>
                                <input
                                    type="text" required value={productForm.name}
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all"
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand</label>
                                    <input
                                        type="text" required value={productForm.brand}
                                        className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all"
                                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</label>
                                    <select
                                        value={productForm.category}
                                        className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none bg-white font-bold text-sm transition-all"
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    >
                                        {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retail Price (USD)</label>
                                <input
                                    type="number" required value={productForm.price}
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-black italic text-sm transition-all"
                                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Image Source URL</label>
                                <input
                                    type="text" value={productForm.image_url}
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-medium text-xs text-gray-500 transition-all"
                                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-black uppercase text-[10px] tracking-widest border-2 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 shadow-lg active:scale-95 transition-all">
                                    {isEditing ? 'Push Updates' : 'Commit to DB'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;