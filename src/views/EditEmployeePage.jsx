import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEE } from '../services/employeeQueries';
import EmployeeForm from '../components/EmployeeForm';

const EditEmployeePage = () => {
  const { id } = useParams();
  const employeeId = parseInt(id, 10);
  
  const { loading, error, data } = useQuery(GET_EMPLOYEE, {
    variables: { id: employeeId },
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      <EmployeeForm employee={data.employee} />
    </div>
  );
};

export default EditEmployeePage; 