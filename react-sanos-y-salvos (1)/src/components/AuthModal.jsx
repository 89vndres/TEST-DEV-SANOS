import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ show, handleClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            const success = await login(email, password);
            if (success) {
                handleClose();
                navigate('/products');
            } else {
                alert("Credenciales incorrectas");
            }
        } else {
            const result = await register(name, email, password);
            if (result.success) {
                alert("¡Registro exitoso! Ahora inicia sesión.");
                setIsLogin(true);
            } else {
                alert(result.error || "Error al registrarse");
            }
        }
    };

    const modalStyle = {
        backgroundColor: '#0a0a0a',
        color: '#fff',
        border: '1px solid #d4af37',
        borderRadius: '20px'
    };

    const inputStyle = {
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        color: 'white',
        borderRadius: '10px'
    };

    const activeTab = {
        color: '#d4af37',
        borderBottom: '2px solid #d4af37',
        fontWeight: 'bold'
    };

    const inactiveTab = {
        color: '#888',
        cursor: 'pointer'
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            centered
            contentClassName="bg-transparent border-0" 
        >
            <div style={modalStyle}>
                <Modal.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid #333' }}>
                    <Modal.Title style={{ fontFamily: "'Playfair Display', serif" }}>
                        {isLogin ? 'Bienvenido de nuevo' : 'Únete a Perfulandia'}
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="p-4">
                    <div className="d-flex justify-content-center mb-4 gap-4">
                        <span 
                            style={isLogin ? activeTab : inactiveTab} 
                            onClick={() => setIsLogin(true)}
                        >
                            INICIAR SESIÓN
                        </span>
                        <span 
                            style={!isLogin ? activeTab : inactiveTab} 
                            onClick={() => setIsLogin(false)}
                        >
                            CREAR CUENTA
                        </span>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ej: Juan Pérez"
                                    style={inputStyle}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="tu@email.com"
                                style={inputStyle}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="******"
                                style={inputStyle}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button 
                            type="submit" 
                            className="w-100 py-2"
                            style={{
                                backgroundColor: '#d4af37',
                                border: 'none',
                                color: '#000',
                                fontWeight: 'bold',
                                borderRadius: '10px'
                            }}
                        >
                            {isLogin ? 'INGRESAR' : 'REGISTRARSE'}
                        </Button>
                    </Form>
                </Modal.Body>
                
                <Modal.Footer style={{ borderTop: '1px solid #333', justifyContent: 'center' }}>
                    <small className="text-white">
                        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        <span 
                            style={{ color: '#d4af37', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </span>
                    </small>
                </Modal.Footer>
            </div>
        </Modal>
    );
}