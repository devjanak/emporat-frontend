import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import EmployeeTile from '../components/EmployeeTile';
import PermissionButton from '../components/PermissionButton';
import Modal from '../components/Modal';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { GET_EMPLOYEES } from '../services/employeeQueries';
import toast from 'react-hot-toast';

// Define the delete mutation
const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
      success
    }
  }
`;

// Define the flag mutation
const FLAG_EMPLOYEE = gql`
  mutation FlagEmployee($id: ID!, $flagged: Boolean!) {
    flagEmployee(id: $id, flagged: $flagged) {
      id
      success
    }
  }
`;

function EmployeeTilePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8); // Show tiles in a grid
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  // Form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees with pagination
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page,
      pageSize,
      sort: {
        field: 'name',
        direction: 'asc'
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  // Delete mutation
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: (data) => {
      toast.success(`Employee deleted successfully!`);
      setShowDeleteModal(false);
      refetch(); // Refresh the list after deletion
    },
    onError: (error) => {
      toast.error(`Error deleting employee: ${error.message}`);
    }
  });

  // Flag mutation
  const [flagEmployee] = useMutation(FLAG_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Employee flagged successfully');
    },
    onError: (error) => {
      toast.error(`Error flagging employee: ${error.message}`);
    }
  });

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (data && page * pageSize < data.employees.totalCount) {
      setPage(page + 1);
    }
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (employeeToDelete) {
      const loadingToast = toast.loading('Deleting employee...');
      
      deleteEmployee({
        variables: { id: employeeToDelete.id },
        onCompleted: () => toast.dismiss(loadingToast),
        onError: () => toast.dismiss(loadingToast)
      });
    }
  };

  // Handle flag toggle
  const handleFlag = (employee) => {
    const loadingToast = toast.loading('Flagging employee...');
    
    flagEmployee({
      variables: { 
        id: employee.id,
        flagged: true // In a real app, you might toggle this value
      },
      onCompleted: () => toast.dismiss(loadingToast),
      onError: () => toast.dismiss(loadingToast)
    });
  };
  
  // Open form modal to add new employee
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowFormModal(true);
  };
  
  // Open form modal to edit an employee
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowFormModal(true);
  };
  
  // Close form modal and refresh data
  const handleFormModalClose = () => {
    setShowFormModal(false);
    setSelectedEmployee(null);
    refetch();
  };

  if (loading && !data) return <div className="flex justify-center p-8"><div className="text-emerald-600">Loading...</div></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-200">Error: {error.message}</div>;

  const employees = data?.employees.employees || [];
  const totalPages = data ? Math.ceil(data.employees.totalCount / pageSize) : 0;
  
  // Calculate statistics
  const totalEmployees = data?.employees.totalCount || 0;
  const avgAge = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length).toFixed(1) 
    : 0;
  const avgAttendance = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length).toFixed(1) + '%'
    : '0%';

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Tile View</h1>
          <p className="text-gray-600">View all employees in a tile layout</p>
        </div>
        
        <PermissionButton requiredRole="ADMIN">
          <button 
            onClick={handleAddEmployee}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Employee
          </button>
        </PermissionButton>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Employees</h3>
          <p className="text-2xl font-bold text-emerald-600">{totalEmployees}</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Avg Age</h3>
          <p className="text-2xl font-bold text-emerald-600">{avgAge}</p>
        </div>
        
        <div className="card bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Avg Attendance</h3>
          <p className="text-2xl font-bold text-emerald-600">{avgAttendance}</p>
        </div>
      </div>
      
      {/* View Options */}
      <div className="flex gap-2 mb-6">
        <Link to="/employees/tile" className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm shadow-sm">
          Tile View
        </Link>
        <Link to="/employees/grid" className="px-3 py-1 bg-white text-emerald-600 border border-emerald-600 rounded-lg text-sm shadow-sm">
          Grid View
        </Link>
        <Link to="/" className="px-3 py-1 bg-white text-gray-600 border border-gray-300 rounded-lg text-sm shadow-sm">
          Dashboard
        </Link>
      </div>
      
      {/* Employee Tiles - Same style as in the old HomePage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {employees.map((employee) => (
          <EmployeeTile key={employee.id} employee={employee} />
        ))}
        
        {employees.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl">
            No employees found. 
            <PermissionButton 
              requiredRole="ADMIN" 
              fallback=""
            >
              <button 
                onClick={handleAddEmployee}
                className="text-emerald-600 font-medium"
              >
                Add your first employee
              </button>
            </PermissionButton>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Showing page {page} of {totalPages}
        </div>
        <div className="flex space-x-3 w-full sm:w-auto justify-center order-1 sm:order-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className={`btn-secondary ${
              page <= 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={totalPages <= page}
            className={`btn-primary ${
              totalPages <= page ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        footer={
          <>
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="btn-error"
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete {employeeToDelete?.name}?</p>
        <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      </Modal>
      
      {/* Employee Form Modal */}
      {showFormModal && (
        <EmployeeFormModal
          employee={selectedEmployee}
          isOpen={showFormModal}
          onClose={handleFormModalClose}
        />
      )}
    </div>
  );
}

export default EmployeeTilePage; 