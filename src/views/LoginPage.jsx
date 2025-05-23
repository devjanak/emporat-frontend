import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      // Redirect based on role using window.location
      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="card max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-600 mb-1">Empora Admin</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 