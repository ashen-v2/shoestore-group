import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        payment_preference: 'Credit Card'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Prevent duplicate accounts (handled by backend 400 error)
            await api.post('/users/', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Check your details.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tighter text-black uppercase italic">
                        Become a Member
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your profile to start shopping the best of Nike and Adidas.
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 p-3 text-sm text-red-500 border-l-4 border-red-500">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            className="block w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none sm:text-sm"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            className="block w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none sm:text-sm"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input
                            type="text"
                            required
                            placeholder="Shipping Address"
                            className="block w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none sm:text-sm"
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                        <select 
                            className="block w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none sm:text-sm bg-white"
                            onChange={(e) => setFormData({...formData, payment_preference: e.target.value})}
                        >
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                            <option value="Apple Pay">Apple Pay</option>
                        </select>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="block w-full border-2 border-gray-200 p-3 focus:border-black focus:outline-none sm:text-sm"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black py-3 px-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Join Us
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already a member? {' '}
                        <Link to="/login" className="font-bold text-black underline">Sign In.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;