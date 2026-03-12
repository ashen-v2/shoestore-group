import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Hitting the endpoint to get reviews for this specific product
                const response = await api.get(`/reviews/products/${productId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    // Helper to render star ratings
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg 
                key={index} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.165c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
        ));
    };

    if (loading) {
        return <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading reviews...</p>;
    }

    return (
        <div className="mt-6 py-5 border-t border-gray-200">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-8">
                Customer Reviews ({reviews.length})
            </h2>

            {/* Placeholder for the future "Add Review" form */}

            <div className="space-y-8">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        // Using the structure from the API response
                        <div key={review.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                {/* User Info and Rating */}
                                <div className="flex items-center gap-4">
                                    {/* Profile Image with Fallback */}
                                    {review.profile_image_url ? (
                                        <img 
                                            src={review.profile_image_url} 
                                            alt={review.user_name} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-black text-lg shadow-sm border-2 border-white">
                                            {/* Show first letter of name, or 'U' for user */}
                                            {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <p className="font-bold text-black">{review.user_name || `User #${review.user_id}`}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                </div>

                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed ml-16">
                                {review.description}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;