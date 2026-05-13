import { Offcanvas, Button, Image } from 'react-bootstrap';
import { useCart } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ show, handleClose }) {
    const { cart, removeFromCart, cartTotal, clearCart, checkout } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!user) {
            alert("Debes iniciar sesión para comprar");
            handleClose();
            return;
        }

        const success = await checkout(user.email, token);
        if (success) {
            alert("¡Compra realizada con éxito!");
            handleClose();
            navigate('/mis-compras');
        } else {
            alert("Hubo un error al procesar tu compra.");
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ borderRadius: '20px 0 0 20px' }}>
            <Offcanvas.Header closeButton border="bottom">
                <Offcanvas.Title className="fw-bold">Mi Carrito 🛒</Offcanvas.Title>
            </Offcanvas.Header>
            
            <Offcanvas.Body className="d-flex flex-column">
                {cart.length === 0 ? (
                    <div className="text-center my-auto opacity-50">
                        <h4>Tu carrito está vacío</h4>
                        <p>¡Agrega algunos perfumes!</p>
                    </div>
                ) : (
                    <div className="flex-grow-1 overflow-auto pe-2">
                        {cart.map((item, index) => (
                            <div 
                                key={index} 
                                className="d-flex align-items-center mb-3 p-2 shadow-sm"
                                style={{ 
                                    border: '1px solid #f0f0f0', 
                                    borderRadius: '16px', 
                                    backgroundColor: '#fff' 
                                }}
                            >
                                <Image 
                                    src={item.imagen || item.image} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} 
                                />
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                        {item.nombre || item.name}
                                    </h6>
                                    <small className="text-muted">
                                        ${Number(item.precio || item.price).toLocaleString('es-CL')}
                                    </small>
                                </div>
                                <Button 
                                    variant="link" 
                                    className="text-danger" 
                                    onClick={() => removeFromCart(index)}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                            <span>Total:</span>
                            <span>${cartTotal.toLocaleString('es-CL')}</span>
                        </div>
                        
                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                style={{ borderRadius: '12px', backgroundColor: '#d4af37', border: 'none', color: 'black', fontWeight: 'bold' }}
                                onClick={handlePayment}
                            >
                                Pagar Ahora
                            </Button>
                            
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={clearCart}
                                style={{ borderRadius: '12px' }}
                            >
                                Vaciar Carrito
                            </Button>
                        </div>
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}