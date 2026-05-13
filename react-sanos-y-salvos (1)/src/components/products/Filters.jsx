import { Form, Accordion, Button } from 'react-bootstrap';


export default function Filters({ onFilterChange, brands, onClear }) {
    
    const handleChange = (e, type) => {
        const { name, value, checked } = e.target;
        
        onFilterChange({ type, name, value, checked });
    };

    const darkCardStyle = {
        backgroundColor: '#1a1a1a', 
        color: '#fff', 
        border: '1px solid #333'
    };

    const goldText = { color: '#d4af37', fontWeight: 'bold' };

    return (
        <div className="p-3 rounded shadow-sm" style={{ 
            backgroundColor: '#0a0a0a', 
            border: '1px solid #d4af37', 
            color: 'white'
        }}>
            <h4 className="mb-4 text-center" style={{ 
                ...goldText, 
                letterSpacing: '1px', 
                borderBottom: '1px solid #333', 
                paddingBottom: '10px'
            }}>
                FILTRAR POR
            </h4>
            
            <Accordion defaultActiveKey={['0']} alwaysOpen data-bs-theme="dark">
                
                {/* --- GÉNERO --- */}
                <Accordion.Item eventKey="0" style={darkCardStyle}>
                    <Accordion.Header>Género</Accordion.Header>
                    <Accordion.Body>
                        {['Hombre', 'Mujer', 'Unisex'].map(g => (
                            <Form.Check 
                                key={g}
                                type="checkbox" 
                                label={g} 
                                name={g} 
                                
                                onChange={(e) => handleChange(e, 'gender')}
                                style={{ marginBottom: '8px' }}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                {/* --- PRECIO --- */}
                <Accordion.Item eventKey="1" style={darkCardStyle}>
                    <Accordion.Header>Precio Máximo</Accordion.Header>
                    <Accordion.Body>
                        <Form.Label style={{fontSize: '0.9rem', color: '#ccc'}}>Hasta: $</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Ej: 50000" 
                            
                            onChange={(e) => handleChange(e, 'priceMax')} 
                            style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                {/* --- MARCA --- */}
                <Accordion.Item eventKey="2" style={darkCardStyle}>
                    <Accordion.Header>Marca</Accordion.Header>
                    <Accordion.Body>
                        {brands.map((brand, index) => (
                            <Form.Check 
                                key={index} 
                                type="checkbox" 
                                label={brand} 
                                name={brand} 
                                // type='brand'
                                onChange={(e) => handleChange(e, 'brand')} 
                                style={{ marginBottom: '5px' }}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                {/* --- AROMA --- */}
                <Accordion.Item eventKey="3" style={darkCardStyle}>
                    <Accordion.Header>Aroma</Accordion.Header>
                    <Accordion.Body>
                         {['Dulce', 'Cítrico', 'Floral', 'Amaderado', 'Tropical'].map(a => (
                             <Form.Check 
                                key={a}
                                type="checkbox" 
                                label={a} 
                                name={a} 
                                // type='aroma'
                                onChange={(e) => handleChange(e, 'aroma')} 
                                style={{ marginBottom: '5px' }}
                             />
                         ))}
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>
            
            <Button 
                variant="outline-warning" 
                className="w-100 mt-4" 
                onClick={onClear} 
                style={{ 
                    borderColor: '#d4af37', 
                    color: '#d4af37',
                    fontWeight: 'bold',
                    borderRadius: '20px'
                }}
            >
                Limpiar Filtros
            </Button>
        </div>
    );
}