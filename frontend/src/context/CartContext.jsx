import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('caquicanela_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('caquicanela_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, color = 'N/A', size = 'N/A') => {
    setItems(prevItems => {
      // Cria um ID único para a variação (produto + cor + tamanho)
      const variationId = `${product.id}-${color}-${size}`;
      const existing = prevItems.find(i => i.variationId === variationId);
      
      if (existing) {
        return prevItems.map(i => 
          i.variationId === variationId ? { ...i, qty: i.qty + quantity } : i
        );
      }
      return [...prevItems, { ...product, qty: quantity, color, size, variationId }];
    });
    alert(`${product.name} (${color}, ${size}) foi adicionado ao carrinho!`);
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = useMemo(() =>
    items.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0),
  [items]);

  const value = {
    items,
    addToCart,
    clearCart,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}