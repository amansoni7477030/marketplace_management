import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isCustomer = authService.isCustomer();
    const isSeller = authService.isSeller();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Marketplace</Link>
            </div>
            <ul className="nav-links">
                {!user ? (
                    // Guest user links
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                ) : isCustomer ? (
                    // Customer links
                    <>
                        <li><Link to="/view-items">Browse Items</Link></li>
                        <li><Link to="/cart">Shopping Cart</Link></li>
                    </>
                ) : isSeller ? (
                    // Seller links
                    <>
                        <li><Link to="/create-shop">Create Shop</Link></li>
                        <li><Link to="/manage-items">Manage Items</Link></li>
                    </>
                ) : null}
                {user && (
                    <li>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;