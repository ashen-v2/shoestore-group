import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Navbar from '../../components/common/Navbar';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State for the currently editing review
    const [editingId, setEditingId] = useState(null);
    const [rating, setRating] = useState(5);
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchMyReviews = async () => {
        try {
            // Fetching all reviews for the logged-in user
            const response = await api.get('/reviews/me');
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch user reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const handleSubmitReview = async (reviewId, e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Using the PATCH endpoint to publish the placeholder review
            await api.patch(`/reviews/${reviewId}`, {
                rating: rating,
                description: description
            });
            
            // Refresh the list to show it moved from "Pending" to "Published"
            await fetchMyReviews();
            setEditingId(null); // Close the form
            setDescription(''); // Reset the form
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Could not submit your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Split reviews into two lists based on the backend flag
    const pendingReviews = reviews.filter(r => !r.is_reviewed);
    const publishedReviews = reviews.filter(r => r.is_reviewed);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-32 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">Loading your reviews...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black mb-10 border-b border-gray-200 pb-6">
                    My Reviews
                </h1>

                {/* PENDING REVIEWS SECTION */}
                <div className="mb-12">
                    <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6 flex items-center gap-2">
                        Needs Review 
                        <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">{pendingReviews.length}</span>
                    </h2>
                    
                    {pendingReviews.length === 0 ? (
                        <p className="text-gray-500 italic bg-white p-6 rounded-xl border border-gray-100 shadow-sm">You have no pending reviews.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingReviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {/* Note: If your backend adds product names to this endpoint later, display it here! */}
                                            <p className="font-bold text-lg">Product #{review.product_id}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Awaiting your feedback</p>
                                        </div>
                                        
                                        {editingId !== review.id && (
                                            <button 
                                                onClick={() => { setEditingId(review.id); setRating(5); }}
                                                className="bg-black text-white px-4 py-2 font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all"
                                            >
                                                Write Review
                                            </button>
                                        )}
                                    </div>

                                    {/* INLINE REVIEW FORM */}
                                    {editingId === review.id && (
                                        <form onSubmit={(e) => handleSubmitReview(review.id, e)} className="mt-6 pt-6 border-t border-gray-100 animate-fade-in-down">
                                            <div className="mb-4">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rating (1-5)</label>
                                                <select 
                                                    value={rating} 
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                    className="p-3 border-2 border-gray-200 text-sm font-bold w-full outline-none focus:border-black transition-colors"
                                                >
                                                    {[5, 4, 3, 2, 1].map(num => (
                                                        <option key={num} value={num}>{num} Stars</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Experience</label>
                                                <textarea 
                                                    required
                                                    rows="4"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="What did you think about this product?"
                                                    className="p-4 border-2 border-gray-200 text-sm font-medium w-full outline-none focus:border-black transition-colors resize-none"
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button 
                                                    type="submit" 
                                                    disabled={submitting}
                                                    className="bg-black text-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                                                >
                                                    {submitting ? 'Publishing...' : 'Publish Review'}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setEditingId(null)}
                                                    className="px-6 py-3 font-black uppercase text-xs tracking-widest text-gray-500 hover:text-black transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PUBLISHED REVIEWS SECTION */}
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-gray-400 mb-6">Published Reviews</h2>
                    <div className="space-y-4 opacity-75">
                        {publishedReviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-black text-black">{review.rating} / 5</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">• Product #{review.product_id}</span>
                                </div>
                                <p className="text-gray-600 font-medium">"{review.description}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReviews;