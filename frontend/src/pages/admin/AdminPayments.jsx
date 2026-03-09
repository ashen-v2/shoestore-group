import { useState, useEffect, use } from "react";
import api from "../../api/axiosConfig";
import AdminSidebar from "../../components/layout/AdminSidebar";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPayments = async () => {
        try {
            const response = await api.get('/admin/payments/');

            const sortedPayments = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setPayments(sortedPayments);
        } catch (err) {
            console.error("Failed to fetch payments", err);
            setError('Failed to load the payment ledger.Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // const handleDeletePayment = async (paymentId) => {
    //     if (window.confirm("Warning: Are you sure you want to delete this payment record? This will permanently alter the financial ledger.")) {
    //         try {
    //             // Hiting the specific payment delete endpoint
    //             await api.delete(`/admin/payments/${paymentId}`);

    //             // Instantly remove it from the screen without reloading
    //             setPayments(payments.filter(payment => payment.id !== paymentId));
    //         } catch (err) {
    //             console.error("Failed to delete payment", err);
    //             alert('Failed to delete the payment record. Please try again later.');
    //         }
    //     }
    // };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatMethod = (method) => {
        return method.split('_').join(' ').toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="font-black uppercase tracking-widest text-gray-400">Loading Payment Ledger...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="bg-red-50 p-6 border-l-4 border-red-500 text-red-600 font-bold uppercase tracking-widest text-sm">{error}</p>
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
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Payments</h1>
                        <p className="text-gray-500 font-medium">Monitor all incoming revenue and transaction statuses.</p>
                    </div>

                    <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">Transaction Ledger</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Financial overview of all orders</p>
                        </div>

                        {payments.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No transactions found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-y border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            <th className="p-4">Payment ID</th>
                                            <th className="p-4">Order Ref</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Method</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Transaction ID</th>
                                            {/* <th className="p-4">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium divide-y divide-gray-100">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-black text-gray-400">#{payment.id.toString().padStart(6, '0')}</td>
                                                <td className="p-4 font-black text-black">Order #{payment.order_id}</td>
                                                <td className="p-4 text-xs text-gray-500">{formatDate(payment.created_at)}</td>

                                                <td className="p-4">
                                                    <span className=" whitespace-nowrap text-[10px] font-black tracking-widest uppercase bg-gray-100 px-2 py-1 rounded">
                                                        {formatMethod(payment.method)}
                                                    </span>
                                                </td>

                                                <td className="p-4 font-black italic text-black">${payment.amount.toFixed(2)}</td>

                                                <td className="p-4">
                                                    <span className={` whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${payment.status === 'completed' ? 'border-green-400 bg-green-50 text-green-700' :
                                                            payment.status === 'cod_pending' ? 'border-orange-400 bg-orange-50 text-orange-700' :
                                                                payment.status === 'failed' ? 'border-red-400 bg-red-50 text-red-700' :
                                                                    'border-yellow-400 bg-yellow-50 text-yellow-700'
                                                        }`}>
                                                        {payment.status.replace('_', ' ')}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-xs text-gray-400 font-mono">
                                                    {payment.transaction_id ? payment.transaction_id : 'N/A'}
                                                </td>

                                                {/* <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeletePayment(payment.id)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-red-500 border-b-2 border-red-500 hover:text-red-700 hover:border-red-700 transition-all pb-1"
                                                    >
                                                        Delete
                                                    </button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;

