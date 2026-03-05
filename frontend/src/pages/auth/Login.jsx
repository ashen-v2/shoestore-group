import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // The login function in AuthContext handles the FormData and Axios call
            const role = await login(email, password);
            
            // Redirect based on role (Requirement: Role-Based Access Control)
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-auto max-w-md space-y-8">
                {/* Branding */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tighter text-black uppercase italic">
                        Your Game, Your Way
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your Nike & Adidas collection.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 p-3 text-sm text-red-500 border-l-4 border-red-500">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4 shadow-sm">
                        <div>
                            <input
                                type="email"
                                required
                                className="relative block w-full border-2 border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none sm:text-sm"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="relative block w-full border-2 border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center bg-black py-3 px-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-gray-800 focus:outline-none"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Not a member? {' '}
                        <Link to="/register" className="font-bold text-black underline hover:text-gray-700">
                            Join us.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;