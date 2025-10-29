import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello world page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello World Page/i);
  expect(linkElement).toBeInTheDocument();
});
