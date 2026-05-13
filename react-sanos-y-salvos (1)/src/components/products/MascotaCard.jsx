import React from 'react';
import { colors, radius, shadows, transitions } from '../../styles/theme';

const MascotaCard = ({ mascota }) => {
  const isPerdido = (mascota.estado || '').toLowerCase() === 'perdido';

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: radius.xl,
      overflow: 'hidden',
      boxShadow: shadows.card,
      border: `1px solid ${colors.borderLight}`,
      display: 'flex',
      flexDirection: 'column',
      transition: transitions.normal,
      cursor: 'pointer',
    }}
    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = shadows.lg; }}
    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = shadows.card; }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={mascota.foto_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1280px-No-Image-Placeholder.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'}
          alt={mascota.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Status badge */}
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '5px 14px',
          backgroundColor: isPerdido ? colors.danger : colors.success,
          color: 'white', fontWeight: '700', borderRadius: radius.pill,
          fontSize: '0.75rem', letterSpacing: '0.3px', textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {isPerdido ? '¡PERDIDO!' : '¡ENCONTRADO!'}
        </span>
        {/* Species badge */}
        <span style={{
          position: 'absolute', bottom: '12px', left: '12px',
          padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: radius.pill, fontSize: '0.78rem', fontWeight: '600',
          color: colors.primary, backdropFilter: 'blur(4px)',
        }}>
          {mascota.especie === 'Perro' ? '🐕' : mascota.especie === 'Gato' ? '🐈' : '🐾'} {mascota.especie}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <h3 style={{ margin: 0, color: colors.primary, fontSize: '1.15rem', fontWeight: '700' }}>
          {mascota.nombre || 'Sin nombre'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
          <InfoRow icon="📍" label="Ubicación" value={mascota.ubicacion} />
          <InfoRow icon="🎨" label="Color" value={mascota.color} />
          <InfoRow icon="📏" label="Tamaño" value={mascota.tamano} />
          {mascota.edad && <InfoRow icon="🎂" label="Edad" value={mascota.edad} />}
        </div>

        {mascota.caracteristicas_distintivas && (
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: colors.textMuted, lineHeight: '1.4', backgroundColor: colors.bgAlt, padding: '8px 12px', borderRadius: radius.sm }}>
            {mascota.caracteristicas_distintivas}
          </p>
        )}

        <button style={{
          marginTop: 'auto', paddingTop: '12px',
          padding: '10px',
          backgroundColor: colors.primaryPale,
          color: colors.primary,
          border: `1.5px solid ${colors.primary}`,
          borderRadius: radius.md,
          fontWeight: '600', fontSize: '0.85rem',
          cursor: 'pointer',
          transition: transitions.fast,
        }}
        onMouseOver={(e) => { e.target.style.backgroundColor = colors.primary; e.target.style.color = '#fff'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = colors.primaryPale; e.target.style.color = colors.primary; }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <p style={{ margin: 0, color: colors.textMuted, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ fontSize: '0.8rem' }}>{icon}</span>
    <span style={{ fontWeight: '600', color: colors.text }}>{value || '—'}</span>
  </p>
);

export default MascotaCard;
