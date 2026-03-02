import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        API.get('/cart')
            .then(res => {
                const count = res.data?.items?.length || 0;
                setCartCount(count);
            })
            .catch(() => setCartCount(0));
    }, []);

    const updateCartCount = (count) => {
        setCartCount(count);
    };

    return (
        <CartContext.Provider value={{
            cartCount,
            updateCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
