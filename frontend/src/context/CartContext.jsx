import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext'; // check if the user are logged in

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth(); // Listen for user login/logout

    // 1. GET /cart/ - Fetch current user's cart items
    const fetchCart = async () => {
        if (!user) {
            setCartItems([]); // Clear cart if they log out
            return;
        }
        try {
            // Step A: Get the raw cart data (just stock_id and quantity)
            const cartRes = await api.get('/cart/');
            const rawCartItems = cartRes.data;

            if (rawCartItems.length === 0) {
                setCartItems([]);
                return;
            }

            // Step B: Fetch ALL products so we can hunt for the details
            const productsRes = await api.get('/products/');
            const allProducts = productsRes.data;

            // Step C: The "Frontend JOIN" Hack
            const enrichedCartItems = await Promise.all(rawCartItems.map(async (cartItem) => {
                let matchedProduct = null;
                let matchedStock = null;

                // Loop through every product to find which one owns this stock_id
                for (const product of allProducts) {
                    try {
                        const stockRes = await api.get(`/stocks/${product.id}`);
                        const productStocks = stockRes.data;
                        
                        const foundStock = productStocks.find(s => s.id === cartItem.stock_id);
                        if (foundStock) {
                            matchedStock = foundStock;
                            matchedProduct = product;
                            break; // We found the shoe, stop hunting!
                        }
                    } catch (e) {
                        console.error("Error fetching stock for product", product.id);
                    }
                }

                // Step D: Return the exact JSON structure that your Cart.jsx UI expects!
                return {
                    ...cartItem,
                    stock: {
                        size: matchedStock ? matchedStock.size : 'N/A',
                        product: matchedProduct || { 
                            name: 'Item Loading...', 
                            price: 0, 
                            brand: 'Unknown',
                            image_url: 'https://placehold.co/400' 
                        }
                    }
                };
            }));

            // Update the state with the fully enriched data
            setCartItems(enrichedCartItems);
            
        } catch (error) {
            console.error("Failed to fetch cart from database", error);
        }
    };

    // Automatically fetch the cart whenever the user logs in or loads the page
    useEffect(() => {
        fetchCart();
    }, [user]);

    // 2. POST /cart/{stock_id} - Add item to cart
    const addToCart = async (stockId) => {
        try {
            await api.post(`/cart/${stockId}`);
            fetchCart(); // Immediately pull the fresh cart from the DB
        } catch (error) {
            console.error("Failed to add item to cart", error);
            alert("Could not add item. Are you logged in?");
        }
    };

    // 3. PATCH /cart/{cart_item_id} - Update quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative quantities
        try {
            // Notice the '?q=' query parameter required by your friend's backend 
            await api.patch(`/cart/${cartItemId}?q=${newQuantity}`);
            fetchCart(); // Refresh UI
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    // 4. DELETE /cart/{cart_item_id} - Remove item
    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`/cart/${cartItemId}`);
            fetchCart(); // Refresh UI
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    // Calculate total items for your dynamic Navbar badge!
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            cartCount, 
            addToCart, 
            updateQuantity, 
            removeFromCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};