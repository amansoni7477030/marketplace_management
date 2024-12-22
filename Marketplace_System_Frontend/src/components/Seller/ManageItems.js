import React, { useState, useEffect } from 'react';
import sellerService from '../../services/sellerService';
import './ManageItems.css';

// Update Item Modal Component
const UpdateItemModal = ({ item, onClose, onUpdate }) => {
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [price, setPrice] = useState(item.price);
    const [stock, setStock] = useState(item.stock);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate({
                id: item.id,
                name,
                description,
                price: Number(price),
                stock: Number(stock)
            });
            onClose();
        } catch (error) {
            setError('Failed to update item');
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Update Item</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="update-form">
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
                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main ManageItems Component
const ManageItems = () => {
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [itemsByShop, setItemsByShop] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchShopsAndItems = async () => {
            try {
                const shopsList = await sellerService.getShops();
                setShops(shopsList);
                
                const itemsData = {};
                for (const shop of shopsList) {
                    const shopItems = await sellerService.getItems(shop.id);
                    itemsData[shop.id] = shopItems;
                }
                setItemsByShop(itemsData);
                
                if (shopsList.length > 0) {
                    setSelectedShopId(shopsList[0].id);
                }
            } catch (error) {
                setError('Failed to fetch shops and items');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopsAndItems();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!selectedShopId) {
            setError('Please select a shop first');
            return;
        }

        try {
            const response = await sellerService.addItem(selectedShopId, name, description, Number(price), Number(stock));
            const newItem = response.data;
            
            setItemsByShop(prev => ({
                ...prev,
                [selectedShopId]: [...(prev[selectedShopId] || []), {
                    ...newItem,
                    shop_id: selectedShopId
                }]
            }));
            
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

    const handleUpdateItem = async (updatedItem) => {
        try {
            const response = await sellerService.updateItem(updatedItem.id, updatedItem);
            const updatedItemData = response.data;
            
            // Find the shop ID for the updated item
            let shopId = null;
            for (const [currentShopId, items] of Object.entries(itemsByShop)) {
                if (items.find(item => item.id === updatedItem.id)) {
                    shopId = parseInt(currentShopId);
                    break;
                }
            }

            if (shopId) {
                setItemsByShop(prev => ({
                    ...prev,
                    [shopId]: prev[shopId].map(item =>
                        item.id === updatedItem.id ? { ...updatedItemData, shop_id: shopId } : item
                    )
                }));
            }
            
            setSelectedItem(null);
            alert('Item updated successfully!');
        } catch (error) {
            setError('Failed to update item');
            console.error(error);
        }
    };

    const handleDeleteItem = async (itemId, shopId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await sellerService.deleteItem(itemId);
                setItemsByShop(prev => ({
                    ...prev,
                    [shopId]: (prev[shopId] || []).filter(item => item.id !== itemId)
                }));
                alert('Item deleted successfully!');
            } catch (error) {
                setError('Failed to delete item');
                console.error(error);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (shops.length === 0) return <div className="no-shop">Please create a shop first to manage items.</div>;

    return (
        <div className="manage-items-container">
            <h2>Manage Items</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="shop-selector">
                <label>Select Shop:</label>
                <select 
                    value={selectedShopId || ''} 
                    onChange={(e) => setSelectedShopId(Number(e.target.value))}
                    className="shop-select"
                >
                    {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>
                            {shop.name}
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleAddItem} className="add-item-form">
                <h3>Add New Item to {shops.find(s => s.id === selectedShopId)?.name}</h3>
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
                {selectedShopId && (
                    <div className="shop-items-section">
                        <h3>{shops.find(s => s.id === selectedShopId)?.name}</h3>
                        {(!itemsByShop[selectedShopId] || itemsByShop[selectedShopId].length === 0) ? (
                            <p>No items in this shop yet.</p>
                        ) : (
                            <div className="items-grid">
                                {itemsByShop[selectedShopId].map(item => (
                                    <div key={item.id} className="item-card">
                                        <h4>{item.name}</h4>
                                        <p>{item.description}</p>
                                        <p className="price">Price: ${item.price}</p>
                                        <p>Stock: {item.stock}</p>
                                        <div className="item-actions">
                                            <button 
                                                onClick={() => setSelectedItem(item)}
                                                className="btn btn-primary"
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteItem(item.id, selectedShopId)}
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
                )}
            </div>

            {selectedItem && (
                <UpdateItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onUpdate={handleUpdateItem}
                />
            )}
        </div>
    );
};

export default ManageItems;