import React, { useState, useEffect } from 'react';
import sellerService from '../../services/sellerService';
import { useNavigate } from 'react-router-dom';
import './CreateShop.css';

const CreateShop = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [existingShop, setExistingShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkShop = async () => {
            try {
                const shops = await sellerService.getShops();
                if (shops.length > 0) {
                    setExistingShop(shops[0]); // Store the existing shop data
                }
            } catch (error) {
                console.error("Error checking shops:", error);
            } finally {
                setLoading(false);
            }
        };
        checkShop();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await sellerService.createShop(name, description);
            alert('Shop created successfully');
            navigate('/manage-items');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to create shop');
        }
    };

    const handleDeleteShop = async () => {
        if (window.confirm('Are you sure you want to delete your shop? This action cannot be undone and will delete all items in your shop.')) {
            try {
                await sellerService.deleteShop(existingShop.id);
                alert('Shop deleted successfully');
                setExistingShop(null);
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to delete shop');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (existingShop) {
        return (
            <div className="existing-shop-container">
                <h2>Existing Shop</h2>
                <div className="shop-info">
                    <p><strong>Shop Name:</strong> {existingShop.name}</p>
                    <p><strong>Description:</strong> {existingShop.description}</p>
                </div>
                <div className="warning-message">
                    <p>You already have an active shop. To create a new shop, you must first delete your existing shop.</p>
                    <p className="warning">Warning: Deleting your shop will permanently remove all items and cannot be undone.</p>
                </div>
                <button 
                    onClick={handleDeleteShop}
                    className="delete-button"
                >
                    Delete Existing Shop
                </button>
                {error && <div className="error-message">{error}</div>}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="create-shop-form">
            <h2>Create Your Shop</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label>Shop Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Shop Name" 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Description"
                ></textarea>
            </div>
            <button type="submit" className="submit-button">Create Shop</button>
        </form>
    );
};

export default CreateShop;