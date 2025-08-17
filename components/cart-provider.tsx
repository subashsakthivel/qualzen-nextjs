"use client";

import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
export type TCartItem = { product: TProduct; variant?: TProductVariant; quantity: number };
type CartContextType = {
  cartItems: TCartItem[];
  addToCart: (product: TProduct, variant?: TProductVariant) => void;
  removeFromCart: (product: TProduct, variant?: TProductVariant) => void;
  updateQuantity: (product: TProduct, quantity: number, variant?: TProductVariant) => void;
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

  const addToCart = (product: TProduct, variant?: TProductVariant) => {
    debugger;
    const existingItem = cartItems.find(
      (item) => item.product._id === product._id && item.variant?._id === variant?._id
    );
    const productQuantity = variant ? variant.stockQuantity : product.stockQuantity;

    if (productQuantity === 0 || (existingItem && existingItem.quantity >= productQuantity)) {
      //todo : show not have error toast
      return;
    }

    const item: TCartItem = {
      product,
      variant,
      quantity: existingItem ? existingItem.quantity + 1 : 1,
    };

    if (!existingItem) {
      setCartItems([...cartItems, item]);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((prevItem) =>
          item.product._id === product._id && item.variant?._id === variant?._id ? item : prevItem
        )
      );
    }
  };

  const removeFromCart = (product: TProduct, variant?: TProductVariant) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.product._id !== product._id && item.variant?._id !== variant?._id
      )
    );

    if (cartItems.length === 0) {
      localStorage.removeItem("cart");
    }
  };

  const updateQuantity = (product: TProduct, quantity: number, variant?: TProductVariant) => {
    const updatedItem = cartItems.find(
      (item) => item.product._id === product._id && item.variant?._id === variant?._id
    );
    if (!updatedItem) {
      //todo : show toeast
    } else {
      const productQuantity = variant ? variant.stockQuantity : product.stockQuantity;
      if (productQuantity < quantity) {
        // todo : show dont have stock tast
        // update the cart local storage
        return;
      }
      updatedItem.quantity = Math.max(1, quantity);
      setCartItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.product._id === product._id && prevItem.variant?._id === variant?._id
            ? updatedItem
            : prevItem
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (item.variant ? item.variant.sellingPrice : item.product.sellingPrice) * item.quantity,
    0
  );
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
