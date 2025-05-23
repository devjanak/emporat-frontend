import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// Define GraphQL query with pagination and sorting
const GET_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int, $sort: EmployeeSortInput) {
    employees(page: $page, pageSize: $pageSize, sort: $sort) {
      employees {
        id
        name
        age
        class
        subjects
        attendance
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

// Column definitions
const columns = [
  { field: 'id', label: 'ID' },
  { field: 'name', label: 'Name' },
  { field: 'age', label: 'Age' },
  { field: 'class', label: 'Class' },
  { field: 'subjects', label: 'Subjects' },
  { field: 'attendance', label: 'Attendance' },
  { field: 'createdAt', label: 'Created At' },
  { field: 'updatedAt', label: 'Updated At' },
];

function EmployeeGridPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch employees with the current pagination and sorting
  const { loading, error, data } = useQuery(GET_EMPLOYEES, {
    variables: {
      page,
      pageSize,
      sort: {
        field: sortField,
        direction: sortDirection
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  // Handle sort click
  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  if (loading && !data) return <div className="flex justify-center p-8"><div className="text-emerald-600">Loading...</div></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-200">Error: {error.message}</div>;

  const employees = data?.employees.employees || [];
  const totalPages = data ? Math.ceil(data.employees.totalCount / pageSize) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Grid</h1>
        <p className="text-gray-600">Manage and view all employees</p>
      </div>
      
      <div className="table-container">
        <table className="table-emerald">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.field} 
                  scope="col"
                  className="cursor-pointer group"
                  onClick={() => handleSort(column.field)}
                >
                  <div className="flex items-center">
                    {column.label}
                    <span className="ml-1">
                      {sortField === column.field ? (
                        sortDirection === 'asc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="text-gray-900 font-medium">{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.class}</td>
                <td>{employee.subjects}</td>
                <td>{employee.attendance.toFixed(2)}</td>
                <td>
                  {new Date(employee.createdAt).toLocaleDateString()}
                </td>
                <td>
                  {new Date(employee.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing page {page} of {totalPages}
        </div>
        <div className="flex space-x-3">
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
    </div>
  );
}

export default EmployeeGridPage; 