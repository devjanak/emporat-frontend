import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default toast options
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Custom toast styles by type
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            border: '1px solid #10B981',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            border: '1px solid #EF4444',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default ToastProvider; 