import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added a loading state
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Lock the button and start loading

        try {
            // The login function in AuthContext MUST have `await fetchCurrentUser()` 
            // inside it for this to wait for the profile image!
            const role = await login(email, password);
            
            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            setIsLoading(false); // Only stop loading if there is an error
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
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 p-3 text-sm font-bold text-red-500 border-l-4 border-red-500 uppercase tracking-widest">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4 shadow-sm">
                        <div>
                            <input
                                type="email"
                                required
                                className="relative block w-full border-2 border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none sm:text-sm font-bold transition-colors"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading} // Prevent typing while loading
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="relative block w-full border-2 border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none sm:text-sm font-bold transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading} // Prevent typing while loading
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading} // Disable the button while it fetches the image
                            className={`group relative flex w-full justify-center py-4 px-4 text-sm font-black text-white uppercase tracking-widest transition-all ${
                                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-[0.98]'
                            }`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Not a member? {' '}
                        <Link to="/register" className="font-black text-black underline hover:text-gray-700">
                            Join us.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;