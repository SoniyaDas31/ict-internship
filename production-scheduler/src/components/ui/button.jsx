import React from 'react';

export function Button({ variant = 'default', className, children, ...props }) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 hover:bg-gray-50'
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}