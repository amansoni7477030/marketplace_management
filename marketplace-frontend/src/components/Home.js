import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import './Home.css';

const SellerDashboard = () => {
    return (
        <div className="seller-dashboard">
            <h2>Seller Dashboard</h2>
            <p>Welcome to your seller dashboard! Manage your shop and items from here.</p>
            <div className="dashboard-actions">
                <Link to="/create-shop" className="btn btn-primary">Create Shop</Link>
                <Link to="/manage-items" className="btn btn-secondary">Manage Items</Link>
            </div>
        </div>
    );
};

const Home = () => {
    const user = authService.getCurrentUser();
    const isCustomer = authService.isCustomer();
    const isSeller = authService.isSeller();

    return (
        <div className="home-container">
            <h1>Welcome to the Marketplace</h1>
            {!user ? (
                <div className="guest-section">
                    <p>Your one-stop shop for all your needs. Join us today!</p>
                    <div className="auth-buttons">
                        <Link to="/register" className="btn btn-primary">Register</Link>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                    </div>
                </div>
            ) : isCustomer ? (
                <div className="customer-dashboard">
                    <h2>Welcome back, {user.email}</h2>
                    <p>Start shopping with us!</p>
                    <div className="dashboard-actions">
                        <Link to="/view-items" className="btn btn-primary">Browse Items</Link>
                        <Link to="/cart" className="btn btn-secondary">View Cart</Link>
                    </div>
                </div>
            ) : isSeller ? (
                <SellerDashboard />
            ) : null}
        </div>
    );
};

export default Home;