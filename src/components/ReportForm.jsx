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

  // Compresses image to max 1280px and 80% JPEG quality to avoid OOM on mobile
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const MAX_PX = 1280;
      const QUALITY = 0.8;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_PX || height > MAX_PX) {
            if (width > height) {
              height = Math.round((height * MAX_PX) / width);
              width = MAX_PX;
            } else {
              width = Math.round((width * MAX_PX) / height);
              height = MAX_PX;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
            'image/jpeg',
            QUALITY
          );
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setFormData(prev => ({ ...prev, imageFile: compressed }));
    setPreviewUrl(URL.createObjectURL(compressed));
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
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {/* Button 1: Camera */}
            <label style={{ flex: 1, position: 'relative', cursor: 'pointer' }}>
              <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Cámara
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>

            {/* Button 2: Gallery */}
            <label style={{ flex: 1, position: 'relative', cursor: 'pointer' }}>
              <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Galería
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>
          </div>

          {previewUrl && (
            <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ✓ Foto seleccionada
            </div>
          )}
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
