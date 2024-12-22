import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';
import './ViewItems.css';

const ViewItems = () => {
    const [items, setItems] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await customerService.getItems();
                if (data) {
                    setItems(data);
                    const initialQuantities = {};
                    data.forEach(item => {
                        initialQuantities[item.id] = 1;
                    });
                    setQuantities(initialQuantities);
                } else {
                    console.error("Failed to fetch items");
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);    

    const handleAddToCart = async (itemId) => {
        try {
            await customerService.addToCart(itemId, quantities[itemId]);
            alert('Item added to cart successfully!');
        } catch (error) {
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const handleQuantityChange = (itemId, value) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: parseInt(value) || 1
        }));
    };

    return (
        <div className="items-container">
            <h2>Available Items</h2>
            <div className="items-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Price: ${item.price}</p>
                        <p>Shop: {item.shop_name}</p>
                        <p>Available: {item.stock}</p>
                        <div className="item-actions">
                            <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={quantities[item.id]}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="quantity-input"
                            />
                            <button 
                                onClick={() => handleAddToCart(item.id)}
                                className="add-to-cart-btn"
                                disabled={item.stock === 0}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewItems;