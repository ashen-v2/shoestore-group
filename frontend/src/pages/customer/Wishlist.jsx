import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/common/Navbar';

const Wishlist = () => {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <p className="font-black uppercase tracking-widest text-gray-400">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="mb-10 border-b border-gray-200 pb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">Your Favorites</h1>
                    <p className="text-gray-500 font-medium mt-1">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 p-16 text-center rounded-2xl flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Nothing here yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md">You haven't saved any items to your wishlist. Explore our collection and tap the heart icon to save your favorites.</p>
                        <Link 
                            to="/products" 
                            className="bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlist.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
                                
                                {/* Remove from Wishlist Button (Uses the DELETE endpoint) */}
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                                    title="Remove from wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                </button>

                                <Link to={`/products/${item.id}`} className="block overflow-hidden rounded-lg mb-4 bg-gray-50">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.name} 
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                                    />
                                </Link>
                                
                                <div className="flex-1">
                                    <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">{item.brand}</p>
                                    <Link to={`/products/${item.id}`}>
                                        <h3 className="font-bold text-lg leading-tight mb-2 hover:text-gray-600 transition-colors">{item.name}</h3>
                                    </Link>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="font-black italic text-lg">${item.price.toFixed(2)}</span>
                                    <button 
                                        onClick={() => navigate(`/products/${item.id}`)}
                                        className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
                                    >
                                        view product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;