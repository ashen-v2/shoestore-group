import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const Profile = () => {
    const { user, login, fetchCurrentUser } = useAuth(); //to refresh session after profile update
    const [status, setStatus] = useState({ type: '', message: ''});

    // Added profile_image_url to the initial state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        payment_preference: 'Credit Card',
        profile_image_url: '', 
        password: '' 
    });

    // Fetch fresh data directly from the backend when the page opens
    useEffect(() => {
        const fetchFreshProfile = async () => {
            try {
                // Ensure frontend session is up-to-date with the latest user data from the backend
                const response = await api.get('/users/me');
                const latestData = response.data;
                
                // Immediately populate the form
                setFormData({
                    name: latestData.name || '',
                    email: latestData.email || '',
                    address: latestData.address || '',
                    profile_image_url: latestData.profile_image_url || '',
                    payment_preference: latestData.payment_preference || 'Credit Card',
                    password: '' // Always blank for security
                });
            } catch (err) {
                console.error("Could not fetch fresh profile data:", err);
            }
        };

        fetchFreshProfile();
    }, []); // The empty array [] means this runs exactly once every time you navigate to this page

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Updating profile...' });

        try {
            const payload = { ...formData };
            if (!payload.password) {
                delete payload.password;
            }

            // Calls the backend to update the user
            await api.patch(`/users/me`, payload);

            if (fetchCurrentUser) {
                await fetchCurrentUser();
            }

            // After successful update, fetch the updated user data to refresh the session
            await fetchCurrentUser();

            setStatus({ type: 'success', message: 'Profile updated successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: '', message: ''}), 3000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update profile. Please try again.' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white p-10 shadow-xl border border-gray-100 rounded-2xl">
                    <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">
                                Profile Settings
                            </h1>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
                                Manage your account details and preferences
                            </p>
                        </div>
                        {/* Show a preview of the avatar if they have one */}
                        {formData.profile_image_url && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                                <img src={formData.profile_image_url} alt="Profile Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                <input
                                    type="email" required
                                    className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-bold text-sm transition-all bg-gray-50"
                                    value={formData.email}
                                    readOnly 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* 3. New Profile Image Input Block */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Profile Image URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/my-avatar.jpg"
                                className="w-full border-2 border-gray-100 p-3 focus:border-black outline-none font-medium text-xs text-gray-500 transition-all"
                                value={formData.profile_image_url}
                                onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
                            />
                        </div>

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