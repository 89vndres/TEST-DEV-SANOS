import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useCart = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // App-level state (placeholder for future features)
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    return (
        <AppContext.Provider value={{ 
            notifications, addNotification
        }}>
            {children}
        </AppContext.Provider>
    );
};
