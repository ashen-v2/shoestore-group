import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const ModeratorDashboard = () => {
    const [activeTab, setActiveTab] = useState('tickets'); 

    // --- HELP DESK STATE ---
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    // --- INVENTORY STATE ---
    const [products, setProducts] = useState([]);
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [newStock, setNewStock] = useState({ productId: '', size: '', quantity: '' });

    // ==========================================
    //  HELP DESK LOGIC
    // ==========================================
    const fetchAllTickets = async () => {
        try {
            const response = await api.get('/issuetickets/mod');
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch all tickets:", error);
        } finally {
            setLoadingTickets(false);
        }
    };

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

    // ==========================================
    //  INVENTORY LOGIC
    // ==========================================
    const fetchInventory = async () => {
        setLoadingInventory(true);
        try {
            // Fetch all products
            const prodRes = await api.get('/products/');
            const productsData = prodRes.data;

            // Fetch stocks for EACH product using the specific GET endpoint
            const productsWithStocks = await Promise.all(
                productsData.map(async (product) => {
                    try {
                        const stockRes = await api.get(`/stocks/${product.id}`);
                        return { ...product, stocks: stockRes.data };
                    } catch (err) {
                        return { ...product, stocks: [] }; // Return empty array if no stock found
                    }
                })
            );
            
            setProducts(productsWithStocks);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setLoadingInventory(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'tickets') fetchAllTickets();
        if (activeTab === 'inventory') fetchInventory();
    }, [activeTab]);

    // Create Stock [POST /stocks/{product_id}]
    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/stocks/${newStock.productId}`, {
                size: parseInt(newStock.size),      // ENFORCED AS INTEGER
                quantity: parseInt(newStock.quantity) // ENFORCED AS INTEGER
            });
            alert("Stock added successfully!");
            setNewStock({ productId: '', size: '', quantity: '' });
            fetchInventory(); 
        } catch (error) {
            console.error("Failed to add stock:", error);
            if (error.response?.status === 422) {
                console.log(error.response.data.detail);
            }
            alert("Could not add stock. Check console for 422 errors.");
        }
    };

    // Update Stock [PATCH /stocks/{stock_id}]
    const handleUpdateStockQty = async (stockId, currentSize, currentQty) => {
        const newQty = prompt(`Enter new quantity for size ${currentSize}:`, currentQty);
        
        if (newQty !== null && newQty !== "") {
            try {
                await api.patch(`/stocks/${stockId}`, {
                    size: parseInt(currentSize),   // REQUIRED BY Pydantic Schema
                    quantity: parseInt(newQty)     // REQUIRED BY Pydantic Schema
                });
                fetchInventory(); 
            } catch (error) {
                alert("Failed to update quantity.");
            }
        }
    };

    // Delete Stock [DELETE /stocks/{stock_id}]
    const handleDeleteStock = async (stockId) => {
        if (window.confirm("Remove this stock variant entirely?")) {
            try {
                await api.delete(`/stocks/${stockId}`);
                fetchInventory(); 
            } catch (error) {
                alert("Failed to delete stock.");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 pt-12">
                <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Moderator Dashboard</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage operations and inventory.</p>
                    </div>
                    
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('tickets')}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${activeTab === 'tickets' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                        >
                            Help Desk
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${activeTab === 'inventory' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                        >
                            Inventory
                        </button>
                    </div>
                </div>

                {/* --- TAB CONTENT: HELP DESK --- */}
                {activeTab === 'tickets' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-down">
                        {loadingTickets ? (
                            <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Tickets...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">User / Order</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm font-bold text-gray-500">#{ticket.id}</td>
                                            <td className="p-4">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User: {ticket.user_id}</p>
                                                <p className="text-sm font-bold text-black">Order: #{ticket.order_id}</p>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-black">{ticket.subject}</td>
                                            <td className="p-4">
                                                <select 
                                                    value={ticket.status}
                                                    onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                                    className="text-xs font-black uppercase tracking-widest p-2 rounded-md border outline-none cursor-pointer"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In-Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeleteTicket(ticket.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* --- TAB CONTENT: INVENTORY --- */}
                {activeTab === 'inventory' && (
                    <div className="space-y-8 animate-fade-in-down">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black uppercase tracking-tighter text-black mb-4">Add New Stock</h2>
                            <form onSubmit={handleAddStock} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product ID</label>
                                    <input type="number" required value={newStock.productId} onChange={e => setNewStock({...newStock, productId: e.target.value})} className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black" placeholder="e.g., 5" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Size (Number)</label>
                                    {/* Changed to type="number" to enforce integer input */}
                                    <input type="number" required value={newStock.size} onChange={e => setNewStock({...newStock, size: e.target.value})} className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black" placeholder="e.g., 10" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                                    <input type="number" required value={newStock.quantity} onChange={e => setNewStock({...newStock, quantity: e.target.value})} className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black" placeholder="e.g., 50" />
                                </div>
                                <button type="submit" className="bg-black text-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-gray-800 w-full md:w-auto">Add Stock</button>
                            </form>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {loadingInventory ? (
                                <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Inventory...</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                            <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Current Stock Variants</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="p-4 w-1/3 border-r border-gray-100">
                                                    <p className="text-sm font-bold text-black">{product.name}</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product ID: {product.id}</p>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.stocks && product.stocks.length > 0 ? (
                                                            product.stocks.map(stock => (
                                                                <div key={stock.id} className="bg-gray-100 border border-gray-200 rounded-md p-2 flex items-center gap-3">
                                                                    <span className="text-xs font-bold">Size: {stock.size}</span>
                                                                    <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Qty: {stock.quantity}</span>
                                                                    <button onClick={() => handleUpdateStockQty(stock.id, stock.size, stock.quantity)} className="text-[10px] text-gray-500 hover:text-black font-bold uppercase tracking-widest">Edit</button>
                                                                    <button onClick={() => handleDeleteStock(stock.id)} className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-widest">Drop</button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No stock added yet.</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModeratorDashboard;