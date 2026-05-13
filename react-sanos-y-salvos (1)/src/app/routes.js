import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Register from '../pages/Register';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Login from '../pages/Login';
import Contact from '../pages/Contact';
import MyOrders from '../pages/MyOrders';
import UserProfile from '../pages/UserProfile';

// Administración
import AdminDashboard from '../pages/AdminPanel';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';

// ANIMACIONES 
const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
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
                
                {/* === RUTAS PÚBLICAS === */}
                <Route path="/" element={<Page><Home /></Page>} />
                <Route path="/register" element={<Page><Register /></Page>} />
                <Route path="/login" element={<Page><Login /></Page>} />
                <Route path="/productos" element={<Page><Products /></Page>} />
                <Route path="/contacto" element={<Page><Contact /></Page>} />
                
                {/* === RUTAS DE CLIENTE === */}
                <Route path="/mis-compras" element={<Page><MyOrders /></Page>} />
                <Route path="/perfil" element={<Page><UserProfile /></Page>} />
                
                {/* === RUTAS DE ADMINISTRACIÓN === */}
                <Route path="/admin" element={<Page><AdminDashboard /></Page>} />
                <Route path="/agregar" element={<Page><AddProduct /></Page>} />
                <Route path="/editar/:id" element={<Page><EditProduct /></Page>} />

            </Routes>
        </AnimatePresence>
    );
}

function AppRoutes(){
    return (
        <BrowserRouter>
            <NavBar />
            <AnimatedRoutes />
        </BrowserRouter>
    );
}

export default AppRoutes;