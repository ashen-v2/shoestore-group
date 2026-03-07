import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null); // Tracks which order is currently saving

    const fetchAllOrders = async () => {
        try {
            const response = await api.get('/orders/'); //should be changed to /orders/all later
            
            // Sort so the newest orders are at the top
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
            // Send the update to the backend
            const payload = { [field]: newValue };
            await api.patch(`/orders/${orderId}`, payload);
            
            // Update the UI instantly without needing a page refresh!
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

    // 2. Error State (With Sidebar)
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
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">Order Management</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Update fulfillment and payment statuses</p>
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
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-black">#{order.id.toString().padStart(6, '0')}</td>
                                            <td className="p-4 text-xs text-gray-500">{formatDate(order.created_at)}</td>
                                            <td className="p-4">User {order.user_id}</td>
                                            <td className="p-4 font-black italic">${order.total_price.toFixed(2)}</td>
                                            
                                            {/* Payment Status Dropdown */}
                                            <td className="p-4">
                                                <select 
                                                    value={order.payment_status}
                                                    onChange={(e) => handleStatusChange(order.id, 'payment_status', e.target.value)}
                                                    disabled={updatingId === order.id}
                                                    className={`p-2 border-2 text-xs font-bold uppercase tracking-widest outline-none transition-all cursor-pointer ${
                                                        order.payment_status.toLowerCase() === 'paid' ? 'border-green-400 bg-green-50 text-green-700' : 
                                                        'border-yellow-400 bg-yellow-50 text-yellow-700'
                                                    } ${updatingId === order.id ? 'opacity-50' : ''}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="refunded">Refunded</option>
                                                </select>
                                            </td>

                                            {/* Delivery Status Dropdown */}
                                            <td className="p-4">
                                                <select 
                                                    value={order.delivery_status}
                                                    onChange={(e) => handleStatusChange(order.id, 'delivery_status', e.target.value)}
                                                    disabled={updatingId === order.id}
                                                    className={`p-2 border-2 text-xs font-bold uppercase tracking-widest outline-none transition-all cursor-pointer ${
                                                        order.delivery_status.toLowerCase() === 'delivered' ? 'border-green-400 bg-green-50 text-green-700' : 
                                                        order.delivery_status.toLowerCase() === 'shipped' ? 'border-blue-400 bg-blue-50 text-blue-700' :
                                                        'border-gray-300 bg-white text-gray-700'
                                                    } ${updatingId === order.id ? 'opacity-50' : ''}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;