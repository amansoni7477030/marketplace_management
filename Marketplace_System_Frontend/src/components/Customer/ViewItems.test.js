import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ViewItems from './ViewItems';
import customerService from '../../services/customerService';

jest.mock('../../services/customerService');

describe('ViewItems Component', () => {
  test('renders ViewItems', () => {
    render(<ViewItems />);
    expect(screen.getByText('Available Items')).toBeInTheDocument();
  });

  test('fetches items', async () => {
    customerService.getItems.mockResolvedValue([{ id: 1, name: 'Test Item', description: 'Test Description', price: 10, stock: 5, shop_name: 'Test Shop' }]);

    await act(async () => {
      render(<ViewItems />);
    });

    expect(await screen.findByText('Test Item')).toBeInTheDocument();
  });
});
