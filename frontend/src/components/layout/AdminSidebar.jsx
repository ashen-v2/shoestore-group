import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Gets the current URL path

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper function to check if a link is active
    const isActive = (path) => {
        // Exact match for dashboard, partial match for sub-routes
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
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
                <Link 
                    to="/admin" 
                    className={`block p-3 rounded-md transition-colors ${isActive('/admin') ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:bg-gray-900'}`}
                >
                    Dashboard
                </Link>
                
                <Link 
                    to="/admin/orders" 
                    className={`block p-3 rounded-md transition-colors ${isActive('/admin/orders') ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:bg-gray-900'}`}
                >
                    Orders
                </Link>
                
                <Link 
                    to="/admin/reports" 
                    className={`block p-3 rounded-md transition-colors ${isActive('/admin/reports') ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:bg-gray-900'}`}
                >
                    Sales Reports
                </Link>
                
                <Link 
                    to="/" 
                    className="block p-3 text-gray-400 hover:text-white transition-colors border-t border-gray-800 pt-6 mt-4"
                >
                    View Website
                </Link>
            </nav>

            {/* Logout */}
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