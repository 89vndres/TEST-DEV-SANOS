import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    genero: 'HOMBRE',
    aroma: 'DULCE'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/mascotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          precio: Number(formData.precio),
          stock: Number(formData.stock)
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      alert('Perfume agregado correctamente');
      navigate('/productos');

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear perfume');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2>Agregar Nuevo Perfume</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control required name="nombre" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Marca</Form.Label>
          <Form.Control required name="marca" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control type="number" required name="precio" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control type="number" required name="stock" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imagen URL</Form.Label>
          <Form.Control required name="imagenUrl" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Género</Form.Label>
          <Form.Select name="genero" onChange={handleChange}>
            <option value="HOMBRE">Hombre</option>
            <option value="MUJER">Mujer</option>
            <option value="UNISEX">Unisex</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Aroma</Form.Label>
          <Form.Select name="aroma" onChange={handleChange}>
            <option value="DULCE">Dulce</option>
            <option value="CITRICO">Cítrico</option>
            <option value="FLORAL">Floral</option>
            <option value="AMADERADO">Amaderado</option>
            <option value="TROPICAL">Tropical</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" type="submit">
          Guardar Perfume
        </Button>
      </Form>
    </Container>
  );
}
