import { useState, useContext } from 'react';
import { TaxiContext } from '../context/TaxiContext';

const ReportForm = () => {
  const { addReport } = useContext(TaxiContext);
  
  const [formData, setFormData] = useState({
    date: '',
    type: 'income',
    amount: '',
    description: '',
    imageFile: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Array of days for the dropdown
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.amount || (!formData.imageFile && formData.type === 'income')) {
      alert('Por favor completa todos los campos requeridos y sube el comprobante.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReport(formData);
      
      // Reset form
      setFormData({
        date: '',
        type: 'income',
        amount: '',
        description: '',
        imageFile: null
      });
      setPreviewUrl(null);
      alert('Reporte enviado con éxito');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card glass-panel">
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.01em', margin: 0 }}>Nuevo Reporte</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Fecha del Reporte</label>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', margin: '0 -1rem', padding: '0 1rem' }} className="hide-scrollbar">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const dateValue = d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' });
              const isSelected = formData.date === dateValue;
              
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, date: dateValue }))}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1px solid var(--text-main)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--text-main)' : 'var(--bg-surface)',
                    color: isSelected ? 'var(--text-inverse)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '68px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', textTransform: 'capitalize', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : d.toLocaleDateString('es-CO', { weekday: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '600', letterSpacing: '-0.02em' }}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
          {!formData.date && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Selecciona una fecha</p>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Tipo de Reporte</label>
          <select name="type" value={formData.type} onChange={handleChange} className="form-control" required>
            <option value="income">Ingreso (Envío de Dinero)</option>
            <option value="expense">Gasto (Arreglo/Taller)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Monto (COP)</label>
          <input
            type="text"
            inputMode="numeric"
            name="amount"
            value={formData.amount ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(formData.amount) : ''}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, amount: rawValue }));
            }}
            placeholder="Ej: $ 90.000"
            className="form-control"
            required
          />
        </div>

        {formData.type === 'expense' && (
          <div className="form-group">
            <label className="form-label">Descripción del Gasto (Opcional)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Cambio de aceite"
              className="form-control"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Foto del Comprobante / Recibo</label>
          <div className="file-upload-wrapper">
            <button type="button" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {previewUrl ? 'Cambiar Foto' : 'Subir o Tomar Foto'}
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              capture="environment" /* Abre la cámara en móviles */
            />
          </div>
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="image-preview" />
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
