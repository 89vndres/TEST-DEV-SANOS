import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, shadows, radius, transitions } from '../styles/theme';
import { API_BASE_URL } from '../services/api';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    estado: '', especie: '', nombre: '', raza: '', color: '',
    ubicacion: '', edad: '', tamano: '', caracteristicas_distintivas: '',
    foto_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/mascotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) { closeModal(); navigate('/products'); }
      else { alert("El backend rechazó los datos. Revisa la consola del servidor."); }
    } catch (error) {
      console.error("Error:", error);
      alert("No pudimos conectar con el servidor. ¿Está encendido el backend?");
    }
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: colors.bg,
      padding: '100px 20px 60px',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden'
    }}>
      <BackgroundDecorations />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          maxWidth: '780px', textAlign: 'center', padding: '60px 48px',
          borderRadius: radius.xl,
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: shadows.lg,
          border: `1px solid ${colors.borderLight}`,
          position: 'relative', zIndex: 10
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: colors.accentPale, color: colors.primary, padding: '6px 16px', borderRadius: radius.pill, fontWeight: '600', fontSize: '0.85rem', marginBottom: '24px' }}>
          <span>🐾</span> Plataforma de Mascotas Perdidas
        </div>

        <h1 style={{
          fontSize: '3.5rem', fontWeight: '900', color: colors.primary,
          margin: '0 0 20px 0', letterSpacing: '-1.5px', lineHeight: '1.1'
        }}>
          Sanos y Salvos
        </h1>
        <p style={{
          fontSize: '1.15rem', lineHeight: '1.7', color: colors.textMuted,
          maxWidth: '580px', margin: '0 auto 36px auto'
        }}>
          Plataforma inteligente para la localización y recuperación de mascotas perdidas.
          Nuestra comunidad te ayuda a reunir familias con sus compañeros de vida.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/products" style={btnPrimaryStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryLight}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
          >
            🔍 Ver Mascotas Reportadas
          </Link>
          <button onClick={openModal} style={btnSecondaryStyle}
            onMouseOver={(e) => { e.target.style.backgroundColor = colors.primaryPale; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = colors.white; }}
          >
            📝 Reportar Mascota
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'flex', gap: '32px', marginTop: '48px', position: 'relative', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center'
        }}
      >
        {[
          { num: '100+', label: 'Mascotas encontradas' },
          { num: '500+', label: 'Reportes activos' },
          { num: '1.2k', label: 'Familias reunidas' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.primary }}>{s.num}</div>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div style={modalBackdropStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div
              style={modalCardStyle}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={closeModal} style={closeButtonStyle}>✕</button>
              <h2 style={{ color: colors.primary, marginBottom: '24px', textAlign: 'center', fontWeight: '700', fontSize: '1.4rem' }}>
                🐾 Crear Reporte
              </h2>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select name="estado" style={formInput} required onChange={handleChange} value={formData.estado}>
                    <option value="">¿Qué sucedió?</option>
                    <option value="perdido">Perdí a mi mascota</option>
                    <option value="encontrado">Encontré una mascota</option>
                  </select>
                  <select name="especie" style={formInput} required onChange={handleChange} value={formData.especie}>
                    <option value="">Especie</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" name="nombre" placeholder="Nombre (si lo sabes)" style={formInput} onChange={handleChange} value={formData.nombre} />
                  <input type="text" name="ubicacion" placeholder="Ubicación (Ej: Maipú)" style={formInput} required onChange={handleChange} value={formData.ubicacion} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" name="raza" placeholder="Raza" style={formInput} onChange={handleChange} value={formData.raza} />
                  <input type="text" name="color" placeholder="Color" style={formInput} required onChange={handleChange} value={formData.color} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" name="edad" placeholder="Edad (Ej: 2 años)" style={formInput} onChange={handleChange} value={formData.edad} />
                  <input type="text" name="tamano" placeholder="Tamaño (Pequeño, Mediano...)" style={formInput} required onChange={handleChange} value={formData.tamano} />
                </div>
                <textarea name="caracteristicas_distintivas" placeholder="Características distintivas (collar, cicatrices, comportamiento...)" style={{ ...formInput, minHeight: '80px', resize: 'vertical' }} onChange={handleChange} value={formData.caracteristicas_distintivas} />
                <button type="submit" style={{ ...btnPrimaryStyle, width: '100%', marginTop: '4px', padding: '14px', fontSize: '1rem' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryLight}
                  onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
                >
                  Publicar Reporte
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Background ── */
const BackgroundDecorations = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', top: '45%', left: '-10%', width: '120%', height: '4px', backgroundColor: colors.primary, opacity: 0.04, transform: 'rotate(-8deg)' }} />
    <PawIcon style={{ position: 'absolute', top: '15%', left: '10%', transform: 'rotate(-20deg)', opacity: 0.05 }} size="80" />
    <PawIcon style={{ position: 'absolute', top: '65%', left: '15%', transform: 'rotate(15deg)', opacity: 0.07 }} size="100" />
    <PawIcon style={{ position: 'absolute', top: '25%', right: '15%', transform: 'rotate(30deg)', opacity: 0.06 }} size="90" />
    <PawIcon style={{ position: 'absolute', top: '75%', right: '10%', transform: 'rotate(-15deg)', opacity: 0.04 }} size="70" />
  </div>
);

const PawIcon = ({ style, size = "50" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={colors.primary} style={style}>
    <path d="M18.88 3.58C18.23 2.21 16.73 1.5 15.33 2.05 13.93 2.6 13.15 4.2 13.8 5.57 14.45 6.94 15.95 7.65 17.35 7.1 18.75 6.55 19.53 4.95 18.88 3.58zM8.67 2.05C7.27 1.5 5.77 2.21 5.12 3.58 4.47 4.95 5.25 6.55 6.65 7.1 8.05 7.65 9.55 6.94 10.2 5.57 10.85 4.2 10.07 2.6 8.67 2.05zM20.3 8.35C18.9 7.8 17.4 8.5 16.75 9.87 16.1 11.24 16.88 12.84 18.28 13.39 19.68 13.94 21.18 13.24 21.83 11.87 22.48 10.5 21.7 8.9 20.3 8.35zM5.72 13.39C7.12 12.84 7.9 11.24 7.25 9.87 6.6 8.5 5.1 7.8 3.7 8.35 2.3 8.9 1.52 10.5 2.17 11.87 2.82 13.24 4.32 13.94 5.72 13.39zM12 10.26C10.15 10.26 8.41 11.16 7.42 12.78 6.59 14.13 6.13 16.27 7.07 18.3 8 20.33 10.19 21.96 12 21.96 13.81 21.96 16 20.33 16.93 18.3 17.87 16.27 17.41 14.13 16.58 12.78 15.59 11.16 13.85 10.26 12 10.26z" />
  </svg>
);

/* ── Styles ── */
const btnPrimaryStyle = { padding: '14px 32px', backgroundColor: colors.primary, color: '#fff', textDecoration: 'none', borderRadius: radius.pill, fontWeight: '600', fontSize: '0.95rem', transition: transitions.normal, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(27,67,50,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' };
const btnSecondaryStyle = { padding: '14px 32px', backgroundColor: colors.white, color: colors.primary, border: `2px solid ${colors.primary}`, textDecoration: 'none', borderRadius: radius.pill, fontWeight: '600', fontSize: '0.95rem', transition: transitions.normal, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' };
const modalBackdropStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalCardStyle = { backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', border: `1px solid ${colors.borderLight}`, padding: '40px', borderRadius: radius.xl, width: '100%', maxWidth: '600px', boxShadow: shadows.xl, position: 'relative' };
const closeButtonStyle = { position: 'absolute', top: '18px', right: '22px', background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: colors.textMuted, fontWeight: 'bold' };
const formInput = { width: '100%', padding: '12px 16px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`, fontSize: '0.95rem', backgroundColor: 'rgba(255,255,255,0.7)', color: colors.text, boxSizing: 'border-box', outline: 'none', transition: transitions.fast, fontFamily: "'Inter', sans-serif" };

export default Home;
