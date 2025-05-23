import { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import EmployeeTile from '../components/EmployeeTile';
import PermissionButton from '../components/PermissionButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Define GraphQL query
const GET_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int) {
    employees(page: $page, pageSize: $pageSize) {
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

// Custom colors
const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#8B5CF6', '#EC4899'];

function HomePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4); // Show fewer tiles to make room for charts
  
  const { loading, error, data } = useQuery(GET_EMPLOYEES, {
    variables: { page, pageSize },
    fetchPolicy: 'cache-and-network',
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

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data?.employees?.employees) return [];
    
    return data.employees.employees.map(emp => ({
      name: emp.name,
      age: emp.age,
      attendance: emp.attendance
    }));
  }, [data]);

  // Prepare class distribution data for pie chart
  const classDistribution = useMemo(() => {
    if (!data?.employees?.employees) return [];
    
    const classCounts = {};
    data.employees.employees.forEach(emp => {
      if (!classCounts[emp.class]) {
        classCounts[emp.class] = 0;
      }
      classCounts[emp.class]++;
    });

    return Object.keys(classCounts).map(className => ({
      name: className,
      value: classCounts[className]
    }));
  }, [data]);
  
  // Calculate attendance distribution
  const attendanceDistribution = useMemo(() => {
    if (!data?.employees?.employees) return [];
    
    const ranges = [
      { name: '0-25%', range: [0, 25], count: 0 },
      { name: '26-50%', range: [26, 50], count: 0 },
      { name: '51-75%', range: [51, 75], count: 0 },
      { name: '76-90%', range: [76, 90], count: 0 },
      { name: '91-100%', range: [91, 100], count: 0 }
    ];
    
    data.employees.employees.forEach(emp => {
      const attendance = emp.attendance;
      for (const range of ranges) {
        if (attendance >= range.range[0] && attendance <= range.range[1]) {
          range.count++;
          break;
        }
      }
    });
    
    return ranges;
  }, [data]);

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
  const classesCount = new Set(employees.map(emp => emp.class)).size;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
          <p className="text-gray-600">Manage your employees in one place</p>
        </div>
        <PermissionButton requiredRole="ADMIN" hide>
          <Link to="/add" className="btn-primary">
            Add Employee
          </Link>
        </PermissionButton>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        
        <div className="card bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Classes</h3>
          <p className="text-2xl font-bold text-emerald-600">{classesCount}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Age Distribution */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Age & Attendance per Employee</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                <YAxis yAxisId="right" orientation="right" stroke="#6366F1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar yAxisId="left" dataKey="age" name="Age" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="right" dataKey="attendance" name="Attendance %" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
        
        {/* Pie Chart - Class Distribution */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Class Distribution</h3>
          {classDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Employee(s)`, "Count"]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
        
        {/* Bar Chart - Attendance Distribution */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Attendance Distribution</h3>
          {attendanceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={attendanceDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} Employee(s)`, "Count"]}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <Bar dataKey="count" name="Employee Count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
        
        {/* Line Chart - Future expansion here */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Recent Employee Activity</h3>
            <Link to="/employees/grid" className="text-emerald-600 text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {employees.slice(0, 5).map((emp, index) => (
              <div 
                key={emp.id} 
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium mr-3">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-500">Class: {emp.class}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {new Date(emp.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Employees */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Employees</h2>
          <Link to="/employees/tile" className="text-emerald-600 hover:underline">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Link to="/add" className="text-emerald-600 font-medium"> Add your first employee</Link>
              </PermissionButton>
            </div>
          )}
        </div>
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

export default HomePage; 