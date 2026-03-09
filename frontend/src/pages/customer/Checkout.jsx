import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../api/stripeConfig';
import StripePaymentForm from './StripePaymentForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const Checkout = () => {
    const { user } = useAuth();
    const { cartItems, fetchCart } = useCart();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('COD'); // Default to Cash on Delivery
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const [clientSecret, setClientSecret] = useState(''); // For stripe payments

    // Calculate the subtotal amount for the order
    const subtotal = cartItems.reduce((total, item) => {
        const price = item.stock?.product?.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            setError('Your cart is empty!');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // Create the Order
            const orderPayload = {
                shipping_address: user.address
            };
            const orderResponse = await api.post('/orders/', orderPayload);
            const newOrderId = orderResponse.data.id; // Extract the new Order ID

            // Process the Payment using the new endpoint
            const paymentPayload = {
                payment_type: paymentMethod === 'COD' ? 'cash_on_delivery' : 'stripe'
            };

            // Call the new payment route!
            const paymentResponse = await api.post(`/payments/${newOrderId}`, paymentPayload);

            // Handle the Stripe Secret
            if (paymentMethod === 'Stripe') {
                const clientSecret = paymentResponse.data.client_secret;
                setClientSecret(paymentResponse.data.client_secret);
                // secret to open the Stripe UI in the next phase!
                console.log("Stripe Client Secret received:", clientSecret);
            }

            // Clean up and Redirect (For COD, this happens instantly)
            if (paymentMethod === 'COD') {
                await fetchCart(); // Clear the cart
                navigate('/orders'); // Send them to the success page
            }

        } catch (err) {
            console.error("Checkout Error:", err);

            // Catch FastAPI's specific 422 Array format to prevent React crashes
            if (err.response?.status === 422 && Array.isArray(err.response.data.detail)) {
                const errorDetails = err.response.data.detail[0];
                const fieldName = errorDetails.loc[errorDetails.loc.length - 1]; // Gets the field name
                setError(`Backend Validation Error: The field '${fieldName}' ${errorDetails.msg}`);
            }
            // Handle normal string errors
            else {
                setError(typeof err.response?.data?.detail === 'string'
                    ? err.response.data.detail
                    : 'Failed to process checkout. Please try again.');

                setError(err.response?.data?.detail || 'Failed to process checkout. Please try again.');
                setIsProcessing(false);
            }
        };

    };

    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-[60vh] font-black uppercase tracking-widest text-gray-400">
                    Your cart is empty.
                </div>
            </div>
        );
    }

    if (clientSecret) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                <Navbar />
                <div className="max-w-xl mx-auto px-6 py-12">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripePaymentForm />
                    </Elements>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-black mb-8">
                    Checkout
                </h1>

                {error && (
                    <div className="mb-6 bg-red-50 p-4 border-l-4 border-red-500 text-red-600 font-bold text-sm uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: Shipping & Payment Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Shipping Address Section */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">1. Delivery Address</h2>
                            <div className="bg-gray-50 p-4 border border-gray-200">
                                <p className="font-bold text-black mb-1">{user?.name}</p>
                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                    {user?.address ? user.address : 'No address saved in profile! Please update your settings.'}
                                </p>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">2. Payment Method</h2>

                            <div className="space-y-4">
                                {/* Stripe Option */}
                                <label className={`flex items-center p-4 border-2 cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-black bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Stripe"
                                        checked={paymentMethod === 'Stripe'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black accent-black"
                                    />
                                    <span className="ml-3 font-bold text-sm uppercase tracking-widest">Credit/Debit Card (Stripe)</span>
                                </label>

                                {/* COD Option */}
                                <label className={`flex items-center p-4 border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-black bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black focus:ring-black accent-black"
                                    />
                                    <span className="ml-3 font-bold text-sm uppercase tracking-widest">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black mb-6">In Your Bag</h2>

                            {/* Miniature Item List */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 border-b border-gray-100 pb-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.stock?.product?.image_url} alt="shoe" className="w-16 h-16 object-cover bg-gray-50" />
                                        <div>
                                            <p className="text-xs font-black uppercase text-black line-clamp-1">{item.stock?.product?.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1">Size: {item.stock?.size} | Qty: {item.quantity}</p>
                                            <p className="text-xs font-bold mt-1">${(item.stock?.product?.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 text-sm font-bold text-gray-600 border-b border-gray-100 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-black font-black">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-black font-black">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-black uppercase tracking-tight">Total</span>
                                <span className="text-2xl font-black italic text-black">${subtotal.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || !user?.address}
                                className={`w-full py-5 font-black uppercase text-xs tracking-widest shadow-lg transition-all ${isProcessing || !user?.address ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                                    }`}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </button>

                            {!user?.address && (
                                <p className="text-red-500 text-[10px] font-bold uppercase text-center mt-3 tracking-widest">
                                    Please add an address in your profile first.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;