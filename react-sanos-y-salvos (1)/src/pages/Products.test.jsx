import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Products from './Products';
import { AppProvider, useCart } from '../context/AppContext'; 
import { GAMING_PRODUCTS } from '../data/gaming.mock'; 

jest.mock('../context/AppContext', () => ({
    ...jest.requireActual('../context/AppContext'), 
    useCart: jest.fn(), 
}));

describe('Componente Products', () => {
    
    
    const mockAddToCart = jest.fn();
    beforeEach(() => {
        useCart.mockReturnValue({
            cartCount: 0,
            addToCart: mockAddToCart,
        });
        
        mockAddToCart.mockClear();
    });

    test('se monta correctamente y muestra el título y filtros', () => {
        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );
        
        expect(screen.getByRole('heading', { name: /perfumes|gaming/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /todos/i })).toBeInTheDocument();
    });

    
    test('renderiza todas las tarjetas de producto del mock', () => {
        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        
        for (const product of GAMING_PRODUCTS) {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        }
        
        
        const botones = screen.getAllByRole('button', { name: /añadir al carrito/i });
        expect(botones).toHaveLength(GAMING_PRODUCTS.length);
    });

    
    test('el botón "Añadir al carrito" llama a la función addToCart del contexto', async () => {
        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        
        const botones = screen.getAllByRole('button', { name: /añadir al carrito/i });
        
        
        await fireEvent.click(botones[0]);

        
        expect(mockAddToCart).toHaveBeenCalledTimes(1);

        
        expect(mockAddToCart).toHaveBeenCalledWith(GAMING_PRODUCTS[0]);
    });

});