import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; 

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import Orders from './pages/customer/Orders';
import ProductDetails from './pages/customer/ProductDetails';
import Checkout from './pages/customer/Checkout';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import Wishlist from './pages/customer/Wishlist';
import Category from './pages/customer/Category';
import MyReviews from './pages/customer/MyReviews';

// Role-Based Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/category" element={<Category />} />
            <Route path="/my-reviews" element={<MyReviews />} />

            {/* Admin Routes*/}
             <Route
              path="/admin"
              element={
                // <ProtectedRoute allowedRoles={['admin']}>
                //   <AdminDashboard />
                // </ProtectedRoute>
                <AdminDashboard />
              }
            /> 
            <Route
              path="/admin/orders"
              element={
                // <ProtectedRoute allowedRoles={['admin']}>
                //   <AdminOrders />
                // </ProtectedRoute>
                <AdminOrders />
              }
            />
            <Route
              path="/admin/payments"
              element={
                // <ProtectedRoute allowedRoles={['admin']}>
                //   <AdminPayments />
                // </ProtectedRoute>
                <AdminPayments />
              }
            />
            <Route
              path="/admin/analytics"
              element={
                // <ProtectedRoute allowedRoles={['admin']}>
                //   <AdminAnalytics />
                // </ProtectedRoute>
                <AdminAnalytics />
              }
            />
            </Routes>
          </div>
        </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;