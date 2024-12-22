import React, { useState, useEffect } from 'react';
import sellerService from '../../services/sellerService';
import { useNavigate } from 'react-router-dom';
import './CreateShop.css';

const CreateShop = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shopsList = await sellerService.getShops();
                setShops(shopsList);
            } catch (error) {
                console.error("Error fetching shops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const newShop = await sellerService.createShop(name, description);
            setShops([...shops, newShop.data]);
            alert('Shop created successfully');
            navigate('/manage-items');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to create shop');
        }
    };

    const handleDeleteShop = async (shopId) => {
        if (window.confirm('Are you sure you want to delete this shop? This action cannot be undone and will delete all items in your shop.')) {
            try {
                await sellerService.deleteShop(shopId);
                setShops(shops.filter(shop => shop.id !== shopId));
                alert('Shop deleted successfully');
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to delete shop');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="shops-container">
            <h2>Your Shops</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="create-shop-form">
                <h3>Create New Shop</h3>
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

            <div className="shops-list">
                <h3>Existing Shops</h3>
                {shops.length === 0 ? (
                    <p>No shops yet. Create your first shop above!</p>
                ) : (
                    <div className="shops-grid">
                        {shops.map(shop => (
                            <div key={shop.id} className="shop-card">
                                <h4>{shop.name}</h4>
                                <p>{shop.description}</p>
                                <div className="shop-actions">
                                    <button 
                                        onClick={() => handleDeleteShop(shop.id)}
                                        className="delete-button"
                                    >
                                        Delete Shop
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateShop;