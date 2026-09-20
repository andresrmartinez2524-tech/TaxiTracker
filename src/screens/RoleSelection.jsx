import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // SHA-256 hash de 't4x1admin2524'
  const TARGET_HASH = 'd304824825d12741858c32550e7bb451da39d0d443caaa046e573999f36d8890';

  const handleAdminClick = () => {
    setShowModal(true);
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (hashHex === TARGET_HASH) {
      sessionStorage.setItem('isAdminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      setPassword('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'var(--text-main)', borderRadius: '10px', marginBottom: '1.25rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>TaxiTracker</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Selecciona tu rol para continuar</p>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/driver')}
            style={{
              width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
              cursor: 'pointer', transition: 'var(--transition)',
              display: 'flex', alignItems: 'center', gap: '1rem',
              textAlign: 'left', boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <circle cx="17" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Soy Conductor</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>Registra ingresos y gastos diarios</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-muted)' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <button
            onClick={handleAdminClick}
            style={{
              width: '100%', padding: '1rem 1.25rem', background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
              cursor: 'pointer', transition: 'var(--transition)',
              display: 'flex', alignItems: 'center', gap: '1rem',
              textAlign: 'left', boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Soy Administrador</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>Revisa reportes y estadísticas</div>
            </div>
            <svg style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-muted)' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2.5rem' }}>
          © {new Date().getFullYear()} TaxiTracker
        </p>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Acceso de Administrador
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Ingresa la contraseña para acceder al panel.
            </p>
            
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Contraseña"
                  style={{
                    width: '100%', padding: '0.75rem 1rem',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)', color: 'var(--text-main)',
                    fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
                  }}
                  autoFocus
                />
                {error && <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>{error}</p>}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.625rem 1.25rem', background: 'transparent',
                    color: 'var(--text-muted)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.625rem 1.25rem', background: 'var(--text-main)',
                    color: 'var(--bg-color)', border: 'none', fontWeight: '500',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
                  }}
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
