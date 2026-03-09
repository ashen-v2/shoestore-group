import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // fetch the logged-in user's orders
                const response = await api.get('/orders/');

                const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) -new Date(a.created_at));
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError('Cloud not load your order history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Helper function to format date strings
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper fuction for status pill colors
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': 
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-black">
                            Order History
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
                            View and track your recent purchases
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-black uppercase tracking-widest text-gray-400">Loading Orders...</div>
                ) : error ? (
                    <div className="bg-red-50 p-6 border-l-4 border-red-500 text-red-600 font-bold uppercase tracking-widest text-sm text-center">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-16 text-center border border-gray-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">You haven't placed any orders yet.</p>
                        <Link to="/" className="inline-block bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group">
                                {/* Order Header */}
                                <div className="bg-[#fcfcfc] border-b border-gray-100 p-6 flex flex-wrap flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Number</p>
                                            <p className="font-bold text-black text-sm">#{order.id.toString().padStart(6, '0')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date Placed</p>
                                            <p className="font-bold text-black text-sm">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
                                            <p className="font-black italic text-black text-sm">${order.total_price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-transparent hover:border-black transition-all pb-1">
                                        View Details
                                    </button>
                                </div>

                                {/* Order Status Body */}
                                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-24">Delivery:</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.delivery_status)}`}>
                                                {order.delivery_status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-24">Payment:</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expected Delivery Logic */}
                                    <div className="text-right sm:text-left sm:ml-auto bg-gray-50 p-4 border border-gray-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Updates</p>
                                        <p className="font-bold text-sm text-black">
                                            {order.delivery_status === 'pending' ? 'Preparing to ship' : 
                                             order.delivery_status === 'shipped' ? 'On the way' : 'Delivered'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;