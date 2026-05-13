import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Sincroniza el estado del usuario al cargar la página o cambiar el token
    useEffect(() => {
        const savedRole = localStorage.getItem('role');
        const savedEmail = localStorage.getItem('email');
        const savedNombre = localStorage.getItem('nombre');
        
        if (token && savedRole) {
            setUser({ 
                role: savedRole, 
                email: savedEmail, 
                nombre: savedNombre 
            });
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Credenciales incorrectas');
            }

            const data = await response.json();
            
            // Extraer datos según la estructura del backend: { token, user: { email, role, nombre } }
            const receivedToken = data.token;
            const userData = data.user || {};
            const receivedRole = userData.role || 'user';
            const receivedNombre = userData.nombre || '';

            // Actualizar estado global
            setToken(receivedToken);
            setUser({ role: receivedRole, email: email, nombre: receivedNombre });

            // Persistir en almacenamiento local
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('role', receivedRole);
            localStorage.setItem('email', email);
            localStorage.setItem('nombre', receivedNombre);
            
            return true;
        } catch (error) {
            console.error('Error en login:', error.message);
            return false;
        }
    };

    const register = async (nombre, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password }) // Coincide con AuthController.ts
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al registrar usuario');
            }

            return { success: true };
        } catch (error) {
            console.error('Error en registro:', error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear(); // Limpia toda la sesión
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}