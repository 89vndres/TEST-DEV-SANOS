import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProduct() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '', marca: '', precio: '', imagen: '', category: 'Hombre', aroma: '', stock: 0
    });

    useEffect(() => {
        fetch(`http://localhost:8080/api/mascotas/${id}`)
            .then(res => res.json())
            .then(data => { if (data) setFormData(data); })
            .catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8080/api/mascotas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Perfume actualizado correctamente');
            navigate('/admin');
        } else {
            alert('Error al actualizar');
        }
    };

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Container className="p-0" style={{
                maxWidth: '600px',
                background: 'linear-gradient(145deg, #1a1a1a 0%, #000000 100%)',
                borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', overflow: 'hidden', color: 'white'
            }}>
                <div style={{ padding: '40px' }}>
                    <h3 className="text-center mb-4 fw-bold" style={{ color: '#d4af37' }}>✏️ Editar Perfume #{id}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="nombre" value={formData.nombre || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control name="marca" value={formData.marca || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" name="precio" value={formData.precio || ''} onChange={handleChange} />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label style={{color:'#d4af37', fontWeight:'bold'}}>Stock Disponible</Form.Label>
                            <Form.Control type="number" name="stock" value={formData.stock || 0} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Imagen URL</Form.Label>
                            <Form.Control name="imagen" value={formData.imagen || ''} onChange={handleChange} />
                        </Form.Group>
                        
                        <div className="row">
                            <div className="col-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select name="category" value={formData.category || 'Hombre'} onChange={handleChange}>
                                        <option value="Hombre">Hombre</option>
                                        <option value="Mujer">Mujer</option>
                                        <option value="Unisex">Unisex</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group className="mb-4">
                                    <Form.Label>Aroma</Form.Label>
                                    <Form.Select name="aroma" value={formData.aroma || 'Dulce'} onChange={handleChange}>
                                        <option value="Dulce">Dulce</option>
                                        <option value="Cítrico">Cítrico</option>
                                        <option value="Floral">Floral</option>
                                        <option value="Amaderado">Amaderado</option>
                                        <option value="Tropical">Tropical</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <Button variant="warning" type="submit" className="w-100 fw-bold py-2 mt-2" style={{ backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#000' }}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
}