import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.email}</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Views</h3>
          <p className="text-2xl font-bold text-emerald-600">1,248</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Users</h3>
          <p className="text-2xl font-bold text-emerald-600">42</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase">New Employees</h3>
          <p className="text-2xl font-bold text-emerald-600">12</p>
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
              <h3 className="font-semibold text-lg text-gray-800">Manage Employees</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                Admin Only
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              View, create, update, and delete employee records.
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
              <h3 className="font-semibold text-lg text-gray-800">Add New Employee</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                Admin Only
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              Create a new employee record in the system.
            </p>
            
            <Link 
              to="/add"
              className="btn-primary inline-block"
            >
              Add Employee
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        <div className="card">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">New employee added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Employee record updated</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Monthly reports generated</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 