import Navbar from '../../components/common/Navbar';

const Orders = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-8">
                    Order History
                </h1>
                <div className="bg-white p-10 shadow-sm border border-gray-100 rounded-xl text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                        You haven't placed any orders yet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Orders;