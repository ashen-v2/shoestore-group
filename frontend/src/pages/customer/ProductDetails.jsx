import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/common/Navbar';
import { useWishlist } from '../../context/WishlistContext';
import ProductReviews from '../../components/products/ProductReviews';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    

    const [product, setProduct] = useState(null);
    const [stock, setStock] = useState([]);
    const [selectedStockId, setSelectedStockId] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProductAndStock = async () => {
            try {
                const productRes = await api.get(`/products/${id}`);
                setProduct(productRes.data);
                // Set the initial main image
                setSelectedImage(productRes.data.image_url);

                const stockRes = await api.get(`/stocks/${id}`);
                setStock(stockRes.data);

                // Automatically select the first available size
                const firstAvailable = stockRes.data.find(item => item.quantity > 0);
                if (firstAvailable) {
                    setSelectedStockId(firstAvailable.id);
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndStock();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedStockId) {
            alert("Please select a size first!");
            return;
        }
        addToCart(selectedStockId);
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest">Product Not Found</div>;

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
     // 2. Check if this specific shoe is already favorited
    const isFavorite = isInWishlist(product.id);

    const handleWishlistToggle = (e) => {
        e.preventDefault(); // Prevents the user from being redirected to the product details page when clicking the heart
        
        if (isFavorite) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };


    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-2">

                    {/* Main Image Column */}
                    <div className="lg:col-span-7 flex items-center justify-center sticky top-24 h-fit">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-auto max-h-90 lg:max-h-115 object-contain rounded-2xl drop-shadow-xl"
                        />
                    </div>

                    {/* Product Info Column */}
                    <div className="lg:col-span-4 flex flex-col pt-4">
                        <div className="mb-8">
                            <h2 className="text-md font-bold text-gray-900 mb-1">{product.brand}</h2>
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-4">
                                {product.name}
                            </h1>
                            <p className="text-xl font-medium text-gray-900 mb-2">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-sm font-bold text-black">Select Size</h3>
                                <button className="text-sm font-bold text-gray-500 hover:text-black">Size Guide</button>
                            </div>

                            {stock.length === 0 ? (
                                <p className="text-red-500 font-bold text-sm">Currently Out of Stock</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {stock.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedStockId(item.id)}
                                            disabled={item.quantity <= 0}
                                            className={`py-3.5 border rounded-md text-sm font-medium transition-all
                                                ${item.quantity <= 0 ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed' :
                                                    selectedStockId === item.id ? 'border-black ring-1 ring-black text-black' : 'bg-white border-gray-300 text-black hover:border-black'}`}
                                        >
                                            US {item.size}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={stock.length === 0 || !selectedStockId}
                                className={`w-full py-4 rounded-full font-medium text-base transition-all active:scale-[0.98]
                                    ${(stock.length === 0 || !selectedStockId) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                            >
                                Add to Bag
                            </button>

                            <button
                                onClick={handleWishlistToggle}
                                className="w-full py-4 rounded-full font-medium text-base transition-all active:scale-[0.98] border border-gray-300 hover:border-black flex items-center justify-center gap-2 text-black bg-white"
                            >
                                Favorite
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-black'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="text-base text-gray-700 leading-relaxed mb-10">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-5 mt-4 space-y-1 text-sm font-medium">
                                <li>Shown: Custom / Default</li>
                                <li>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                            </ul>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-gray-200">

                            {/* Free Delivery and Returns */}
                            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex justify-between items-center font-bold text-lg text-black cursor-pointer list-none">
                                    Free Delivery and Returns
                                    <span className="transition duration-300 group-open:-rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                                    <p className="mb-4">Your order of $50 or more gets free standard delivery.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Standard delivered 4-5 Business Days</li>
                                        <li>Express delivered 2-4 Business Days</li>
                                    </ul>
                                    <p className="mt-4">Orders are processed and delivered Monday-Friday (excluding public holidays). Laced Members enjoy free returns within 60 days.</p>
                                </div>
                            </details>

                            {/* Reviews */}
                            <div className="py-2">
                                <ProductReviews productId={id} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;