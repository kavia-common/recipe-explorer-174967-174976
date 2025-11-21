import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmptyState displays a friendly message when there is nothing to show.
 * Props:
 * - title: string
 * - description?: string
 * - action?: ReactNode
 */
function EmptyState({ title, description, action }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '40px 16px',
        border: '1px dashed var(--border-color)',
        borderRadius: 12,
        background: 'linear-gradient(180deg, rgba(37,99,235,0.04), rgba(255,255,255,0.9))',
      }}
    >
      <div aria-hidden style={{ fontSize: 36, marginBottom: 8 }}>🍳</div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {description ? (
        <p style={{ marginTop: 8, color: '#6b7280' }}>{description}</p>
      ) : null}
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

export default EmptyState;
