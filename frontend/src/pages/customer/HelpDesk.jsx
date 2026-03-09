import { useState, useEffect } from "react";
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const HelpDesk = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [subject, setSubject] = useState('Delivery Issue');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            // Fetching the user's tickets
            const response = await api.get('/issuetickets/');
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        if (!orderId) {
            alert("Please provide an Order ID.");
            return;
        }

        setSubmitting(true);
        try {
            // Posting a new ticket to the specific order_id path variable
            await api.post(`/issuetickets/${orderId}`, {
                subject: subject,
                description: description
            });

            // refresh the list and close the form
            await fetchTickets();
            setIsCreating(false);
            setOrderId('');
            setDescription('');
            setSubject('Delivery Issue');
        } catch (error) {
            console.error("Failed to submit ticket:", error);
            alert(" Failed to submit your ticket. Please ensure the Order ID is valid and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-32 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Help Desk...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Help Desk</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your complaints, returns, and feedback.</p>
                    </div>
                    
                    {!isCreating && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="bg-black text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Open New Ticket
                        </button>
                    )}
                </div>

                {/* NEW TICKET FORM */}
                {isCreating && (
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-10 animate-fade-in-down">
                        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">Create Support Ticket</h2>
                        <form onSubmit={handleSubmitTicket}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order ID *</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="e.g. 104"
                                        className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject *</label>
                                    <select 
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black transition-colors"
                                    >
                                        <option value="Delivery Issue">Delivery Issue</option>
                                        <option value="Return Request">Return Request</option>
                                        <option value="Product Defect">Product Defect</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description *</label>
                                <textarea 
                                    required
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please describe the issue in detail..."
                                    className="p-4 border-2 border-gray-200 text-sm font-medium w-full outline-none focus:border-black transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="bg-black text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreating(false)}
                                    className="px-6 py-3 font-black uppercase text-xs tracking-widest text-gray-500 hover:text-black transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TICKET HISTORY */}
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-gray-400 mb-6">Your Tickets</h2>
                    {tickets.length === 0 ? (
                        <div className="bg-white p-10 text-center rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">You have no support tickets.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                                ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                                                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-sm font-black text-black">{ticket.subject}</span>
                                        </div>
                                        <p className="text-gray-600 font-medium text-sm mb-2">{ticket.description}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Order #{ticket.order_id} • Created: {new Date(ticket.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpDesk;