import { useContext, useState } from 'react';
import { TaxiContext } from '../context/TaxiContext';
import ConfirmModal from './ConfirmModal';

const ReportHistory = ({ isAdmin = false }) => {
  const { reports, deleteReport, updateReportStatus } = useContext(TaxiContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [clearedAt, setClearedAt] = useState(() => localStorage.getItem('driver_cleared_at'));
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirmar', confirmDanger: false });

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Borrar reporte',
      message: '¿Estás seguro de que deseas borrar este reporte? Esta acción es permanente y no se puede deshacer.',
      confirmText: 'Borrar',
      confirmDanger: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await deleteReport(id);
        } catch (error) {
          alert('Hubo un error al borrar el reporte.');
        }
      }
    });
  };

  const handleClearDriverHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpiar mi vista',
      message: 'Se ocultarán los reportes actuales de tu vista. El administrador aún podrá ver todo el historial.',
      confirmText: 'Limpiar',
      confirmDanger: false,
      onConfirm: () => {
        const now = new Date().toISOString();
        localStorage.setItem('driver_cleared_at', now);
        setClearedAt(now);
        closeConfirm();
      }
    });
  };


  const TypeBadge = ({ type }) => (
    <span style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.2rem 0.6rem', 
      borderRadius: '4px', 
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)',
      color: type === 'income' ? 'var(--success)' : 'var(--danger)',
      border: `1px solid ${type === 'income' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
    }}>
      {type === 'income' ? 'Ingreso' : 'Gasto'}
    </span>
  );

  const StatusBadge = ({ status }) => {
    let bg = 'rgba(245, 158, 11, 0.1)';
    let color = '#f59e0b';
    let text = 'En revisión de comprobante';
    
    if (status === 'approved') {
      bg = 'var(--success-bg)';
      color = 'var(--success)';
      text = 'Aprobado';
    } else if (status === 'rejected') {
      bg = 'var(--danger-bg)';
      color = 'var(--danger)';
      text = 'No aprobado';
    }
    
    return (
      <span style={{ 
        display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', 
        borderRadius: '4px', fontSize: '0.6875rem', fontWeight: '500', 
        backgroundColor: bg, color: color, border: `1px solid ${color}40`,
        whiteSpace: 'nowrap'
      }}>
        {text}
      </span>
    );
  };

  const visibleReports = isAdmin 
    ? reports 
    : reports.filter(r => !clearedAt || new Date(r.createdAt) > new Date(clearedAt));

  if (visibleReports.length === 0) {
    return (
      <div className="card glass-panel text-center">
        <p className="subtitle">No hay reportes registrados aún.</p>
        {!isAdmin && reports.length > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Los reportes anteriores han sido ocultados de tu vista.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.01em', margin: 0 }}>Historial de Reportes</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!isAdmin && (
              <button 
                onClick={handleClearDriverHistory}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'transparent' }}
              >
                Limpiar mi vista
              </button>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '0.25rem 0.625rem', borderRadius: '999px' }}>
              {visibleReports.length} reporte{visibleReports.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Desktop Table (hidden on mobile) */}
        <div className="history-table">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
                <th style={{ padding: '0.625rem 1.5rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Día / Fecha</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo y Estado</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Foto</th>
                {isAdmin && <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {visibleReports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{report.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                      {formatDate(report.createdAt)}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.375rem' }}>
                      <TypeBadge type={report.type} />
                      <StatusBadge status={report.status} />
                    </div>
                    {report.description && (
                      <div style={{ fontSize: '0.75rem', marginTop: '0.375rem', color: 'var(--text-muted)' }}>
                        {report.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {formatMoney(report.amount)}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {report.image ? (
                      <button onClick={() => setSelectedImage(report.image)} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
                        Ver foto
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>—</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {report.status !== 'approved' && (
                          <button onClick={() => updateReportStatus(report.id, 'approved')} className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem', fontSize: '0.75rem', color: 'var(--success)' }}>
                            Aprobar
                          </button>
                        )}
                        {report.status !== 'rejected' && (
                          <button onClick={() => updateReportStatus(report.id, 'rejected')} className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
                            Rechazar
                          </button>
                        )}
                        <button onClick={() => handleDelete(report.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.5rem', fontSize: '0.75rem' }}>
                          Borrar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (hidden on desktop) */}
        <div className="history-cards">
          {visibleReports.map((report) => (
            <div key={report.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.625rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.125rem' }}>{report.date}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(report.createdAt)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: report.type === 'income' ? 'var(--success)' : 'var(--danger)', marginBottom: '0.25rem' }}>
                    {report.type === 'income' ? '+' : '-'}{formatMoney(report.amount)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
                    <TypeBadge type={report.type} />
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              </div>
              {report.description && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>{report.description}</div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {report.image && (
                  <button onClick={() => setSelectedImage(report.image)} className="btn btn-secondary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}>
                    Ver foto
                  </button>
                )}
                {isAdmin && (
                  <>
                    {report.status !== 'approved' && (
                      <button onClick={() => updateReportStatus(report.id, 'approved')} className="btn btn-secondary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', color: 'var(--success)' }}>
                        Aprobar
                      </button>
                    )}
                    {report.status !== 'rejected' && (
                      <button onClick={() => updateReportStatus(report.id, 'rejected')} className="btn btn-secondary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', color: 'var(--danger)' }}>
                        Rechazar
                      </button>
                    )}
                    <button onClick={() => handleDelete(report.id)} className="btn btn-danger" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}>
                      Borrar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para ver imagen */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-0.75rem',
                right: '-0.75rem',
                background: 'var(--text-main)',
                color: 'var(--bg-color)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.875rem',
                fontWeight: '600',
                zIndex: 51
              }}
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="Comprobante ampliado" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmDanger={confirmModal.confirmDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
};

export default ReportHistory;


