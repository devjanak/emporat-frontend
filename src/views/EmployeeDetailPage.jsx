import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMPLOYEE, DELETE_EMPLOYEE, GET_EMPLOYEES } from '../services/employeeQueries';
import { useNavigate } from 'react-router-dom';
import PermissionButton from '../components/PermissionButton';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const employeeId = parseInt(id, 10);
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_EMPLOYEE, {
    variables: { id: employeeId },
  });
  
  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    variables: { id: employeeId },
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => navigate('/'),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee();
    }
  };

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

  if (!data.employee) return (
    <div className="alert alert-warning shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Employee not found with ID: {id}</span>
      </div>
    </div>
  );

  const { employee } = data;
  const createdDate = new Date(employee.createdAt).toLocaleDateString();
  const updatedDate = new Date(employee.updatedAt).toLocaleDateString();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Details</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">{employee.name}</h2>
          
          <div className="stats shadow mt-4">
            <div className="stat">
              <div className="stat-title">Age</div>
              <div className="stat-value">{employee.age}</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Class</div>
              <div className="stat-value">{employee.class}</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Attendance</div>
              <div className="stat-value">{employee.attendance.toFixed(1)}%</div>
              <div className="stat-desc">
                <progress 
                  className="progress progress-success" 
                  value={employee.attendance} 
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {employee.subjects.split(',').map((subject, index) => (
                <div key={index} className="badge badge-primary badge-lg">{subject.trim()}</div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Created: {createdDate}</p>
            <p>Last Updated: {updatedDate}</p>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <PermissionButton 
              requiredRole="ADMIN"
              hide
            >
              <Link to={`/edit/${employee.id}`} className="btn btn-info">Edit</Link>
            </PermissionButton>
            
            <PermissionButton 
              requiredRole="ADMIN"
              hide
            >
              <button 
                className={`btn btn-error ${deleteLoading ? 'loading' : ''}`}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                Delete
              </button>
            </PermissionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage; 