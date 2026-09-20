const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', confirmDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '380px', border: '1px solid var(--border-color)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1.125rem', background: 'transparent',
              color: 'var(--text-muted)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.125rem',
              background: confirmDanger ? 'var(--danger)' : 'var(--text-main)',
              color: confirmDanger ? '#fff' : 'var(--bg-color)',
              border: 'none', fontWeight: '500',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
