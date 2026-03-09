import { createContext, useContext, useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Translation map so login returns the correct word for Login.jsx redirection
const ROLE_MAP = {
    0: 'admin',
    1: 'user',
    2: 'moderator'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Decode the token to get the guaranteed ID and Role
            const decodedToken = jwtDecode(token);
            
            // Fetch the profile details (name, email, address)
            const response = await api.get('/users/me');
            
            // STITCH THEM TOGETHER: Profile data + decoded role/id
            setUser({
                ...response.data,
                id: decodedToken.user_id,
                role: decodedToken.role 
            });
            
        } catch (error) {
            console.error("Failed to fetch user session", error);
            setUser(null);
            localStorage.removeItem('token'); 
        } finally {
            setLoading(false);
        }
    };
    
    // Run this exactly whenever the app loads.
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (username, password) => {
        // FastAPI OAuth2PasswordRequestForm expects URL-encoded form data
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post('/users/login', params);
        const { access_token } = response.data;

        // Save the token
        localStorage.setItem('token', access_token);
        
        // Fetch full user details
        await fetchCurrentUser(); 
        
        // Decode just to get the string role for Login.jsx to use for the redirect
        const decodedToken = jwtDecode(access_token);
        
        
        return decodedToken.role; // Return the integer role for redirection logic in Login.jsx
    };

    const logout = () => {
        const shouldLogout = window.confirm('Are you sure you want to log out?');
        if (!shouldLogout) return;

        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchCurrentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;