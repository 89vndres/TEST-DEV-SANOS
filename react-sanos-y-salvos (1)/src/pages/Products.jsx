import React, { useState, useEffect, useMemo } from 'react';
import MascotaGrid from '../components/products/MascotaGrid';
import { colors, radius, shadows } from '../styles/theme';
import { API_BASE_URL } from '../services/api';

const Products = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterEspecie, setFilterEspecie] = useState('');

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/mascotas`);
        if (!response.ok) throw new Error('El backend respondió con error');
        const data = await response.json();
        if (Array.isArray(data)) setMascotas(data);
        else setMascotas([]);
      } catch (err) {
        console.error("Error al conectar con backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMascotas();
  }, []);

  const filtered = useMemo(() => {
    return mascotas.filter(m => {
      const matchSearch = !search ||
        (m.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.ubicacion || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.raza || '').toLowerCase().includes(search.toLowerCase());
      const matchEstado = !filterEstado || (m.estado || '').toLowerCase() === filterEstado.toLowerCase();
      const matchEspecie = !filterEspecie || (m.especie || '').toLowerCase() === filterEspecie.toLowerCase();
      return matchSearch && matchEstado && matchEspecie;
    });
  }, [mascotas, search, filterEstado, filterEspecie]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <h2 style={{ color: colors.primary, fontWeight: '600', fontSize: '1.1rem' }}>Cargando reportes...</h2>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 20px 60px', backgroundColor: colors.bg, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: colors.primary, fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          🐾 Mural de Mascotas
        </h1>
        <p style={{ color: colors.textMuted, fontSize: '1.05rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Revisa los reportes recientes. Si reconoces a alguna mascota, ¡contacta a quien publicó el aviso!
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '28px', maxWidth: '1400px',
        margin: '0 auto 28px', padding: '0 20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'
      }}>
        <input
          placeholder="🔍 Buscar por nombre, ubicación o raza..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={filterInputStyle}
        />
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} style={{ ...filterInputStyle, maxWidth: '180px' }}>
          <option value="">Todos los estados</option>
          <option value="perdido">🔴 Perdidos</option>
          <option value="encontrado">🟢 Encontrados</option>
        </select>
        <select value={filterEspecie} onChange={e => setFilterEspecie(e.target.value)} style={{ ...filterInputStyle, maxWidth: '160px' }}>
          <option value="">Todas las especies</option>
          <option value="Perro">🐕 Perros</option>
          <option value="Gato">🐈 Gatos</option>
          <option value="Otro">🐾 Otros</option>
        </select>
        {(search || filterEstado || filterEspecie) && (
          <span style={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: '500' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <MascotaGrid mascotas={filtered} />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.4 }}>🐾</div>
          <h3 style={{ color: colors.primary, fontWeight: '700', marginBottom: '8px' }}>
            {mascotas.length === 0 ? 'Sin reportes aún' : 'Sin resultados'}
          </h3>
          <p style={{ color: colors.textMuted, fontSize: '1rem' }}>
            {mascotas.length === 0
              ? '¡Sé el primero en publicar un reporte desde la página de inicio!'
              : 'Intenta cambiar los filtros de búsqueda.'}
          </p>
        </div>
      )}
    </div>
  );
};

const filterInputStyle = {
  padding: '10px 16px',
  borderRadius: radius.pill,
  border: `1.5px solid ${colors.border}`,
  fontSize: '0.9rem',
  backgroundColor: colors.white,
  color: colors.text,
  outline: 'none',
  minWidth: '200px',
  maxWidth: '320px',
  fontFamily: "'Inter', sans-serif",
  boxShadow: shadows.sm,
};

export default Products;
