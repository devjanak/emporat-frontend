import { useEffect, useRef } from 'react';

/**
 * Modal Component
 * 
 * A reusable modal component following the Empora Admin theme guidelines
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' // sm, md, lg, xl
}) => {
  const modalRef = useRef(null);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Close when clicking outside the modal content
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  // Determine modal width based on size prop
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  return (
    <div className="modal modal-open">
      <div className="modal-box" ref={modalRef}>
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle"
          >
            ✕
          </button>
        </div>
        
        {/* Modal Body */}
        <div>
          {children}
        </div>
        
        {/* Modal Footer */}
        {footer && (
          <div className="modal-action">
            {footer}
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default Modal; 