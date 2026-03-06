import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const Profile = () => {
    const { user } = useAuth(); // Get the logged-in user's data
    const [status, setStatus] = useState({ type: '', message: ''});

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        payment_preference: 'Credit Card',
        password: '' // Left blank intentionally for security reasons
    });

    // Fetch the full user data from the database when the component loads
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.id) {
                try {
                    // Fetch the specific user's full data from the backend
                    const response = await api.get(`/users/${user.id}`);
                    const fullUserData = response.data;
                    
                    // Pre-fill the form with the fetched data
                    setFormData({
                        name: fullUserData.name || '',
                        email: fullUserData.email || '',
                        address: fullUserData.address || '',
                        payment_preference: fullUserData.payment_preference || 'Credit Card',
                        password: '' //leave this blank for security
                    });
                } catch (error) {
                    setStatus({ type: 'error', message: 'Could not load profile data.' });
                    console.error("Failed to fetch user profile:", error);
                }
            }
        };

        fetchUserProfile();
    }, [user]); // Runs whenever the 'user' session state is ready

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Updating profile...' });

        try {
            // Create a payload If the password field is empty. remove it so we don't overwrite it with a blank string
            const payload = { ...formData };
            if (!payload.password) {
                delete payload.password;
            }

            // Calls the backend to update the user
            await api.patch(`/users/${user.id}`, payload);

            setStatus({ type: 'success', message: 'Profile updated successfully!' });

            //Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: '', message: ''}), 3000);
        }catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update profile. Please try again.' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white p-10 shadow-xl border border-gray-100 rounded-2xl">
                    <div className="mb-8 border-b border-gray-100 pb-6">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">
                            Profile Settings
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
                            Manage your account details and preferences
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`p-4 mb-6 text-sm font-bold uppercase tracking-widest border-l-4 ${
                            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-500' : 
                            status.type === 'error' ? 'bg-red-50 text-red-700 border-red-500' : 
                            'bg-blue-50 text-blue-700 border-blue-500'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                <input
                                    type="email" required
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all bg-gray-50"
                                    value={formData.email}
                                    readOnly // Email is read-only to prevent changes, as it is often used as a unique identifier
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Shipping Address*/}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Default Shipping Address</label>
                            <input
                                type="text" required
                                className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Payment Preferences */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Preference</label>
                                <select 
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all bg-white"
                                    value={formData.payment_preference}
                                    onChange={(e) => setFormData({...formData, payment_preference: e.target.value})}
                                >
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Apple Pay">Apple Pay</option>
                                </select>
                            </div>

                            {/* Password Update */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all placeholder-gray-300"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                className="bg-black text-white px-10 py-4 font-black uppercase text-[12px] tracking-widest hover:bg-gray-800 shadow-lg active:scale-95 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
