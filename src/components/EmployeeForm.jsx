import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from '../services/employeeQueries';

const EmployeeForm = ({ employee }) => {
  const navigate = useNavigate();
  const isEditMode = !!employee;
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    subjects: '',
    attendance: '',
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: employee.name,
        age: employee.age.toString(),
        class: employee.class,
        subjects: employee.subjects,
        attendance: employee.attendance.toString(),
      });
    }
  }, [employee, isEditMode]);

  const [createEmployee, { loading: createLoading }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => navigate('/'),
  });

  const [updateEmployee, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => navigate('/'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const employeeData = {
      name: formData.name,
      age: parseInt(formData.age, 10),
      class: formData.class,
      subjects: formData.subjects,
      attendance: parseFloat(formData.attendance),
    };

    if (isEditMode) {
      updateEmployee({
        variables: {
          id: employee.id,
          ...employeeData,
        },
      });
    } else {
      createEmployee({
        variables: employeeData,
      });
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name" 
              className="input input-bordered" 
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Age</span>
            </label>
            <input 
              type="number" 
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age" 
              className="input input-bordered" 
              required 
              min="18"
              max="65"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Class</span>
            </label>
            <input 
              type="text" 
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="Enter class" 
              className="input input-bordered" 
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subjects</span>
            </label>
            <input 
              type="text" 
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="Enter subjects (comma separated)" 
              className="input input-bordered" 
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Attendance (%)</span>
            </label>
            <input 
              type="number" 
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              placeholder="Enter attendance percentage" 
              className="input input-bordered" 
              required 
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isEditMode ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm; 