import React from 'react';
import { render } from '@testing-library/react';
import { HomeRoute } from './HomeRoute';

test('renders learn react link', () => {
  const { getByText } = render(<HomeRoute />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
