import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorMessage displays an error box.
 * Props:
 * - message: string
 */
function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{
        padding: 16,
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FECACA',
        borderRadius: 12,
        margin: '12px 0',
      }}
    >
      <strong>Oops!</strong> {message}
    </div>
  );
}

export default ErrorMessage;
