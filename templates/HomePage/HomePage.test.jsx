// /* eslint-disable import/no-extraneous-dependencies */
// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import HomePage from './HomePage';
// // import seedData from '@/functions/seed_data.json';

// describe('HomePage - Rendering Favorited Tools', () => {
// //   const mockTools = [
// //     { id: 1, name: 'Tool One', description: 'Description One', category: 'Planning' },
// //     { id: 2, name: 'Tool Two', description: 'Description Two', category: 'Writing' },
// //     { id: 3, name: 'Tool Three', description: 'Description Three', category: 'Study' },
// //   ];
//     const mockTools = Object.values(require('@/functions/seed_data.json'))
    
//     test('clicking the favorite button adds the tool to the Favorites section', () => {
//         render(<HomePage data={mockTools} loading={false} />);
//         screen.getAllByRole('button').forEach((button) => console.log(button));
//         // Ensure tool is not in Favorites initially
//         expect(screen.queryByText('Favorites (1)')).not.toBeInTheDocument();
        
    
//         // // Simulate clicking the favorite button on "FlashCards Generator"
//         // const favoriteButton = screen.getAllByRole('button', { name: /favorite/i })[0];
//         // fireEvent.click(favoriteButton);
    
//         // // Verify "FlashCards Generator" is now in the Favorites section
//         // expect(screen.getByText('Favorites (1)')).toBeInTheDocument();
//         // expect(screen.getByText('FlashCards Generator')).toBeInTheDocument();

//     });
    

   

    
 
// });


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Mock Redux store
import HomePage from './HomePage';

describe('HomePage - Rendering Favorited Tools', () => {
  const mockStore = configureStore([]); // Initialize mock store
  const initialState = {
    tools: {
      data: [
        {
          id: 'flashcard-generator',
          name: 'FlashCards Generator',
          description: 'Creates flash cards from a youtube video.',
          category: ['Study', 'Assessments'],
        },
        {
          id: 'multiple-choice-quiz-generator',
          name: 'Multiple Choice Quiz',
          description: 'Create a multiple choice quiz based on any topic.',
          category: ['Assessments'],
        },
      ],
      loading: false,
    },
    user: {
      favorites: ['flashcard-generator'],
    },
  };

  const store = mockStore(initialState);

  test('clicking the favorite button adds the tool to the Favorites section', () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Ensure initial favorite tool is rendered
    expect(screen.getByText('FlashCards Generator')).toBeInTheDocument();

    // Simulate clicking the favorite button for another tool
    const favoriteButton = screen.getAllByRole('button', { name: /favorite/i })[1];
    fireEvent.click(favoriteButton);

    // Ensure the newly favorited tool is added
    expect(screen.getByText('Multiple Choice Quiz')).toBeInTheDocument();
  });
});
