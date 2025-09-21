import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

test('renders loading spinner with default text', () => {
  render(<LoadingSpinner />);
  const loadingText = screen.getByText(/Loading.../i);
  expect(loadingText).toBeInTheDocument();
});

test('renders loading spinner with custom text', () => {
  render(<LoadingSpinner text="Please wait..." />);
  const loadingText = screen.getByText(/Please wait.../i);
  expect(loadingText).toBeInTheDocument();
});

test('renders loading spinner with different sizes', () => {
  const { rerender } = render(<LoadingSpinner size="small" />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
  rerender(<LoadingSpinner size="large" />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});
