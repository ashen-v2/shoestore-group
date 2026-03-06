import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    // Calculate the subtotal by reaching into the nested product data
    const subtotal = cartItems.reduce((total, item) => {
        // We assume the backend will send item.stock.product.price
        const price = item.stock?.product?.price || 0;
        return total + (price * item.quantity);
    }, 0);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-black mb-8">
                    Your Bag
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-12 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">Your bag is empty.</p>
                        <Link to="/" className="bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 flex gap-6 border border-gray-100 shadow-sm relative group">
                                    
                                    {/* Product Image */}
                                    <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                                        <img 
                                            src={item.stock?.product?.image_url} 
                                            alt={item.stock?.product?.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black uppercase tracking-tight text-black">
                                                    {item.stock?.product?.name}
                                                </h3>
                                                <p className="text-lg font-black italic text-black">
                                                    ${item.stock?.product?.price}
                                                </p>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                {item.stock?.product?.brand}
                                            </p>
                                            <p className="text-xs font-bold text-gray-500 mt-2">
                                                Size: US {item.stock?.size}
                                            </p>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-200">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 font-bold hover:bg-gray-50 text-gray-600"
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <span className="px-4 py-1 font-black text-sm">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 font-bold hover:bg-gray-50 text-gray-600"
                                                >+</button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 border border-gray-100 shadow-sm sticky top-24">
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-black mb-6">Summary</h2>
                                
                                <div className="space-y-4 text-sm font-bold text-gray-600 border-b border-gray-100 pb-6 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-black font-black">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Delivery</span>
                                        <span className="text-black font-black">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes</span>
                                        <span className="text-black font-black">Calculated at Checkout</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-black uppercase tracking-tight">Total</span>
                                    <span className="text-2xl font-black italic text-black">${subtotal.toFixed(2)}</span>
                                </div>

                                <button className="w-full bg-black text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-gray-800 shadow-lg active:scale-95 transition-all">
                                    Checkout Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;