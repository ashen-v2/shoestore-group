import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="group cursor-pointer bg-white transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-[#F6F6F6] mb-4">
                <img 
                    src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'} 
                    alt={product.name}
                    className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Hover Action */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents navigating to details if add a detail page later
                            addToCart(product);
                        }}
                        className="w-full bg-black text-white text-xs font-bold uppercase py-3 hover:bg-gray-800"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-bold text-black">{product.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                <p className="text-sm font-black text-black mt-1">${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;