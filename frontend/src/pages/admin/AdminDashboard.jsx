import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track if we are editing
    const [currentProductId, setCurrentProductId] = useState(null); // Track which ID to update

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
        const response = await api.get('/products/');
        setProducts(response.data);
    };

    // Open modal in Edit Mode
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

    // Open modal in Add Mode
    const openAddModal = () => {
        setIsEditing(false);
        setProductForm({ name: '', brand: '', category: 'uncategorized', price: 0, image_url: 'https://placehold.co/600x400' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Calls the PATCH /{product_id} route
                await api.patch(`/products/${currentProductId}`, productForm);
            } else {
                // Calls the POST / route
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

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Inventory Management</h1>
                    <button onClick={openAddModal} className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-gray-800">
                        + Add New Shoe
                    </button>
                </div>

                <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Brand</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">{product.name}</td>
                                    <td className="p-4 text-gray-500">{product.brand}</td>
                                    <td className="p-4 text-right flex justify-end space-x-4">
                                        <button onClick={() => openEditModal(product)} className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 font-bold text-sm hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 uppercase italic tracking-tight">
                            {isEditing ? 'Edit Product' : 'Add New Inventory'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Product Name" required
                                value={productForm.name}
                                className="w-full border-2 p-3 focus:border-black outline-none"
                                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="text" placeholder="Brand" required
                                    value={productForm.brand}
                                    className="border-2 p-3 focus:border-black outline-none"
                                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                                />
                                <select
                                    value={productForm.category}
                                    className="border-2 p-3 focus:border-black outline-none bg-white"
                                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                >
                                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                            </div>
                            <input 
                                type="number" placeholder="Price" required
                                value={productForm.price}
                                className="w-full border-2 p-3 focus:border-black outline-none"
                                onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                            />
                            <input 
                                type="text" placeholder="Image URL"
                                value={productForm.image_url}
                                className="w-full border-2 p-3 focus:border-black outline-none"
                                onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                            />
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 font-bold uppercase text-xs border-2">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-black text-white font-bold uppercase text-xs">
                                    {isEditing ? 'Update Shoe' : 'Save to Database'}
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