import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all favorited items
    const fetchWishlist = async () => {
        try {
            const response = await api.get('/wishlist/');
            setWishlist(response.data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load wishlist on initial render
    useEffect(() => {
        fetchWishlist();
    }, []);

    // Add a product to the wishlist
    const addToWishlist = async (productId) => {
        try {
            // Using the POST endpoint
            await api.post(`/wishlist/${productId}`);
            await fetchWishlist(); // Refresh the list to get the full product details
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            alert("Could not add item to wishlist.");
        }
    };

    // Remove a product from the wishlist
    const removeFromWishlist = async (productId) => {
        try {
            // Using the DELETE endpoint
            await api.delete(`/wishlist/${productId}`);
            
            // Instantly update the UI without needing a full network refresh
            setWishlist(prev => prev.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert("Could not remove item from wishlist.");
        }
    };

    // Helper function to check if a heart should be filled in or empty
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ 
            wishlist, 
            loading, 
            fetchWishlist, 
            addToWishlist, 
            removeFromWishlist, 
            isInWishlist 
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Custom hook to use the wishlist anywhere
export const useWishlist = () => useContext(WishlistContext);