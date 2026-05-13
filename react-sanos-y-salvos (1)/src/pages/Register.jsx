import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { colors, radius, shadows, transitions } from '../styles/theme';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(nombre, email, pass);
    setLoading(false);
    if (result.success) {
      alert("¡Cuenta creada! Ya puedes iniciar sesión.");
      navigate('/login');
    } else {
      setError(result.error || 'Error al crear la cuenta.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif", padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', backgroundColor: colors.white,
        borderRadius: radius.xl, boxShadow: shadows.lg,
        border: `1px solid ${colors.borderLight}`, padding: '48px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🐾</div>
          <h2 style={{ color: colors.primary, fontWeight: '800', fontSize: '1.6rem', margin: '0 0 8px' }}>Crear Cuenta</h2>
          <p style={{ color: colors.textMuted, fontSize: '0.9rem', margin: 0 }}>Únete a Sanos y Salvos</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', backgroundColor: colors.dangerLight, color: colors.danger,
            borderRadius: radius.md, fontSize: '0.85rem', fontWeight: '500', marginBottom: '20px',
            border: `1px solid ${colors.danger}20`,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Nombre Completo</label>
            <input
              type="text" value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required placeholder="Juan Pérez"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password" value={pass}
              onChange={(e) => setPass(e.target.value)}
              required placeholder="••••••••"
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: '14px', backgroundColor: colors.primary, color: colors.white,
            border: 'none', borderRadius: radius.md, fontWeight: '700',
            fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer',
            transition: transitions.fast, boxShadow: '0 4px 12px rgba(27,67,50,0.2)',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/login" style={{ color: colors.accent, fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: '600',
  color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px',
};

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: radius.md,
  border: `1.5px solid ${colors.border}`, fontSize: '0.95rem',
  backgroundColor: colors.white, color: colors.text, outline: 'none', 
  transition: transitions.fast, boxSizing: 'border-box',
};