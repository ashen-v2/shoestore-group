import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';
import AdminSidebar from '../../components/layout/AdminSidebar';

const AdminAnalytics = () => {
    const [chartData, setChartData] = useState([]);
    const [period, setPeriod] = useState('weekly'); // Default view
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    // 1. Fetch the Graph Data
    const fetchChartData = async (selectedPeriod) => {
        setLoading(true);
        try {
            // Hitting the endpoint your friend will make
            const response = await api.get(`/admin/analytics/sales-total/${selectedPeriod}`);
            setChartData(response.data);
        } catch (err) {
            console.error("Failed to fetch chart data", err);
            // Fallback mock data so you can see the graph while your friend builds the backend!
            setChartData([
                { label: 'Mon', revenue: 120 }, { label: 'Tue', revenue: 300 },
                { label: 'Wed', revenue: 150 }, { label: 'Thu', revenue: 400 },
                { label: 'Fri', revenue: 250 }, { label: 'Sat', revenue: 600 },
                { label: 'Sun', revenue: 450 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData(period);
    }, [period]);

    const handleDownloadCSV = () => {
        if (loading) {
            alert("Please wait for chart data to finish loading.");
            return;
        }

        // Don't download if the graph is empty or loading
        if (!chartData || chartData.length === 0) {
            alert("No data available to download.");
            return;
        }

        setDownloading(true);
        try {
            const periodLabelMap = {
                daily: 'Day',
                weekly: 'Week',
                monthly: 'Month'
            };
            const firstColumnHeader = periodLabelMap[period] || 'Period';
            const headers = [firstColumnHeader, 'Total Revenue ($)'];

            // Map existing graph data to create the rows
            const csvRows = chartData.map(row => {
                // Ensure revenue is formatted nicely
                const formattedRevenue = Number(row.revenue).toFixed(2);
                return `${row.label},${formattedRevenue}`;
            });

            // Join the headers and the rows together with line breaks (\n)
            const csvContent = [headers.join(","), ...csvRows].join("\n");

            // Create a "Blob" (Binary Large Object) to hold the file data in the browser
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

            // Create a temporary download link, click it, and destroy it
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            // Give the file a dynamic name with period + today's date
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute("href", url);
            link.setAttribute("download", `Laced_${period}_Sales_Report_${today}.csv`);

            document.body.appendChild(link);
            link.click(); // Automatically triggers the browser download
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Analytics</h1>
                            <p className="text-gray-500 font-medium mt-1">Sales performance and financial reports.</p>
                        </div>
                        
                        {/* Download Report Button */}
                        <button 
                            onClick={handleDownloadCSV}
                            disabled={downloading}
                            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest shadow-lg transition-all flex items-center gap-2 ${
                                downloading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            {downloading ? 'Generating...' : 'Download CSV Report'}
                        </button>
                    </div>

                    {/* Chart Container */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">Revenue Overview</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Completed orders by timeframe</p>
                            </div>
                            
                            {/* Timeframe Selector */}
                            <select 
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="p-2 border-2 border-gray-200 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        {/* Recharts Bar Graph */}
                        <div className="h-[400px] w-full mt-4">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-gray-400 font-black uppercase tracking-widest text-sm">
                                    Loading Chart Data...
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="label" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9ca3af' }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9ca3af' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f9fafb' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                                        />
                                        <Bar dataKey="revenue" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;