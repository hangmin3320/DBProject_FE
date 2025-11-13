'use client';

import React from 'react';

// Update InputProps to accept multiline and work with both input and textarea
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, helperText, className, multiline, ...props }, ref) => {
    const hasError = !!error;
    const commonClasses = `
      w-full px-3 py-2 border rounded-md shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      ${hasError ? 'border-red-500' : 'border-gray-300'}
      ${className || ''}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {label}
          </label>
        )}
        
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={commonClasses}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            className={commonClasses}
          />
        )}

        {helperText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };