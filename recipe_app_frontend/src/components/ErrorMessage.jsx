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
        background: 'rgba(239, 68, 68, 0.08)',
        color: 'var(--color-error)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: 12,
        margin: '12px 0',
      }}
    >
      <strong>Oops!</strong> {message}
    </div>
  );
}

export default ErrorMessage;
