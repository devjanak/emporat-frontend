import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import client from './services/apolloClient';
import { AuthProvider } from './services/authContext';
import ToastProvider from './components/ToastProvider';
import routes from './routes/routeConfig';
import './App.css';

// Create router first
const router = createBrowserRouter(routes);

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ToastProvider />
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
