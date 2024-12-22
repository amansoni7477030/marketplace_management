import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ShoppingCart from './ShoppingCart';
import customerService from '../../services/customerService';

jest.mock('../../services/customerService');

describe('ShoppingCart Component', () => {
  test('renders ShoppingCart', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  test('fetches cart items', async () => {
    customerService.getCart.mockResolvedValue([{ item_id: 1, item_name: 'Test Item', price: 10, quantity: 1 }]);

    await act(async () => {
      render(<ShoppingCart />);
    });

    expect(await screen.findByText('Test Item')).toBeInTheDocument();
  });
});
