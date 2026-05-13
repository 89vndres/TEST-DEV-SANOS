import React from 'react';
import MascotaCard from './MascotaCard';

const MascotaGrid = ({ mascotas }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      padding: '0 20px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {mascotas.map((mascota) => (
        <MascotaCard key={mascota.id} mascota={mascota} />
      ))}
    </div>
  );
};

export default MascotaGrid;
