import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

 const StripePaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { fetchCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        // confirm the payment with Stripe's servers
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // only redirect if necessary (e.g. for 3D Secure)
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // The payment was succesful!
            await fetchCart(); // Clear the frontend cart
            navigate('/orders'); // send them to the success page.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-100 shadow-xl rounded-xl">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6 border-b border-gray-100 pb-4">
                Secure Payment
            </h2>
            
            {/* Stripe's magical pre-built secure input field */}
            <div className="mb-6">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="bg-red-50 p-4 border-l-4 border-red-500 text-red-600 font-bold text-sm mb-6">
                    {errorMessage}
                </div>
            )}

            <button 
                disabled={!stripe || isProcessing} 
                className={`w-full py-4 font-black uppercase text-xs tracking-widest shadow-lg transition-all ${
                    isProcessing || !stripe ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                }`}
            >
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
            </button>
            
            <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Payments are securely processed by Stripe
            </p>
        </form>
    );
 }

export default StripePaymentForm;