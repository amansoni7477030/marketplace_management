import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateShop from './CreateShop';
import sellerService from '../../services/sellerService';

jest.mock('../../services/sellerService');

describe('CreateShop Component', () => {
  test('renders CreateShop form', () => {
    render(<CreateShop />);
    expect(screen.getByText('Create New Shop')).toBeInTheDocument();
  });

  test('submits the form and creates a shop', async () => {
    sellerService.createShop.mockResolvedValue({ data: { id: 1, name: 'Test Shop', description: 'Test Description' } });

    render(<CreateShop />);

    fireEvent.change(screen.getByPlaceholderText('Shop Name'), { target: { value: 'Test Shop' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText('Create Shop'));

    expect(sellerService.createShop).toHaveBeenCalledWith('Test Shop', 'Test Description');
  });
});
