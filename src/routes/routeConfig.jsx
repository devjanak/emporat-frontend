import SidebarLayout from '../components/SidebarLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import HomePage from '../views/HomePage';
import LoginPage from '../views/LoginPage';
import SignupPage from '../views/SignupPage';
import AdminDashboard from '../views/AdminDashboard';
import UserDashboard from '../views/UserDashboard';
import AddEmployeePage from '../views/AddEmployeePage';
import EditEmployeePage from '../views/EditEmployeePage';
import EmployeeDetailPage from '../views/EmployeeDetailPage';
import EmployeeGridPage from '../views/EmployeeGridPage';
import EmployeeTilePage from '../views/EmployeeTilePage';
import NotFoundPage from '../views/NotFoundPage';

const routes = [
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  
  // Protected routes
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><HomePage /></ProtectedRoute>,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><UserDashboard /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
      },
      {
        path: 'add',
        element: <AdminRoute><AddEmployeePage /></AdminRoute>,
      },
      {
        path: 'edit/:id',
        element: <AdminRoute><EditEmployeePage /></AdminRoute>,
      },
      {
        path: 'details/:id',
        element: <ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>,
      },
      {
        path: 'employees/grid',
        element: <ProtectedRoute><EmployeeGridPage /></ProtectedRoute>,
      },
      {
        path: 'employees/tile',
        element: <ProtectedRoute><EmployeeTilePage /></ProtectedRoute>,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes; 