// authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const register = async (email, password, role) => {
    const response = await axios.post(`${API_URL}/register`, { email, password, role });
    return response.data;
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            const userData = {
                token: response.data.token,
                email: response.data.user.email,
                role: response.data.user.role
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

const isCustomer = () => {
    const user = getCurrentUser();
    return user?.role === 'customer';
};

const isSeller = () => {
    const user = getCurrentUser();
    return user?.role === 'seller';
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    isCustomer,
    isSeller,
};

export default authService;