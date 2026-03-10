import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onSearch }) => {
    // Access cart items from context
    const { cartItems } = useCart();
    const { user, logout } = useAuth(); // Access user and logout from AuthContext


    const [isProfileOpen, setIsProfileOpen] = useState(false); // State for dropdown
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // state for mobile menu

    // Calculate total items (sum of quantities)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const closeMenus = () => {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-3 px-4 md:px-6 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Logo (Always Visible) */}
                <Link to="/" onClick={closeMenus} className="text-[28px] font-black tracking-tighter self-center">
                    Lac<span className="text-gray-300">ed</span>
                </Link>

                {/* Desktop Categories (Hidden on Mobile) */}
                <div className="hidden md:flex items-center space-x-8 text-[14px] font-bold text-black ml-8 font-sans">
                    <Link to="/category" className="hover:text-gray-500 transition-colors">Categories</Link>
                    <Link to="/" className="hover:text-gray-500 transition-colors">Deals</Link>
                    <Link to="/about" className="hover:text-gray-500 transition-colors">About Us</Link>
                </div>

                {/* Search (Always Visible) */}
                <div className="flex-1 max-w-lg mx-8 relative">
                    <input
                        type="text"
                        placeholder="Search Product"
                        className="w-full bg-[#f1f1f1] rounded-full py-2.5 px-6 text-sm outline-none focus:ring-1 focus:ring-gray-300 font-bold text-gray-800 placeholder-gray-400 font-sans"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                    <div className="absolute right-4 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    
                    {/* Cart (Always Visible, slightly adjusted padding for mobile) */}
                    <Link to="/cart" onClick={closeMenus} className="flex flex-col items-center justify-center relative hover:opacity-80 transition-opacity">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-5.5 md:h-5.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[#f5d547] text-black text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden md:block text-[11px] font-bold mt-1 text-black">Cart</span>
                    </Link>

                    {/* Favorites (Hidden on Mobile) */}
                    <Link to="/wishlist" className="hidden md:flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5.5 h-5.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="text-[11px] font-bold mt-1 text-black">Favorites</span>
                    </Link>

                    {/* Desktop Profile / Auth (Hidden on Mobile) */}
                    <div className="hidden md:block">
                        {user ? (
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-all"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <img
                                        src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=000000&color=fff&bold=true`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Desktop Profile Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-2 z-60 rounded-lg">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</p>
                                            <p className="text-xs font-bold truncate text-black">{user.email || user.username}</p>
                                        </div>

                                        <Link to="/profile" className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-black" onClick={closeMenus}>Profile Settings</Link>
                                        
                                        {user.role === 1 && (
                                            <>
                                                <Link to="/orders" className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-black" onClick={closeMenus}>Orders & Returns</Link>
                                                <Link to="/my-reviews" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100" onClick={closeMenus}>My Reviews</Link>
                                                <Link to="/helpdesk" className="block px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50" onClick={closeMenus}>Help Desk</Link>
                                            </>
                                        )}
                                        
                                        {user.role === 0 && (
                                            <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50" onClick={closeMenus}>Admin Dashboard</Link>
                                        )}

                                        <button
                                            onClick={() => { logout(); closeMenus(); }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50 border-t border-gray-50 mt-1"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 font-bold text-[12px] uppercase tracking-tight">
                                <Link to="/login" className="hover:text-gray-600">Login</Link>
                                <Link to="/register" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu Button (Only visible on Mobile) */}
                    <button 
                        className="md:hidden text-gray-800 p-2 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>

                </div>
            </div>

            
            {/* MOBILE DROPDOWN MENU (Only visible when hamburger clicked) */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[85vh]">

                    {/* Mobile Categories & Links */}
                    <div className="py-2 px-4 border-b border-gray-100 flex flex-col space-y-4">
                        <Link to="/category" className="text-sm font-black text-gray-800 tracking-wide" onClick={closeMenus}>Categories</Link>
                        <Link to="/" className="text-sm font-black text-gray-800 tracking-wide" onClick={closeMenus}>Deals</Link>
                        <Link to="/about" className="text-sm font-black text-gray-800 tracking-wide" onClick={closeMenus}>About Us</Link>
                        <Link to="/wishlist" className="text-sm font-black text-gray-800 tracking-wide flex items-center justify-between" onClick={closeMenus}>
                            Favorites
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile Auth & Profile */}
                    <div className="py-4 px-4 bg-gray-50">
                        {user ? (
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=000000&color=fff&bold=true`}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged In As</p>
                                        <p className="text-sm font-bold truncate text-black">{user.email || user.username}</p>
                                    </div>
                                </div>

                                <Link to="/profile" className="text-sm font-bold text-gray-600" onClick={closeMenus}>Profile Settings</Link>
                                
                                {user.role === 1 && (
                                    <>
                                        <Link to="/orders" className="text-sm font-bold text-gray-600" onClick={closeMenus}>Orders & Returns</Link>
                                        <Link to="/my-reviews" className="text-sm font-bold text-gray-600" onClick={closeMenus}>My Reviews</Link>
                                        <Link to="/helpdesk" className="text-sm font-bold text-blue-600" onClick={closeMenus}>Help Desk</Link>
                                    </>
                                )}
                                
                                {user.role === 0 && (
                                    <Link to="/admin" className="text-sm font-bold text-blue-600" onClick={closeMenus}>Admin Dashboard</Link>
                                )}

                                <button
                                    onClick={() => { logout(); closeMenus(); }}
                                    className="text-left text-sm font-bold text-red-600 pt-2 border-t border-gray-200 w-full"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <Link to="/login" className="text-center w-full py-3 bg-white border border-gray-200 text-sm font-black uppercase tracking-widest rounded-xl" onClick={closeMenus}>Login</Link>
                                <Link to="/register" className="text-center w-full py-3 bg-black text-white text-sm font-black uppercase tracking-widest rounded-xl" onClick={closeMenus}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;