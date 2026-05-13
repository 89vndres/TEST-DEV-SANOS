import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadows, transitions } from '../styles/theme';
import { API_BASE_URL, getAuthHeaders } from '../services/api';

export default function UserProfile() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [msg, setMsg] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user]);

  const fetchData = async () => {
    const headers = getAuthHeaders();
    const safeRequest = async (url) => {
      try { const res = await fetch(url, { headers }); if (!res.ok) return []; return await res.json(); } catch { return []; }
    };
    const dataDir = await safeRequest(`${API_BASE_URL}/api/direcciones?email=${user.email}`);
    setDirecciones(Array.isArray(dataDir) ? dataDir : []);
    const dataTickets = await safeRequest(`${API_BASE_URL}/api/soporte/usuario/${encodeURIComponent(user.email)}`);
    setTickets(Array.isArray(dataTickets) ? dataTickets : []);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { usuario_email: user.email, alias: fd.get('alias'), direccion: fd.get('direccion'), ciudad: fd.get('ciudad') };
    await fetch(`${API_BASE_URL}/api/direcciones`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) });
    e.target.reset(); fetchData(); setMsg('Dirección guardada');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { usuario_email: user.email, tipo_problema: fd.get('tipo'), detalle: fd.get('detalle') };
    await fetch(`${API_BASE_URL}/api/soporte`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) });
    e.target.reset(); fetchData(); setMsg('Ticket creado');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("¿Eliminar?")) return;
    const endpoint = type === 'direcciones' ? 'direcciones' : 'soporte';
    await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    fetchData();
  };

  const sidebarItems = [
    { key: 'personal', label: 'Datos Personales', icon: '👤' },
    { key: 'addresses', label: 'Direcciones', icon: '📍' },
    { key: 'support', label: 'Soporte', icon: '🎧' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingTop: '100px', paddingBottom: '60px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ color: colors.primary, fontSize: '2rem', fontWeight: '800' }}>👤 Mi Perfil</h2>
          <p style={{ color: colors.textMuted, fontSize: '0.95rem' }}>Gestiona tu información personal</p>
        </div>

        {msg && (
          <div style={{ padding: '12px 20px', backgroundColor: colors.successLight, color: '#27ae60', borderRadius: radius.md, marginBottom: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
            ✅ {msg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Sidebar */}
          <div style={{ backgroundColor: colors.white, borderRadius: radius.xl, boxShadow: shadows.sm, border: `1px solid ${colors.borderLight}`, padding: '16px 10px' }}>
            <div style={{ textAlign: 'center', padding: '16px 0 20px', borderBottom: `1px solid ${colors.border}`, marginBottom: '12px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.5rem', color: colors.primary, fontWeight: '800' }}>
                {(user?.email || '?')[0].toUpperCase()}
              </div>
              <p style={{ fontWeight: '600', color: colors.primary, fontSize: '0.9rem', margin: 0 }}>{user?.email}</p>
              <p style={{ color: colors.textMuted, fontSize: '0.78rem', margin: '4px 0 0', textTransform: 'capitalize' }}>{user?.role || 'usuario'}</p>
            </div>
            {sidebarItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {activeTab === 'personal' && (
              <div style={cardStyle}>
                <h4 style={cardTitleStyle}>Información Personal</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {user?.nombre && <FieldDisplay label="Nombre" value={user.nombre} />}
                  <FieldDisplay label="Correo Electrónico" value={user?.email} />
                  <FieldDisplay label="Rol" value={user?.role} />
                </div>
                <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginTop: '20px', padding: '12px 16px', backgroundColor: colors.bgAlt, borderRadius: radius.md }}>
                  ℹ️ Los datos de tu cuenta son gestionados por el administrador del sistema.
                </p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <>
                <div style={cardStyle}>
                  <h4 style={cardTitleStyle}>Nueva Dirección</h4>
                  <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input name="alias" placeholder="Alias (Ej: Casa)" required style={inputStyle} />
                      <input name="ciudad" placeholder="Ciudad" required style={inputStyle} />
                    </div>
                    <input name="direccion" placeholder="Calle y número" required style={inputStyle} />
                    <button type="submit" style={submitBtn}>Guardar Dirección</button>
                  </form>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {direcciones.length === 0 && <p style={{ color: colors.textMuted, textAlign: 'center', padding: '20px' }}>No tienes direcciones guardadas.</p>}
                  {direcciones.map(d => (
                    <div key={d.id} style={{ ...cardStyle, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '700', color: colors.primary }}>{d.alias}</span>
                        <span style={{ color: colors.textMuted }}> — {d.direccion}, {d.ciudad}</span>
                      </div>
                      <button onClick={() => handleDelete(d.id, 'direcciones')} style={delBtn}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'support' && (
              <>
                <div style={cardStyle}>
                  <h4 style={cardTitleStyle}>🎧 Solicitar Soporte</h4>
                  <form onSubmit={handleSupport} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select name="tipo" style={inputStyle}>
                      <option>Reporte no publicado</option>
                      <option>Problema con la cuenta</option>
                      <option>Sugerencia</option>
                      <option>Otro</option>
                    </select>
                    <textarea name="detalle" rows={3} placeholder="Describe tu problema..." required style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} />
                    <button type="submit" style={submitBtn}>Enviar Ticket</button>
                  </form>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <h5 style={{ color: colors.primary, fontWeight: '700', marginBottom: '12px' }}>Mis Tickets</h5>
                  {tickets.length === 0 && <p style={{ color: colors.textMuted }}>No tienes tickets activos.</p>}
                  {tickets.map(t => (
                    <div key={t.id} style={{ ...cardStyle, padding: '14px 20px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: colors.text }}>{t.tipo_problema}</span>
                        <span className={`badge-status ${t.estado === 'Resuelto' ? 'badge-encontrado' : 'badge-user'}`}>{t.estado || 'Pendiente'}</span>
                      </div>
                      <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '6px 0 0' }}>{t.detalle}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldDisplay({ label, value }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
      <div style={{ padding: '10px 14px', backgroundColor: colors.bgAlt, borderRadius: radius.md, color: colors.text, fontWeight: '500', fontSize: '0.95rem', textTransform: 'capitalize' }}>{value || '—'}</div>
    </div>
  );
}

const cardStyle = { backgroundColor: colors.white, borderRadius: radius.xl, boxShadow: shadows.sm, border: `1px solid ${colors.borderLight}`, padding: '24px' };
const cardTitleStyle = { color: colors.primary, fontWeight: '700', fontSize: '1.05rem', marginBottom: '18px' };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`, fontSize: '0.9rem', backgroundColor: colors.white, color: colors.text, outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" };
const submitBtn = { padding: '12px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: radius.md, fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: transitions.fast };
const delBtn = { background: 'none', border: 'none', color: colors.danger, fontWeight: '700', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' };
