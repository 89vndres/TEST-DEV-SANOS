import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadows, transitions } from '../styles/theme';
import { API_BASE_URL } from '../services/api';

export default function MyOrders() {
  const { user, token } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadReportes();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const loadReportes = async () => {
    try {
      // Try to load user-specific reports first, fall back to all mascotas
      const res = await fetch(`${API_BASE_URL}/api/mascotas`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setReportes(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingTop: '100px', paddingBottom: '60px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ color: colors.primary, fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            📋 Mis Reportes
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '0.95rem', margin: '8px 0 0' }}>
            Historial de reportes de mascotas en la plataforma
          </p>
        </div>

        {reportes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 30px',
            backgroundColor: colors.white, borderRadius: radius.xl,
            boxShadow: shadows.sm, border: `1px solid ${colors.borderLight}`,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.4 }}>📭</div>
            <h4 style={{ color: colors.primary, fontWeight: '700' }}>Aún no hay reportes</h4>
            <p style={{ color: colors.textMuted }}>¡Publica tu primer reporte desde la página de inicio!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reportes.map(r => (
              <div key={r.id} style={{
                backgroundColor: colors.white, borderRadius: radius.lg,
                boxShadow: shadows.sm, border: `1px solid ${colors.borderLight}`,
                padding: '20px 24px', transition: transitions.fast,
                display: 'flex', gap: '16px', alignItems: 'center',
              }}>
                {r.foto_url && (
                  <img src={r.foto_url} alt="" style={{ width: 56, height: 56, borderRadius: radius.md, objectFit: 'cover', border: `2px solid ${colors.border}` }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, color: colors.primary, fontSize: '1rem', fontWeight: '700' }}>
                      {r.nombre || 'Sin nombre'} — {r.especie}
                    </h4>
                    <span className={`badge-status ${(r.estado || '').toLowerCase() === 'perdido' ? 'badge-perdido' : 'badge-encontrado'}`}>
                      {(r.estado || '').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={detailStyle}>📍 {r.ubicacion}</span>
                    <span style={detailStyle}>🎨 {r.color}</span>
                    <span style={detailStyle}>📏 {r.tamano}</span>
                    {r.raza && <span style={detailStyle}>🐾 {r.raza}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const detailStyle = {
  fontSize: '0.82rem',
  color: colors.textMuted,
  fontWeight: '500',
};
