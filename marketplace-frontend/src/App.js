import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CreateShop from './components/Seller/CreateShop';
import ManageItems from './components/Seller/ManageItems';
import ViewItems from './components/Customer/ViewItems';
import ShoppingCart from './components/Customer/ShoppingCart';
import authService from './services/authService';
import './App.css';

// Protected Route Components
const SellerRoute = ({ children }) => {
    if (!authService.getCurrentUser()) {
        return <Navigate to="/login" />;
    }
    if (!authService.isSeller()) {
        return <Navigate to="/" />;
    }
    return children;
};

const CustomerRoute = ({ children }) => {
    if (!authService.getCurrentUser()) {
        return <Navigate to="/login" />;
    }
    if (!authService.isCustomer()) {
        return <Navigate to="/" />;
    }
    return children;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Seller Routes */}
                    <Route 
                        path="/create-shop" 
                        element={
                            <SellerRoute>
                                <CreateShop />
                            </SellerRoute>
                        } 
                    />
                    <Route 
                        path="/manage-items" 
                        element={
                            <SellerRoute>
                                <ManageItems />
                            </SellerRoute>
                        } 
                    />
                    
                    {/* Customer Routes */}
                    <Route 
                        path="/view-items" 
                        element={
                            <CustomerRoute>
                                <ViewItems />
                            </CustomerRoute>
                        } 
                    />
                    <Route 
                        path="/cart" 
                        element={
                            <CustomerRoute>
                                <ShoppingCart />
                            </CustomerRoute>
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;