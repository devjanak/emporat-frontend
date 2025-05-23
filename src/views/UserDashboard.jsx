import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

function UserDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.email}</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Employees</h3>
          <p className="text-2xl font-bold text-emerald-600">245</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">My Recent Views</h3>
          <p className="text-2xl font-bold text-emerald-600">28</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">System Status</h3>
          <p className="text-2xl font-bold text-green-500">Online</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">View Employees</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              Browse the list of employees in the system.
            </p>
            
            <Link 
              to="/"
              className="btn-primary inline-block"
            >
              View Employees
            </Link>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">Employee Grid View</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              View employees in a table format with sorting options.
            </p>
            
            <Link 
              to="/employees/grid"
              className="btn-primary inline-block"
            >
              Grid View
            </Link>
          </div>
        </div>
      </div>
      
      {/* User Note */}
      <div className="card bg-blue-50 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-1">Note</h3>
            <p className="text-sm text-gray-600">
              As a regular user, you can only view employee records. Contact an administrator if you need to make changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 