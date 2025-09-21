import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './components/Common/LoadingSpinner';

test('renders loading spinner', () => {
  render(<LoadingSpinner />);
  const loadingText = screen.getByText(/Loading.../i);
  expect(loadingText).toBeInTheDocument();
});
