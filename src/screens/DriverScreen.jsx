import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import ReportHistory from '../components/ReportHistory';

const DriverScreen = () => {
  const [activeTab, setActiveTab] = useState('form');
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Top Header Bar */}
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--text-main)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <circle cx="17" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
              </svg>
            </div>
            <span style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>TaxiTracker</span>
            <span style={{ color: 'var(--border-color)', fontSize: '1rem', margin: '0 0.125rem' }}>/</span>
            <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>Conductor</span>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Salir
          </button>
        </div>
      </header>

      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.025em', marginBottom: '0.25rem' }}>Panel de Conductor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Control diario de ingresos y gastos</p>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Nuevo Reporte
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
        </div>

        {/* Tab Content */}
        <main>
          {activeTab === 'form' && (
            <div className="fade-in">
              <ReportForm />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="fade-in">
              <ReportHistory />
            </div>
          )}
        </main>

        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <p>© {new Date().getFullYear()} TaxiTracker</p>
        </footer>
      </div>
    </div>
  );
};

export default DriverScreen;
