import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product['Product ID']);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product['Product ID']
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, {
        productId: product['Product ID'],
        name: product['Product Name'],
        price: product.Price,
        quantity: 1,
        product: product // Store the full product object for reference
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity === 0) {
        return prevItems.filter(item => item.productId !== productId);
      }

      const existingItem = prevItems.find(item => item.productId === productId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return prevItems;
    });
  };

  const getQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  const getCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getQuantity,
    getCartTotal,
    getCartQuantity,
    isInCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};