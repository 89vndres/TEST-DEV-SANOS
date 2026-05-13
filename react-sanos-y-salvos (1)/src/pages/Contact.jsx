import { useState } from 'react';
import { colors, radius, shadows, transitions } from '../styles/theme';
import { API_BASE_URL } from '../services/api';

export default function Contact() {
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: (formData.get('name') || '').trim(),
      email: (formData.get('email') || '').trim(),
      telefono: (formData.get('phone') || '').trim(),
      asunto: (formData.get('subject') || '').trim(),
      mensaje: (formData.get('message') || '').trim()
    };

    const errs = [];
    if (!data.nombre) errs.push('El nombre es obligatorio');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.push('El correo debe ser válido');
    if (!data.mensaje) errs.push('El mensaje es obligatorio');
    setErrors(errs);

    if (errs.length === 0) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/mensajes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          setMsg('¡Mensaje enviado! Nos pondremos en contacto pronto.');
          e.target.reset();
        } else {
          setErrors(['Hubo un error al enviar el mensaje.']);
        }
      } catch (error) {
        setErrors(['Error de conexión con el servidor.']);
      }
    } else {
      setMsg('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: colors.bg,
      paddingTop: '100px', paddingBottom: '60px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ color: colors.primary, fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            ✉️ Contáctanos
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.05rem', maxWidth: '500px', margin: '8px auto 0' }}>
            ¿Tienes dudas o sugerencias? Estamos aquí para ayudarte.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', alignItems: 'start' }}>
          {/* Contact Info */}
          <div style={{
            backgroundColor: colors.primary, borderRadius: radius.xl,
            padding: '36px 32px', color: 'white',
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '1.15rem', marginBottom: '28px' }}>Información de Contacto</h4>

            {[
              { icon: '📧', label: 'Email', value: 'contacto@sanosysalvos.cl' },
              { icon: '📞', label: 'Teléfono', value: '+56 2 2999 8877' },
              { icon: '📍', label: 'Ubicación', value: 'Santiago, Chile' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', opacity: 0.8, marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '0.95rem' }}>{item.value}</div>
                </div>
              </div>
            ))}

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.15)', margin: '24px 0' }} />

            <div>
              <h5 style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '12px' }}>Síguenos</h5>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['📷', '📘', '🐦'].map((icon, i) => (
                  <div key={i} style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '1.1rem', transition: transitions.fast,
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{
            backgroundColor: colors.white, borderRadius: radius.xl,
            padding: '36px', boxShadow: shadows.md, border: `1px solid ${colors.borderLight}`,
          }}>
            <h3 style={{ color: colors.primary, fontWeight: '700', fontSize: '1.15rem', marginBottom: '24px' }}>Envíanos un mensaje</h3>

            {msg && (
              <div style={{ padding: '12px 16px', backgroundColor: colors.successLight, color: '#27ae60', borderRadius: radius.md, fontSize: '0.9rem', fontWeight: '500', marginBottom: '20px' }}>
                {msg}
              </div>
            )}
            {errors.length > 0 && (
              <div style={{ padding: '12px 16px', backgroundColor: colors.dangerLight, color: colors.danger, borderRadius: radius.md, fontSize: '0.9rem', fontWeight: '500', marginBottom: '20px' }}>
                {errors.join('. ')}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Nombre Completo *</label>
                  <input name="name" placeholder="Juan Pérez" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="phone" placeholder="+56 9..." style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Correo Electrónico *</label>
                <input type="email" name="email" placeholder="tu@email.com" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Asunto</label>
                <input name="subject" placeholder="Consulta sobre..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mensaje *</label>
                <textarea rows={5} name="message" placeholder="Escribe tu mensaje aquí..." style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} required />
              </div>
              <button type="submit" style={{
                padding: '14px', backgroundColor: colors.primary, color: 'white',
                border: 'none', borderRadius: radius.md, fontWeight: '700',
                fontSize: '0.95rem', cursor: 'pointer', transition: transitions.fast,
                boxShadow: '0 4px 12px rgba(27,67,50,0.2)',
              }}>
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: '600',
  color: colors.textMuted, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.3px',
};

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: radius.md,
  border: `1.5px solid ${colors.border}`, fontSize: '0.95rem',
  backgroundColor: colors.white, color: colors.text,
  outline: 'none', transition: transitions.fast, boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};
