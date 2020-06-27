import { render } from '@testing-library/react';
import React from 'react';
import { MainRoute } from './MainRoute';

test('renders learn react link', () => {
  const { getByText } = render(<MainRoute />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
