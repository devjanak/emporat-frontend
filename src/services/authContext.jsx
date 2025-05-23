import { createContext, useContext, useState, useEffect } from 'react';
import { gql, useMutation, useApolloClient, createHttpLink } from '@apollo/client';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to fetch user data
          const { data } = await client.query({
            query: ME_QUERY,
            fetchPolicy: 'network-only',
            context: {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          });

          if (data.me) {
            setUser(data.me);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [client]);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      const { token, user } = data.login;
      localStorage.setItem('token', token);

      setUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      const { data } = await signupMutation({
        variables: { email, password },
      });

      const { token, user } = data.signup;
      localStorage.setItem('token', token);

      setUser(user);
      return user;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  // Logout function - no longer uses useNavigate
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Reset Apollo Client
    client.resetStore();
    
    // Navigation will be handled by the component
    window.location.href = '/login'; // Simple redirect
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 