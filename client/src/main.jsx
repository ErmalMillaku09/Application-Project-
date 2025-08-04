import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Import BrowserRouter

// Assuming you have your Apollo Client setup here
const client = new ApolloClient({
  uri: 'https://graphql-api-brown.vercel.app/api/graphql', // <-- Make sure this is configured
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      {/* 2. Wrap your App component */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);