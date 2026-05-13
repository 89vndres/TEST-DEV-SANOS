import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const savedRole = localStorage.getItem('role');
        const savedEmail = localStorage.getItem('email');
        const savedNombre = localStorage.getItem('nombre');
        if (token && savedRole) {
            setUser({ role: savedRole, email: savedEmail, nombre: savedNombre });
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            });

            if (!response.ok) throw new Error('Credenciales incorrectas');

            const data = await response.json();
            
            // Backend returns: { token, user: { email, role, nombre } }
            const receivedToken = data.token;
            const receivedRole = data.user?.role || 'user';
            const receivedNombre = data.user?.nombre || '';

            setToken(receivedToken);
            setUser({ role: receivedRole, email: email, nombre: receivedNombre });

            localStorage.setItem('token', receivedToken);
            localStorage.setItem('role', receivedRole);
            localStorage.setItem('email', email);
            localStorage.setItem('nombre', receivedNombre);
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (nombre, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || 'Error al registrar');
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}