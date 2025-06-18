import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [ticketCounts, setTicketCounts] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateTicketCount = (ticketId, count) => {
    setTicketCounts(prev => ({ ...prev, [ticketId]: count }));
  };

  const increment = (ticketId) => {
    updateTicketCount(ticketId, (ticketCounts[ticketId] || 0) + 1);
  };

  const decrement = (ticketId) => {
    updateTicketCount(ticketId, Math.max(0, (ticketCounts[ticketId] || 0) - 1));
  };

  const resetCart = () => {
    setTicketCounts({});
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        ticketCounts,
        increment,
        decrement,
        resetCart,
        openCart,
        closeCart,
        isCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
