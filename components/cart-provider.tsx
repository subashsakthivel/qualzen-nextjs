"use client";

import { TProductRes } from "@/schema/Product";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
  cartItems: TProductRes[];
  addToCart: (product: TProductRes) => void;
  removeFromCart: (productId: string, variantId: string | undefined) => void;
  updateQuantity: (productId: string, varaintId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<TProductRes[]>([]);

  // Load cart from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: TProductRes) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === product._id && item.variantId === product.variantId
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.stockQuantity || 1) + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string, variantId: string | undefined) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId && item.variantId !== variantId)
    );

    // If cart is empty after removal, clear localStorage
    if (cartItems.length === 1) {
      localStorage.removeItem("cart");
    }
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId && item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((total, item) => total + (item.stockQuantity || 1), 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.stockQuantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
