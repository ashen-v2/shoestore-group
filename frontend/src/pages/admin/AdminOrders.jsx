import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null); 
    
    // States for the View Items Modal
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null);

    const fetchAllOrders = async () => {
        try {
            const response = await api.get('/admin/orders/');
            const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedOrders);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError('Failed to load orders. Are you sure you are logged in as an Admin?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Handle updating the status
    const handleStatusChange = async (orderId, field, newValue) => {
        setUpdatingId(orderId);
        try {
            const payload = { [field]: newValue };
            await api.patch(`/admin/orders/${orderId}`, payload);

            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, [field]: newValue } : order
            ));
        } catch (err) {
            console.error("Failed to update order", err);
            alert('Failed to update the order status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleViewItems = async (orderId) => {
        setActiveOrderId(orderId);
        setItemsLoading(true);
        setShowItemsModal(true);
        
        try {
            const response = await api.get(`/admin/orders/${orderId}`);
            setSelectedOrderItems(response.data); 
        } catch (err) {
            console.error("Failed to fetch order items", err);
            alert("Could not load the items for this order.");
            setShowItemsModal(false);
        } finally {
            setItemsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="font-black uppercase tracking-widest text-gray-400">Loading Orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-red-50 p-6 border-l-4 border-red-500 text-red-600 font-bold uppercase tracking-widest text-sm">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8 overflow-y-auto relative">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Orders</h1>
                        <p className="text-gray-500 font-medium">Update fulfillment and payment statuses.</p>
                    </div>

                    <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">Order Management</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Admin controls for payment and delivery state</p>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No orders found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-y border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Customer ID</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Payment Status</th>
                                            <th className="p-4">Delivery Status</th>
                                            <th className="p-4 text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-black">#{order.id.toString().padStart(6, '0')}</td>
                                                <td className="p-4 text-xs text-gray-500">{formatDate(order.created_at)}</td>
                                                <td className="p-4">User {order.user_id}</td>
                                                <td className="p-4 font-black italic">${order.total_price.toFixed(2)}</td>

                                                {/* EXACT BACKEND PAYMENT ENUMS */}
                                                <td className="p-4">
                                                    <select
                                                        value={order.payment_status}
                                                        onChange={(e) => handleStatusChange(order.id, 'payment_status', e.target.value)}
                                                        disabled={updatingId === order.id}
                                                        className={`p-2 border-2 text-xs font-bold uppercase tracking-widest outline-none transition-all cursor-pointer ${
                                                            order.payment_status === 'completed' ? 'border-green-400 bg-green-50 text-green-700' :
                                                            order.payment_status === 'cod_pending' ? 'border-orange-400 bg-orange-50 text-orange-700' :
                                                            order.payment_status === 'failed' ? 'border-red-400 bg-red-50 text-red-700' :
                                                            'border-yellow-400 bg-yellow-50 text-yellow-700'
                                                        } ${updatingId === order.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="cod_pending">COD Pending</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="failed">Failed</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </td>

                                                {/* EXACT BACKEND DELIVERY ENUMS */}
                                                <td className="p-4">
                                                    <select
                                                        value={order.delivery_status}
                                                        onChange={(e) => handleStatusChange(order.id, 'delivery_status', e.target.value)}
                                                        disabled={updatingId === order.id}
                                                        className={`p-2 border-2 text-xs font-bold uppercase tracking-widest outline-none transition-all cursor-pointer ${
                                                            order.delivery_status === 'delivered' ? 'border-green-400 bg-green-50 text-green-700' :
                                                            order.delivery_status === 'shipped' ? 'border-blue-400 bg-blue-50 text-blue-700' :
                                                            order.delivery_status === 'cancelled' ? 'border-red-400 bg-red-50 text-red-700' :
                                                            'border-gray-300 bg-white text-gray-700'
                                                        } ${updatingId === order.id ? 'opacity-50' : ''}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleViewItems(order.id)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black hover:text-gray-500 hover:border-gray-500 transition-all pb-1"
                                                    >
                                                        View Items
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* BEATUIFUL ITEMS MODAL */}
                {showItemsModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-8 max-w-2xl w-full shadow-2xl rounded-2xl max-h-[80vh] flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-black">
                                        Order #{activeOrderId?.toString().padStart(6, '0')}
                                    </h2>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                                        Purchased Items
                                    </p>
                                </div>
                                <button onClick={() => setShowItemsModal(false)} className="text-gray-400 hover:text-black font-black text-xl">&times;</button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {itemsLoading ? (
                                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-sm py-10">Loading Items...</p>
                                ) : selectedOrderItems.length === 0 ? (
                                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-sm py-10">No items found.</p>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 uppercase text-[10px] font-black text-gray-500 tracking-widest border-b border-gray-100">
                                            <tr>
                                                <th className="p-4">Item Ref</th>
                                                <th className="p-4">Stock ID</th>
                                                <th className="p-4">Quantity</th>
                                                <th className="p-4 text-right">Price Locked</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm font-medium">
                                            {selectedOrderItems.map(item => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 font-bold text-gray-400">#{item.id}</td>
                                                    <td className="p-4 text-black">Stock #{item.stock_id}</td>
                                                    <td className="p-4 text-black">{item.quantity} units</td>
                                                    <td className="p-4 text-right font-black italic">${item.price_locked.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => setShowItemsModal(false)}
                                    className="bg-black text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 shadow-lg active:scale-95 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;