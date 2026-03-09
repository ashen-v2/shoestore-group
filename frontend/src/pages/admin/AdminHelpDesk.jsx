import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminHelpDesk = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllTickets = async () => {
        try {
            // Using the same mod endpoint that the Admin also has access to
            const response = await api.get('/issuetickets/mod');
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch all tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTickets();
    }, []);

    const handleStatusUpdate = async (ticketId, newStatus) => {
        try {
            await api.patch(`/issuetickets/mod/${ticketId}`, { status: newStatus });
            setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        } catch (error) {
            if (error.response?.status === 422) {
                console.log("FASTAPI ERROR DETAILS:", error.response.data.detail);
                alert(`Backend rejected the status "${newStatus}". Check console for details.`);
            } else {
                alert("Could not update the ticket status.");
            }
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm("Delete this ticket permanently?")) {
            try {
                await api.delete(`/issuetickets/mod/${ticketId}`);
                setTickets(tickets.filter(t => t.id !== ticketId));
            } catch (error) {
                alert("Could not delete the ticket.");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Admin Sidebar Layout */}
            <AdminSidebar />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10 border-b border-gray-200 pb-6">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Support Tickets</h1>
                        <p className="text-gray-500 font-medium mt-1">Review and manage customer issue tickets.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Tickets...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">User / Order</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tickets.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                                No active tickets found.
                                            </td>
                                        </tr>
                                    ) : (
                                        tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-sm font-bold text-gray-500">#{ticket.id}</td>
                                                <td className="p-4">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User: {ticket.user_id}</p>
                                                    <p className="text-sm font-bold text-black">Order: #{ticket.order_id}</p>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-black">{ticket.subject}</td>
                                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={ticket.description}>
                                                    {ticket.description}
                                                </td>
                                                <td className="p-4">
                                                    <select 
                                                        value={ticket.status}
                                                        onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                                        className={`text-xs font-black uppercase tracking-widest p-2 rounded-md border outline-none cursor-pointer transition-colors ${
                                                            ticket.status === 'open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            ticket.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="in_progress">In-Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteTicket(ticket.id)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHelpDesk;