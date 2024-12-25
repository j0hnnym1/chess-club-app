import React from 'react';
import { createRoot } from 'react-dom/client'; // New import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();
const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
