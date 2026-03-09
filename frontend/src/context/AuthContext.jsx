import { createContext, useContext, useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Optional: Function to fetch current user details from the backend using the token
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Hits the endpoint that returns current user details based on the token
            const response = await api.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user session", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Run this whenever the app loads
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decode = jwtDecode(token);
                setUser({ id: decode.user_id, role: decode.role });
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // FastAPI OAuth2PasswordRequestForm expects URL-encoded form data at /users/login
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post('/users/login', params);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        const decode = jwtDecode(access_token);
        setUser({ id: decode.user_id, role: decode.role });
        await fetchCurrentUser(); // Fetch user details after login
        return decode.role;
    };

    const logout = () => {
        localStorage.removeItem('token');
        const shouldLogout = window.confirm('Are you sure you want to log out?');
        if (!shouldLogout) return;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchCurrentUser,loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


export default AuthContext;
