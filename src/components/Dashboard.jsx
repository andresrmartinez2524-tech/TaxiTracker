import { useContext } from 'react';
import { TaxiContext } from '../context/TaxiContext';

const Dashboard = () => {
  const { reports } = useContext(TaxiContext);

  const totalIncome = reports
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalExpenses = reports
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Format currency (COP typical format)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ label, value, valueColor, borderColor }) => (
    <div style={{
      padding: '1.25rem',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-surface)',
      boxShadow: 'var(--shadow-sm)',
      borderLeft: `3px solid ${borderColor}`
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.375rem', fontWeight: '600', color: valueColor || 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="card glass-panel">
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.01em', margin: 0 }}>Resumen General</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '0.25rem 0.625rem', borderRadius: '999px' }}>
          {reports.length} reporte{reports.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-2">
        <MetricCard
          label="Ingresos Totales"
          value={formatMoney(totalIncome)}
          valueColor="var(--success)"
          borderColor="var(--success)"
        />
        <MetricCard
          label="Gastos Totales"
          value={formatMoney(totalExpenses)}
          valueColor="var(--danger)"
          borderColor="var(--danger)"
        />
      </div>
      <MetricCard
        label="Balance (Ganancia Neta)"
        value={formatMoney(balance)}
        valueColor={balance >= 0 ? 'var(--text-main)' : 'var(--danger)'}
        borderColor={balance >= 0 ? 'var(--border-color)' : 'var(--danger)'}
      />
    </div>
  );
};

export default Dashboard;
