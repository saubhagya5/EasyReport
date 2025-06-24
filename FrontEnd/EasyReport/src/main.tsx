import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <StrictMode>
    <App />
  </StrictMode>
  </ApolloProvider>
)
