import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';

/* ── Page transition wrapper ── */
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeOut' }
};

const Page = ({ children }) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%', minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/products" element={<Page><Products /></Page>} />
        <Route path="/productos" element={<Page><Products /></Page>} />
        <Route path="/contacto" element={<Page><Contact /></Page>} />

        {/* User */}
        <Route path="/mis-reportes" element={<Page><MyOrders /></Page>} />
        <Route path="/orders" element={<Page><MyOrders /></Page>} />
        <Route path="/perfil" element={<Page><UserProfile /></Page>} />
        <Route path="/profile" element={<Page><UserProfile /></Page>} />

        {/* Admin */}
        <Route path="/admin" element={<Page><AdminPanel /></Page>} />

        {/* Fallback */}
        <Route path="*" element={
          <Page>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🐾</div>
              <h2 style={{ color: '#1b4332', fontWeight: '800', marginBottom: '8px' }}>Página no encontrada</h2>
              <p style={{ color: '#6b7f73' }}>La página que buscas no existe.</p>
            </div>
          </Page>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
