import axios from 'axios';
import authService from './authService';

const API_URL = 'http://127.0.0.1:5000/api';

const createShop = (name, description) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.post(`${API_URL}/shops`, { name, description }, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    });
};

const addItem = (shopId, name, description, price, stock) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.post(`${API_URL}/shops/${shopId}/items`, { name, description, price, stock }, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    });
};

const getItems = (shopId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.get(`${API_URL}/shops/${shopId}/items`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    }).then((response) => response.data);
};

const getShops = () => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.get(`${API_URL}/shops`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    }).then((response) => response.data);
};

const getSellerItems = () => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.get(`${API_URL}/seller/items`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    }).then((response) => response.data);
};

const deleteShop = (shopId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.delete(`${API_URL}/shops/${shopId}`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
        },
    });
};


const deleteItem = (itemId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
        throw new Error('User not authenticated');
    }
    return axios.delete(`${API_URL}/items/${itemId}`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    });
}

const sellerService = {
    createShop,
    addItem,
    getItems,
    getShops,
    getSellerItems,
    deleteShop,
    deleteItem,
};

export default sellerService;
