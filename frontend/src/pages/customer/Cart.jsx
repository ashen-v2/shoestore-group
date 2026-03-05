import { useCart } from '../../context/CartContext';
import Navbar from '../../components/common/Navbar';

const Cart = () => {
    const { cartItems, removeFromCart, totalPrice } = useCart();

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Your Bag</h1>
                
                {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your bag is empty. Start adding some heat!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="md:col-span-2 space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex border-b pb-6">
                                    <img src={item.image_url} alt={item.name} className="w-32 h-32 object-cover bg-gray-100" />
                                    <div className="ml-6 flex-1">
                                        <div className="flex justify-between font-bold">
                                            <h3>{item.name}</h3>
                                            <p>${item.price}</p>
                                        </div>
                                        <p className="text-gray-500 text-sm">{item.brand}</p>
                                        <p className="text-sm mt-2">Quantity: {item.quantity}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-sm underline mt-4 text-gray-500 hover:text-black"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="bg-gray-50 p-6 h-fit">
                            <h2 className="text-xl font-bold uppercase mb-4">Summary</h2>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span>Delivery</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-black text-lg">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="w-full bg-black text-white font-bold uppercase py-4 mt-6 hover:bg-gray-800 tracking-widest">
                                Member Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;