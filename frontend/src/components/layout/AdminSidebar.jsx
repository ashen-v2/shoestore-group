import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-black h-screen sticky top-0 flex flex-col text-white p-6 shadow-xl">
            {/* Admin Branding */}
            <div className="mb-10">
                <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic border-b border-gray-800 pb-4 block">
                    Laced <span className="text-gray-500 font-normal">Admin</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-4 font-bold uppercase text-xs tracking-widest">
                <Link to="/admin" className="block p-3 bg-gray-900 rounded-md hover:bg-gray-800 transition-colors">
                    Dashboard
                </Link>
                <Link to="/admin/inventory" className="block p-3 hover:bg-gray-900 rounded-md transition-colors">
                    Inventory
                </Link>
                <Link to="/admin/reports" className="block p-3 hover:bg-gray-900 rounded-md transition-colors">
                    Sales Reports
                </Link>
                <Link to="/" className="block p-3 text-gray-400 hover:text-white transition-colors border-t border-gray-800 pt-6">
                    View Website
                </Link>
            </nav>

            {/* Logout*/}
            <button 
                onClick={handleLogout}
                className="mt-auto p-3 text-left text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all font-bold uppercase text-[10px]"
            >
                Logout Account
            </button>
        </div>
    );
};

export default AdminSidebar;