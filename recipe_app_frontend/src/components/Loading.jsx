import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loading shows a simple loading indicator.
 * Props:
 * - text?: string
 */
function Loading({ text = 'Loading...' }) {
  return (
    <div role="status" aria-live="polite" style={{ padding: '24px 8px', textAlign: 'center' }}>
      <div aria-hidden style={{ fontSize: 22, marginBottom: 8 }}>⏳</div>
      <span>{text}</span>
    </div>
  );
}

export default Loading;
