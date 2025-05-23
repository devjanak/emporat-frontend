import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from '../services/employeeQueries';
import { useAuth } from '../services/authContext';
import toast from 'react-hot-toast';

const EmployeeFormModal = ({ isOpen, onClose, employee = null }) => {
  const { isAdmin } = useAuth();
  const isEditMode = !!employee;
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    subjects: '',
    attendance: '',
  });

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrors({});
      
      if (isEditMode && employee) {
        setFormData({
          name: employee.name || '',
          age: employee.age ? employee.age.toString() : '',
          class: employee.class || '',
          subjects: employee.subjects || '',
          attendance: employee.attendance ? employee.attendance.toString() : '',
        });
      } else {
        // Reset form for adding new employee
        setFormData({
          name: '',
          age: '',
          class: '',
          subjects: '',
          attendance: '',
        });
      }
    }
  }, [isOpen, employee, isEditMode]);

  // Setup mutations
  const [createEmployee, { loading: createLoading }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: (data) => {
      toast.success(`Employee "${data.createEmployee.name}" created successfully!`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error creating employee: ${error.message}`);
      console.error('Create error:', error);
    }
  });

  const [updateEmployee, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: (data) => {
      toast.success(`Employee "${data.updateEmployee.name}" updated successfully!`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error updating employee: ${error.message}`);
      console.error('Update error:', error);
    }
  });

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        newErrors.age = 'Age must be between 18 and 65';
      }
    }
    
    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }
    
    if (!formData.subjects.trim()) {
      newErrors.subjects = 'At least one subject is required';
    }
    
    if (!formData.attendance) {
      newErrors.attendance = 'Attendance is required';
    } else {
      const attendanceNum = parseFloat(formData.attendance);
      if (isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
        newErrors.attendance = 'Attendance must be between 0 and 100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    // Check admin permissions
    if (!isAdmin()) {
      toast.error('Only administrators can add or edit employees');
      return;
    }
    
    const employeeData = {
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
      class: formData.class.trim(),
      subjects: formData.subjects.trim(),
      attendance: parseFloat(formData.attendance),
    };

    const loadingToast = toast.loading(
      isEditMode ? 'Updating employee...' : 'Creating employee...'
    );

    if (isEditMode && employee) {
      updateEmployee({
        variables: {
          id: employee.id,
          ...employeeData,
        },
        onCompleted: () => toast.dismiss(loadingToast),
        onError: () => toast.dismiss(loadingToast)
      });
    } else {
      createEmployee({
        variables: employeeData,
        onCompleted: () => toast.dismiss(loadingToast),
        onError: () => toast.dismiss(loadingToast)
      });
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Employee' : 'Add New Employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter employee name" 
            className={`input input-bordered w-full ${submitted && errors.name ? 'input-error' : ''}`}
          />
          {submitted && errors.name && (
            <div className="text-error text-sm mt-1">{errors.name}</div>
          )}
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
            placeholder="Enter employee age" 
            className={`input input-bordered w-full ${submitted && errors.age ? 'input-error' : ''}`}
            min="18"
            max="65"
          />
          {submitted && errors.age && (
            <div className="text-error text-sm mt-1">{errors.age}</div>
          )}
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
            placeholder="Enter employee class" 
            className={`input input-bordered w-full ${submitted && errors.class ? 'input-error' : ''}`}
          />
          {submitted && errors.class && (
            <div className="text-error text-sm mt-1">{errors.class}</div>
          )}
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
            className={`input input-bordered w-full ${submitted && errors.subjects ? 'input-error' : ''}`}
          />
          {submitted && errors.subjects && (
            <div className="text-error text-sm mt-1">{errors.subjects}</div>
          )}
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
            className={`input input-bordered w-full ${submitted && errors.attendance ? 'input-error' : ''}`}
            min="0"
            max="100"
            step="0.1"
          />
          {submitted && errors.attendance && (
            <div className="text-error text-sm mt-1">{errors.attendance}</div>
          )}
        </div>
        
        <div className="modal-action mt-6">
          <button 
            type="button" 
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isEditMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal; 