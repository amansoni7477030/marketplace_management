import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';
import './ShoppingCart.css'; // Import the CSS file

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await customerService.getCart();
            setCartItems(data);
        } catch (error) {
            alert('Failed to fetch cart items');
        }
    };

    const handleUpdateQuantity = async (itemId, quantity) => {
        try {
            const numQuantity = parseInt(quantity, 10);
            if (isNaN(numQuantity) || numQuantity < 0) {
                alert('Please enter a valid quantity');
                return;
            }
            await customerService.updateCartItem(itemId, numQuantity);
            await fetchCart();
        } catch (error) {
            alert('Failed to update cart');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            setLoading(true);
            await customerService.deleteCartItem(itemId);
            await fetchCart();
            alert('Item removed from cart');
        } catch (error) {
            alert('Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <div className="cart-container">
            <h2 className="cart-header">Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.item_id} className="cart-item">
                                <div className="item-info">
                                    <h3>{item.item_name}</h3>
                                    <p>Price: ${item.price}</p>
                                </div>
                                <div className="item-actions">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.item_id, e.target.value)}
                                        className="quantity-input"
                                    />
                                    <button
                                        onClick={() => handleDeleteItem(item.item_id)}
                                        className="delete-btn"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="item-total">
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ${calculateTotal()}</h3>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;
