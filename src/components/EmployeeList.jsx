import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_EMPLOYEES, GET_EMPLOYEE_DETAILS, DELETE_EMPLOYEE } from '../services/employeeQueries';
import Modal from './Modal';
import PermissionButton from './PermissionButton';
import EmployeeFormModal from './EmployeeFormModal';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES);
  
  // For fetching details of a specific employee when selected
  const { 
    loading: detailsLoading, 
    error: detailsError, 
    data: detailsData 
  } = useQuery(GET_EMPLOYEE_DETAILS, {
    variables: { id: selectedEmployee?.id },
    skip: !selectedEmployee,
  });
  
  // Delete mutation
  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Employee deleted successfully');
      setShowDeleteModal(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error deleting employee: ${error.message}`);
    }
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error.message}</span>
      </div>
    </div>
  );
  
  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };
  
  const closeModal = () => {
    setShowDetailsModal(false);
    // Optional: wait for modal animation to finish before clearing the selected employee
    setTimeout(() => setSelectedEmployee(null), 300);
  };
  
  // Handle adding a new employee
  const handleAddEmployee = () => {
    setEmployeeToEdit(null);
    setShowFormModal(true);
  };
  
  // Handle editing an employee
  const handleEditEmployee = (e, employee) => {
    e.stopPropagation(); // Prevent row click
    setEmployeeToEdit(employee);
    setShowFormModal(true);
  };
  
  // Handle deleting an employee
  const handleDeleteClick = (e, employee) => {
    e.stopPropagation(); // Prevent row click
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };
  
  // Confirm employee deletion
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
  
  // Close form modal and refresh data
  const handleFormModalClose = () => {
    setShowFormModal(false);
    setEmployeeToEdit(null);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Employee List</h2>
        
        <PermissionButton requiredRole="ADMIN">
          <button 
            onClick={handleAddEmployee}
            className="btn btn-primary btn-sm flex items-center gap-2 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Employee
          </button>
        </PermissionButton>
      </div>
    
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="hidden sm:table-cell">ID</th>
              <th>Name</th>
              <th className="hidden md:table-cell">Age</th>
              <th className="hidden md:table-cell">Class</th>
              <th className="hidden lg:table-cell">Subjects</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.employees.employees.map(employee => (
              <tr 
                key={employee.id} 
                className="hover cursor-pointer" 
                onClick={() => handleRowClick(employee)}
              >
                <td className="hidden sm:table-cell">{employee.id}</td>
                <td className="font-medium">{employee.name}</td>
                <td className="hidden md:table-cell">{employee.age}</td>
                <td className="hidden md:table-cell">{employee.class}</td>
                <td className="hidden lg:table-cell truncate max-w-xs">{employee.subjects}</td>
                <td>
                  <div className="radial-progress text-primary" style={{ "--value": employee.attendance }}>
                    {employee.attendance.toFixed(1)}%
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <PermissionButton requiredRole="ADMIN">
                      <button 
                        onClick={(e) => handleEditEmployee(e, employee)} 
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                    </PermissionButton>
                    <PermissionButton requiredRole="ADMIN">
                      <button 
                        onClick={(e) => handleDeleteClick(e, employee)} 
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </PermissionButton>
                    <Link to={`/details/${employee.id}`} className="btn btn-sm btn-primary">Details</Link>
                  </div>
                </td>
              </tr>
            ))}
            {data.employees.employees.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Employee Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={closeModal}
        title={selectedEmployee ? `${selectedEmployee.name} Details` : 'Employee Details'}
        size="lg"
        footer={
          <>
            <button 
              onClick={closeModal}
              className="btn btn-secondary"
            >
              Close
            </button>
            {selectedEmployee && (
              <Link 
                to={`/details/${selectedEmployee.id}`}
                className="btn btn-primary"
                onClick={closeModal}
              >
                View Full Page
              </Link>
            )}
          </>
        }
      >
        {detailsLoading && (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        
        {detailsError && (
          <div className="alert alert-error">
            <span>Error loading employee details</span>
          </div>
        )}
        
        {detailsData?.employee && (
          <div>
            <div className="stats shadow w-full mb-4 flex-col md:flex-row">
              <div className="stat">
                <div className="stat-title">Age</div>
                <div className="stat-value">{detailsData.employee.age}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Class</div>
                <div className="stat-value">{detailsData.employee.class}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Attendance</div>
                <div className="stat-value">{detailsData.employee.attendance.toFixed(1)}%</div>
                <div className="stat-desc">
                  <progress 
                    className="progress progress-success" 
                    value={detailsData.employee.attendance} 
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {detailsData.employee.subjects.split(',').map((subject, index) => (
                  <div key={index} className="badge badge-primary badge-lg">{subject.trim()}</div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-2">
              <p>ID: {detailsData.employee.id}</p>
              <p>Created: {new Date(detailsData.employee.createdAt).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(detailsData.employee.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete {employeeToDelete?.name}?</p>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="btn-danger bg-red-500 text-white hover:bg-red-600"
              disabled={deleteLoading}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Employee Form Modal */}
      <EmployeeFormModal 
        isOpen={showFormModal}
        onClose={handleFormModalClose}
        employee={employeeToEdit}
      />
    </div>
  );
};

export default EmployeeList;