import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `${SERVER_URL}/graphql`,
});

// Combine auth + HTTP link
const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export default client;