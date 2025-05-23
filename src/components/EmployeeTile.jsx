import { useState } from 'react';
import { Link } from 'react-router-dom';
import PermissionButton from './PermissionButton';
import Modal from './Modal';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEE_DETAILS } from '../services/employeeQueries';

/**
 * Employee Tile Component
 * 
 * Displays an employee card in a grid layout with the Empora Admin theme
 */
const EmployeeTile = ({ employee }) => {
  const { id, name, age, class: className, subjects, attendance } = employee;
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Get detailed employee data when the modal is shown
  const { loading, error, data } = useQuery(GET_EMPLOYEE_DETAILS, {
    variables: { id },
    skip: !showDetailsModal, // Only fetch data when modal is open
  });
  
  // Calculate attendance color based on value
  const getAttendanceColorClass = (attendance) => {
    if (attendance >= 90) return 'text-green-500';
    if (attendance >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <div 
        className="card hover:scale-105 transition-transform duration-200 cursor-pointer p-4 rounded-xl"
        onClick={() => setShowDetailsModal(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            ID: {id}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Age:</span>
            <span className="font-medium">{age}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Class:</span>
            <span className="font-medium">{className}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Subjects:</span>
            <span className="font-medium">{subjects}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Attendance:</span>
            <span className={`font-medium ${getAttendanceColorClass(attendance)}`}>
              {attendance.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
          <Link 
            to={`/details/${id}`}
            className="btn btn-sm btn-secondary"
          >
            View
          </Link>
          <PermissionButton 
            requiredRole="ADMIN"
            hide
          >
            <Link 
              to={`/edit/${id}`}
              className="btn btn-sm btn-primary"
            >
              Edit
            </Link>
          </PermissionButton>
        </div>
      </div>

      {/* Employee Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Employee Details"
        size="lg"
        footer={
          <>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
            <PermissionButton requiredRole="ADMIN" hide>
              <Link 
                to={`/edit/${id}`}
                className="btn btn-primary"
                onClick={() => setShowDetailsModal(false)}
              >
                Edit
              </Link>
            </PermissionButton>
          </>
        }
      >
        {loading && (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            <span>Error loading employee details</span>
          </div>
        )}
        
        {data?.employee && (
          <div>
            <div className="stats shadow w-full mb-4">
              <div className="stat">
                <div className="stat-title">Age</div>
                <div className="stat-value">{data.employee.age}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Class</div>
                <div className="stat-value">{data.employee.class}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Attendance</div>
                <div className="stat-value">{data.employee.attendance.toFixed(1)}%</div>
                <div className="stat-desc">
                  <progress 
                    className="progress progress-success" 
                    value={data.employee.attendance} 
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {data.employee.subjects.split(',').map((subject, index) => (
                  <div key={index} className="badge badge-primary badge-lg">{subject.trim()}</div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-2">
              <p>ID: {data.employee.id}</p>
              <p>Created: {new Date(data.employee.createdAt).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(data.employee.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EmployeeTile; 