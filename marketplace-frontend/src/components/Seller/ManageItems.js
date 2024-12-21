import React, { useState, useEffect } from 'react';
import sellerService from '../../services/sellerService';
import './ManageItems.css';

const ManageItems = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [shopId, setShopId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShopAndItems = async () => {
            try {
                const shops = await sellerService.getShops();
                if (shops.length > 0) {
                    setShopId(shops[0].id);
                    const shopItems = await sellerService.getItems(shops[0].id);
                    setItems(shopItems);
                }
            } catch (error) {
                setError('Failed to fetch shop data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopAndItems();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const newItem = await sellerService.addItem(shopId, name, description, Number(price), Number(stock));
            setItems([...items, newItem.data]);
            // Reset form
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            alert('Item added successfully!');
        } catch (error) {
            setError('Failed to add item');
            console.error(error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await sellerService.deleteItem(itemId);
                setItems(items.filter(item => item.id !== itemId));
                alert('Item deleted successfully!');
            } catch (error) {
                setError('Failed to delete item');
                console.error(error);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!shopId) return <div className="no-shop">Please create a shop first to manage items.</div>;

    return (
        <div className="manage-items-container">
            <h2>Manage Items</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleAddItem} className="add-item-form">
                <h3>Add New Item</h3>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Stock:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Item</button>
            </form>

            <div className="items-list">
                <h3>Your Items</h3>
                {items.length === 0 ? (
                    <p>No items yet. Add your first item above!</p>
                ) : (
                    <div className="items-grid">
                        {items.map(item => (
                            <div key={item.id} className="item-card">
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                                <p className="price">Price: ${item.price}</p>
                                <p>Stock: {item.stock}</p>
                                <div className="item-actions">
                                    <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete Item
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

export default ManageItems;