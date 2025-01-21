import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for assertions like toBeInTheDocument
import Favorites from './Favorites';

describe('Favorites Component', () => {
  const mockData = [
    { id: '1', name: 'Tool 1', description: 'Description 1' },
    { id: '2', name: 'Tool 2', description: 'Description 2' },
    { id: '3', name: 'Tool 3', description: 'Description 3' },
  ];

  const mockFavorites = ['1', '3'];

  const mockHandleToggleFavorite = jest.fn();

  test('renders successfully', () => {
    render(
      <Favorites
        data={mockData}
        favorites={mockFavorites}
        loading={false}
        handleToggleFavorite={mockHandleToggleFavorite}
      />
    );

    // Verify that the component renders without crashing
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  test('displays the correct favorite tools', () => {
    render(
      <Favorites
        data={mockData}
        favorites={mockFavorites}
        loading={false}
        handleToggleFavorite={mockHandleToggleFavorite}
      />
    );

    // Verify the favorite tools are rendered
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();

    // Ensure non-favorite tools are not rendered
    expect(screen.queryByText('Tool 2')).not.toBeInTheDocument();
  });
});
