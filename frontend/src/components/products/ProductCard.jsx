import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    // 1. Pull in the wishlist context functions
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    // 2. Check if this specific shoe is already favorited
    const isFavorite = isInWishlist(product.id);

    // 3. Handle the heart click without triggering the product link
    const handleWishlistToggle = (e) => {
        e.preventDefault(); // Prevents the user from being redirected to the product details page when clicking the heart
        
        if (isFavorite) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };

    return (
        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all group relative flex flex-col">
            
            {/* THE WISHLIST HEART BUTTON */}
            <button 
                onClick={handleWishlistToggle}
                className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
                {isFavorite ? (
                    // Solid Red Heart (Favorited)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                ) : (
                    // Outlined Heart (Not Favorited)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                )}
            </button>

            {/* Product Image & Details wrapping link */}
            <Link to={`/products/${product.id}`} className="block flex-1">
                <div className="overflow-hidden rounded-lg mb-4 bg-gray-50 relative">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                    />
                </div>
                
                <div>
                    <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">{product.brand || 'Brand'}</p>
                    <h3 className="font-bold text-lg leading-tight mb-2 text-black">{product.name}</h3>
                </div>
            </Link>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="font-black italic text-lg text-black">${product.price.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default ProductCard;