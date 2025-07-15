"use client";

import { TProductRes } from "@/schema/Product";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
export type TCartItem = TProductRes & { quantity: number };
type CartContextType = {
  cartItems: TCartItem[];
  addToCart: (product: TProductRes) => void;
  removeFromCart: (productId: string, variantId: string | undefined) => void;
  updateQuantity: (productId: string, varaintId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);

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
    const existingItem = cartItems.find(
      (item) => item._id === product._id && item.variantId === product.variantId
    );
    const productQuantity = product.selectedVariant
      ? product.variants.find((variant) => variant._id === product.selectedVariant?._id)
          ?.stockQuantity ?? 0
      : product.stockQuantity;
    //todo : show soldout toast
    const item: TCartItem = {
      ...product,
      quantity: existingItem ? existingItem.quantity + 1 : 1,
    };

    setCartItems((prevItems) =>
      prevItems.map((prevItem) =>
        item._id === product._id && item.variantId === product.variantId ? item : prevItem
      )
    );
  };

  const removeFromCart = (productId: string, variantId: string | undefined) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId && item.variantId !== variantId)
    );

    if (cartItems.length === 0) {
      localStorage.removeItem("cart");
    }
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    const updatedItem = cartItems.find(
      (item) => item._id === productId && item.variantId === variantId
    );
    if (!updatedItem) {
      //todo : show toeast
    } else {
      const productQuantity = updatedItem?.variantId
        ? updatedItem.variants.find((variant) => variant._id === updatedItem.selectedVariant?._id)
            ?.stockQuantity ?? 0
        : updatedItem.stockQuantity;
      //todo : low stock alert
      updatedItem.quantity++;
      setCartItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem._id === productId && prevItem.variantId === variantId ? updatedItem : prevItem
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = Math.floor(subtotal);

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
        total,
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
