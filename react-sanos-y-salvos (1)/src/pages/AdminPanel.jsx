import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors, shadows, radius, inputStyle as themeInput, cardStyle as themeCard } from '../styles/theme';
import { API_BASE_URL } from '../services/api';

/* ══════════════════════════════════════════════════════════
   ADMIN PANEL — Sanos y Salvos
   Tabs: Dashboard · Mascotas · Usuarios · Mensajes · Config
   ══════════════════════════════════════════════════════════ */

const API = API_BASE_URL;

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'mascotas',  label: 'Mascotas',  icon: '🐾' },
  { key: 'usuarios',  label: 'Usuarios',  icon: '👥' },
  { key: 'mensajes',  label: 'Mensajes',  icon: '✉️' },
  { key: 'config',    label: 'Configuración', icon: '⚙️' },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  /* ── Protect route ── */
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  /* ── Render active section ── */
  const renderSection = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardSection getHeaders={getHeaders} />;
      case 'mascotas':  return <MascotasSection getHeaders={getHeaders} />;
      case 'usuarios':  return <UsuariosSection getHeaders={getHeaders} />;
      case 'mensajes':  return <MensajesSection getHeaders={getHeaders} />;
      case 'config':    return <ConfigSection getHeaders={getHeaders} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingTop: '80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '24px', gap: '24px' }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: '240px', flexShrink: 0,
          backgroundColor: colors.white,
          borderRadius: radius.xl,
          boxShadow: shadows.sm,
          border: `1px solid ${colors.borderLight}`,
          padding: '20px 12px',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🛡️</div>
            <h3 style={{ color: colors.primary, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Panel Admin</h3>
            <p style={{ color: colors.textMuted, fontSize: '0.75rem', margin: '4px 0 0' }}>{user?.email}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════ */
function DashboardSection({ getHeaders }) {
  const [stats, setStats] = useState({ mascotas: 0, perdidos: 0, encontrados: 0, usuarios: 0, mensajes: 0 });
  const [recentMascotas, setRecentMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [resMasc, resUsers, resMsgs] = await Promise.all([
        fetch(`${API}/api/mascotas`, { headers: getHeaders() }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API}/api/admin/usuarios`, { headers: getHeaders() }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API}/api/mensajes`, { headers: getHeaders() }).then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      const mascotas = Array.isArray(resMasc) ? resMasc : [];
      const users = Array.isArray(resUsers) ? resUsers : [];
      const msgs = Array.isArray(resMsgs) ? resMsgs : [];

      setStats({
        mascotas: mascotas.length,
        perdidos: mascotas.filter(m => (m.estado || '').toLowerCase() === 'perdido').length,
        encontrados: mascotas.filter(m => (m.estado || '').toLowerCase() === 'encontrado').length,
        usuarios: users.length,
        mensajes: msgs.length,
      });
      setRecentMascotas(mascotas.slice(-5).reverse());
    } catch (err) {
      console.error('Error loading stats:', err);
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Mascotas', value: stats.mascotas, icon: '🐾', cls: 'green' },
    { label: 'Perdidos', value: stats.perdidos, icon: '🔴', cls: 'red' },
    { label: 'Encontrados', value: stats.encontrados, icon: '🟢', cls: 'green' },
    { label: 'Usuarios', value: stats.usuarios, icon: '👥', cls: 'blue' },
    { label: 'Mensajes', value: stats.mensajes, icon: '✉️', cls: 'orange' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Resumen general de la plataforma" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: colors.textMuted, fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{s.label}</p>
                <h2 style={{ color: colors.primary, fontSize: '2rem', fontWeight: '800', margin: '6px 0 0' }}>{s.value}</h2>
              </div>
              <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ ...themeCard, padding: '24px' }}>
          <h4 style={{ color: colors.primary, fontWeight: '700', marginBottom: '20px', fontSize: '1rem' }}>📈 Distribución de Estados</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Perdidos', val: stats.perdidos, total: stats.mascotas || 1, color: colors.danger },
              { label: 'Encontrados', val: stats.encontrados, total: stats.mascotas || 1, color: colors.success },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.text }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: item.color }}>{item.val} ({Math.round(item.val / item.total * 100)}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: colors.bgAlt, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(item.val / item.total) * 100}%`, backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...themeCard, padding: '24px' }}>
          <h4 style={{ color: colors.primary, fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>🕐 Reportes Recientes</h4>
          {recentMascotas.length === 0 ? (
            <p style={{ color: colors.textMuted, fontSize: '0.9rem' }}>No hay reportes aún.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentMascotas.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: colors.bgAlt, borderRadius: radius.md }}>
                  <div>
                    <span style={{ fontWeight: '600', color: colors.text, fontSize: '0.9rem' }}>{m.nombre || 'Sin nombre'}</span>
                    <span style={{ color: colors.textMuted, fontSize: '0.8rem', marginLeft: '8px' }}>— {m.especie}</span>
                  </div>
                  <span className={`badge-status ${(m.estado || '').toLowerCase() === 'perdido' ? 'badge-perdido' : 'badge-encontrado'}`}>
                    {(m.estado || '').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MASCOTAS CRUD
   ═══════════════════════════════════════════════ */
function MascotasSection({ getHeaders }) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const emptyForm = { estado: 'perdido', especie: 'Perro', nombre: '', raza: '', color: '', ubicacion: '', edad: '', tamano: '', caracteristicas_distintivas: '', foto_url: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadMascotas(); }, []);

  const loadMascotas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/mascotas`, { headers: getHeaders() });
      if (res.ok) { const data = await res.json(); setMascotas(Array.isArray(data) ? data : []); }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return mascotas.filter(m => {
      const matchSearch = !search || (m.nombre || '').toLowerCase().includes(search.toLowerCase()) || (m.ubicacion || '').toLowerCase().includes(search.toLowerCase()) || (m.raza || '').toLowerCase().includes(search.toLowerCase());
      const matchEstado = !filterEstado || (m.estado || '').toLowerCase() === filterEstado.toLowerCase();
      return matchSearch && matchEstado;
    });
  }, [mascotas, search, filterEstado]);

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m) => { setEditItem(m); setForm({ ...m }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editItem;
      const url = isEdit ? `${API}/api/mascotas/${editItem.id}` : `${API}/api/mascotas`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      if (res.ok) { setShowModal(false); loadMascotas(); }
      else { alert('Error al guardar. Revisa los datos.'); }
    } catch (err) { alert('Error de conexión'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este reporte permanentemente?')) return;
    try {
      const res = await fetch(`${API}/api/mascotas/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) setMascotas(prev => prev.filter(m => m.id !== id));
      else alert('Error al eliminar');
    } catch (err) { alert('Error de conexión'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader title="Gestión de Mascotas" subtitle={`${mascotas.length} reportes registrados`} />

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Buscar por nombre, ubicación o raza..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...themeInput, maxWidth: '350px', padding: '10px 16px' }}
        />
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} style={{ ...themeInput, maxWidth: '180px', padding: '10px 16px' }}>
          <option value="">Todos los estados</option>
          <option value="perdido">Perdidos</option>
          <option value="encontrado">Encontrados</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={openCreate} style={greenBtn}>+ Nuevo Reporte</button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState text="No se encontraron mascotas" />
      ) : (
        <div style={{ ...themeCard, padding: 0, overflow: 'hidden' }}>
          <table className="table-unified" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th>Mascota</th><th>Especie</th><th>Ubicación</th><th>Estado</th><th>Color</th><th>Tamaño</th><th style={{ textAlign: 'center' }}>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {m.foto_url && <img src={m.foto_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.border}` }} />}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{m.nombre || 'Sin nombre'}</div>
                        <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>{m.raza || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{m.especie}</td>
                  <td>{m.ubicacion}</td>
                  <td><span className={`badge-status ${(m.estado || '').toLowerCase() === 'perdido' ? 'badge-perdido' : 'badge-encontrado'}`}>{(m.estado || '').toUpperCase()}</span></td>
                  <td>{m.color}</td>
                  <td>{m.tamano}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => openEdit(m)} style={iconBtn} title="Editar">✏️</button>
                    <button onClick={() => handleDelete(m.id)} style={{ ...iconBtn, color: colors.danger }} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClose={() => setShowModal(false)} title={editItem ? 'Editar Reporte' : 'Nuevo Reporte'}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Estado">
                <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={themeInput}>
                  <option value="perdido">Perdido</option>
                  <option value="encontrado">Encontrado</option>
                  <option value="en_adopcion">En Adopción</option>
                </select>
              </FormField>
              <FormField label="Especie">
                <select value={form.especie} onChange={e => setForm({ ...form, especie: e.target.value })} style={themeInput}>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
              </FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Nombre"><input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={themeInput} placeholder="Nombre de la mascota" /></FormField>
              <FormField label="Ubicación *"><input value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} style={themeInput} required placeholder="Ej: Maipú" /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Raza"><input value={form.raza} onChange={e => setForm({ ...form, raza: e.target.value })} style={themeInput} /></FormField>
              <FormField label="Color *"><input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={themeInput} required /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Edad"><input value={form.edad} onChange={e => setForm({ ...form, edad: e.target.value })} style={themeInput} placeholder="Ej: 2 años" /></FormField>
              <FormField label="Tamaño *"><input value={form.tamano} onChange={e => setForm({ ...form, tamano: e.target.value })} style={themeInput} required placeholder="Pequeño, Mediano..." /></FormField>
            </div>
            <FormField label="URL de Foto"><input value={form.foto_url} onChange={e => setForm({ ...form, foto_url: e.target.value })} style={themeInput} placeholder="https://i.pinimg.com/736x/26/9b/3a/269b3a8a4073fb65e7d2b45d0331ce05.jpg" /></FormField>
            <FormField label="Características Distintivas">
              <textarea value={form.caracteristicas_distintivas} onChange={e => setForm({ ...form, caracteristicas_distintivas: e.target.value })} style={{ ...themeInput, minHeight: '70px', resize: 'vertical' }} placeholder="Collar, cicatrices, comportamiento..." />
            </FormField>
            <button type="submit" style={{ ...greenBtn, width: '100%', padding: '14px', marginTop: '4px' }}>
              {editItem ? 'Guardar Cambios' : 'Crear Reporte'}
            </button>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   USUARIOS CRUD
   ═══════════════════════════════════════════════ */
function UsuariosSection({ getHeaders }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');

  const emptyForm = { email: '', password: '', nombre: '', role: 'user' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadUsuarios(); }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/usuarios`, { headers: getHeaders() });
      if (res.ok) { const data = await res.json(); setUsuarios(Array.isArray(data) ? data : []); }
      else { /* If endpoint doesn't exist, show demo data */
        setUsuarios([]);
      }
    } catch (err) { console.error(err); setUsuarios([]); }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return usuarios.filter(u =>
      !search || (u.email || '').toLowerCase().includes(search.toLowerCase()) || (u.nombre || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [usuarios, search]);

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (u) => { setEditItem(u); setForm({ ...u, password: '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editItem;
      const url = isEdit ? `${API}/api/admin/usuarios/${editItem.id}` : `${API}/api/admin/usuarios`;
      const method = isEdit ? 'PUT' : 'POST';
      const body = { ...form };
      if (isEdit && !body.password) delete body.password;
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { setShowModal(false); loadUsuarios(); }
      else {
        const errText = await res.text().catch(() => '');
        alert('Error al guardar: ' + (errText || 'Verifica los datos'));
      }
    } catch (err) { alert('Error de conexión con el servidor'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario permanentemente?')) return;
    try {
      const res = await fetch(`${API}/api/admin/usuarios/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) setUsuarios(prev => prev.filter(u => u.id !== id));
      else alert('Error al eliminar');
    } catch (err) { alert('Error de conexión'); }
  };

  const handleToggleRole = async (usuario) => {
    const newRole = (usuario.role === 'admin' || usuario.role === 'ADMIN') ? 'user' : 'admin';
    try {
      const res = await fetch(`${API}/api/admin/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...usuario, role: newRole })
      });
      if (res.ok) loadUsuarios();
    } catch (err) { alert('Error al cambiar rol'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader title="Gestión de Usuarios" subtitle={`${usuarios.length} usuarios registrados`} />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Buscar por email o nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...themeInput, maxWidth: '350px', padding: '10px 16px' }}
        />
        <div style={{ flex: 1 }} />
        <button onClick={openCreate} style={greenBtn}>+ Nuevo Usuario</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="No se encontraron usuarios. El endpoint /api/admin/usuarios debe estar implementado en el backend." />
      ) : (
        <div style={{ ...themeCard, padding: 0, overflow: 'hidden' }}>
          <table className="table-unified" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th>Usuario</th><th>Email</th><th>Rol</th><th style={{ textAlign: 'center' }}>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: colors.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, fontWeight: '700', fontSize: '0.85rem' }}>
                        {(u.nombre || u.email || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600' }}>{u.nombre || u.email}</span>
                    </div>
                  </td>
                  <td style={{ color: colors.textMuted }}>{u.email}</td>
                  <td>
                    <span className={`badge-status ${u.role === 'admin' || u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleToggleRole(u)} style={iconBtn} title="Cambiar Rol">🔄</button>
                    <button onClick={() => openEdit(u)} style={iconBtn} title="Editar">✏️</button>
                    <button onClick={() => handleDelete(u.id)} style={{ ...iconBtn, color: colors.danger }} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ModalOverlay onClose={() => setShowModal(false)} title={editItem ? 'Editar Usuario' : 'Nuevo Usuario'}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Nombre"><input value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} style={themeInput} placeholder="Nombre completo" /></FormField>
            <FormField label="Email *"><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={themeInput} required placeholder="correo@ejemplo.com" /></FormField>
            <FormField label={editItem ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}>
              <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} style={themeInput} {...(!editItem && { required: true })} placeholder="••••••••" />
            </FormField>
            <FormField label="Rol">
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={themeInput}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </FormField>
            <button type="submit" style={{ ...greenBtn, width: '100%', padding: '14px', marginTop: '4px' }}>
              {editItem ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MENSAJES
   ═══════════════════════════════════════════════ */
function MensajesSection({ getHeaders }) {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMensajes(); }, []);

  const loadMensajes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/mensajes`, { headers: getHeaders() });
      if (res.ok) { const data = await res.json(); setMensajes(Array.isArray(data) ? data : []); }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try {
      const res = await fetch(`${API}/api/mensajes/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) setMensajes(prev => prev.filter(m => m.id !== id));
    } catch (err) { alert('Error de conexión'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader title="Mensajes de Contacto" subtitle={`${mensajes.length} mensajes recibidos`} />

      {mensajes.length === 0 ? (
        <EmptyState text="No hay mensajes de contacto." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mensajes.map(m => (
            <div key={m.id} style={{ ...themeCard, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ color: colors.primary, fontWeight: '700', fontSize: '1rem', margin: 0 }}>{m.nombre || 'Anónimo'}</h4>
                  <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: '2px 0 0' }}>{m.email} {m.telefono && `· ${m.telefono}`}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {m.fecha && <span style={{ fontSize: '0.8rem', color: colors.textLight }}>{new Date(m.fecha).toLocaleDateString('es-CL')}</span>}
                  <button onClick={() => handleDelete(m.id)} style={{ ...iconBtn, color: colors.danger }}>🗑️</button>
                </div>
              </div>
              {m.asunto && <p style={{ fontWeight: '600', color: colors.text, margin: '0 0 6px', fontSize: '0.9rem' }}>Asunto: {m.asunto}</p>}
              <p style={{ color: colors.text, fontSize: '0.9rem', lineHeight: '1.5', margin: 0, backgroundColor: colors.bgAlt, padding: '12px 16px', borderRadius: radius.md }}>
                {m.mensaje}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════════════ */
function ConfigSection() {
  const [config, setConfig] = useState({
    siteName: 'Sanos y Salvos',
    siteDescription: 'Plataforma Inteligente para la localización y recuperación de mascotas perdidas',
    contactEmail: 'contacto@sanosysalvos.cl',
    contactPhone: '+56 2 2999 8877',
    address: 'Santiago, Chile',
    allowPublicReports: true,
    requireLogin: false,
    maxPhotosPerReport: 5,
    enableNotifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('siteConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('siteConfig');
    if (savedConfig) {
      try { setConfig(JSON.parse(savedConfig)); } catch (e) {}
    }
  }, []);

  return (
    <div>
      <SectionHeader title="Configuración del Sitio" subtitle="Ajustes generales de la plataforma" />

      {saved && (
        <div style={{ padding: '12px 20px', backgroundColor: colors.successLight, color: '#27ae60', borderRadius: radius.md, marginBottom: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
          ✅ Configuración guardada correctamente
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* General */}
          <div style={{ ...themeCard }}>
            <h4 style={{ color: colors.primary, fontWeight: '700', fontSize: '1rem', marginBottom: '18px' }}>🏷️ Información General</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormField label="Nombre del Sitio"><input value={config.siteName} onChange={e => setConfig({ ...config, siteName: e.target.value })} style={themeInput} /></FormField>
              <FormField label="Descripción"><textarea value={config.siteDescription} onChange={e => setConfig({ ...config, siteDescription: e.target.value })} style={{ ...themeInput, minHeight: '80px', resize: 'vertical' }} /></FormField>
            </div>
          </div>

          {/* Contact */}
          <div style={{ ...themeCard }}>
            <h4 style={{ color: colors.primary, fontWeight: '700', fontSize: '1rem', marginBottom: '18px' }}>📞 Datos de Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormField label="Email de Contacto"><input type="email" value={config.contactEmail} onChange={e => setConfig({ ...config, contactEmail: e.target.value })} style={themeInput} /></FormField>
              <FormField label="Teléfono"><input value={config.contactPhone} onChange={e => setConfig({ ...config, contactPhone: e.target.value })} style={themeInput} /></FormField>
              <FormField label="Dirección"><input value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} style={themeInput} /></FormField>
            </div>
          </div>

          {/* Features */}
          <div style={{ ...themeCard }}>
            <h4 style={{ color: colors.primary, fontWeight: '700', fontSize: '1rem', marginBottom: '18px' }}>🔧 Funcionalidades</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ToggleSwitch label="Permitir reportes públicos (sin login)" checked={config.allowPublicReports} onChange={v => setConfig({ ...config, allowPublicReports: v })} />
              <ToggleSwitch label="Requerir login para ver reportes" checked={config.requireLogin} onChange={v => setConfig({ ...config, requireLogin: v })} />
              <ToggleSwitch label="Notificaciones por email" checked={config.enableNotifications} onChange={v => setConfig({ ...config, enableNotifications: v })} />
              <FormField label="Máx. fotos por reporte"><input type="number" value={config.maxPhotosPerReport} onChange={e => setConfig({ ...config, maxPhotosPerReport: parseInt(e.target.value) || 1 })} style={themeInput} min={1} max={10} /></FormField>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ ...themeCard, borderColor: '#f5c6cb' }}>
            <h4 style={{ color: colors.danger, fontWeight: '700', fontSize: '1rem', marginBottom: '18px' }}>⚠️ Zona de Peligro</h4>
            <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '16px' }}>Estas acciones son irreversibles. Úsalas con precaución.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="button" onClick={() => alert('Esta acción requiere confirmación adicional del backend.')} style={{ ...dangerBtn, padding: '10px 20px' }}>Limpiar caché</button>
              <button type="button" onClick={() => alert('Esta acción requiere confirmación adicional del backend.')} style={{ ...dangerBtn, padding: '10px 20px' }}>Resetear configuración</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button type="submit" style={{ ...greenBtn, padding: '14px 40px' }}>💾 Guardar Configuración</button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════ */
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ color: colors.primary, fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ color: colors.textMuted, fontSize: '0.9rem', margin: '4px 0 0' }}>{subtitle}</p>}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', ...themeCard }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>📭</div>
      <p style={{ color: colors.textMuted, fontSize: '1rem' }}>{text}</p>
    </div>
  );
}

function ModalOverlay({ onClose, title, children }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={onClose}>
      <div style={{ backgroundColor: colors.white, borderRadius: radius.xl, padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: shadows.xl, position: 'relative' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: colors.primary, fontWeight: '700', fontSize: '1.2rem', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: colors.textMuted, padding: '4px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: colors.textMuted, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div onClick={() => onChange(!checked)} style={{
        width: '44px', height: '24px', borderRadius: '12px',
        backgroundColor: checked ? colors.accent : colors.border,
        position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
      }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
          position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: '0.9rem', color: colors.text }}>{label}</span>
    </label>
  );
}

/* ── Shared styles ── */
const greenBtn = {
  padding: '10px 24px',
  backgroundColor: colors.primary,
  color: colors.white,
  border: 'none',
  borderRadius: radius.pill,
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(27,67,50,0.15)',
};

const dangerBtn = {
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: colors.danger,
  border: `1.5px solid ${colors.danger}`,
  borderRadius: radius.md,
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const iconBtn = {
  background: 'none',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
  transition: 'all 0.15s ease',
};
