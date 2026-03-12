import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth and Role Context
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
import HelpDesk from './pages/customer/HelpDesk';
import ModeratorDashboard from './pages/moderator/ModeratorDashboard';
import AdminHelpDesk from './pages/admin/AdminHelpDesk';
import AboutUs from './pages/customer/AboutUs';

const ROLE_MAP = {
  0: 'admin',
  '0': 'admin',
  1: 'user',
  '1': 'user',
  2: 'moderator',
  '2': 'moderator'
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); 

  // Not logged in? Send to login page.
  if (!user) {
      return <Navigate to="/login" replace />;
  }

  // Translate the integer role into a string, fallback to 'unknown'
  const userRoleString = ROLE_MAP[user.role] || 'unknown';

  // Check if the user's role is in the allowed list
  const safeAllowedRoles = allowedRoles.map(r => r.toLowerCase());
  
  if (!safeAllowedRoles.includes(userRoleString)) {
      return <Navigate to="/" replace />; // Kick unauthorized users to home
  }

  // Access Granted! Render the protected page.
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
            <Route path="/helpdesk" element={<HelpDesk />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Moderator Routes */}
            <Route
              path="/moderator"
              element={
                <ProtectedRoute allowedRoles={['moderator']}>
                  <ModeratorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes*/}
             <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            /> 
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/helpdesk"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHelpDesk />
                </ProtectedRoute>
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