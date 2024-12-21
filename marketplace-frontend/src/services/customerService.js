import axios from 'axios';
import authService from './authService';

const API_URL = 'http://127.0.0.1:5000/api';

const getItems = () => {
    return axios.get(`${API_URL}/items`).then(response => response.data);
};

const addToCart = (itemId, quantity) => {
    const user = authService.getCurrentUser();
    return axios.post(`${API_URL}/cart/items`, { item_id: itemId, quantity }, {
        headers: { Authorization: `Bearer ${user.token}` }
    });
};

const updateCartItem = (itemId, quantity) => {
    const user = authService.getCurrentUser();
    return axios.put(`${API_URL}/cart/items/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${user.token}` }
    });
};

const getCart = () => {
    const user = authService.getCurrentUser();
    return axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${user.token}` }
    }).then(response => response.data);
};

const deleteCartItem = (itemId) => {
    const user = authService.getCurrentUser();
    return axios.delete(`${API_URL}/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
    });
};
const customerService = {
    getItems,
    addToCart,
    updateCartItem,
    getCart,
    deleteCartItem  // Add this new function
};

export default customerService;
