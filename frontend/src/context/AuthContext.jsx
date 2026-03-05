import { createContext, useContext, useState, useEffect } from "react";
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        return decode.role;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
