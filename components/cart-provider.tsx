"use client";

import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
export type TCartItem = { product: TProductInfo; variant?: TProductVariant; quantity: number };
type CartContextType = {
  cartItems: TCartItem[];
  addToCart: (product: TProductInfo, variant?: TProductVariant) => void;
  removeFromCart: (product: TProductInfo, variant?: TProductVariant) => void;
  updateQuantity: (product: TProductInfo, quantity: number, variant?: TProductVariant) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
};
export type TProductInfo = TProduct & {
  selectedVaraint?: TProductVariant;
  varaintAttributes?: Map<
    string,
    {
      values: Set<string>;
      id: string;
      name: string;
      sortOrder: number;
    }
  >;
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

  const addToCart = (product: TProductInfo, variant?: TProductVariant) => {
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

  const removeFromCart = (product: TProductInfo, variant?: TProductVariant) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.product._id !== product._id && item.variant?._id !== variant?._id
      )
    );

    if (cartItems.length === 0) {
      localStorage.removeItem("cart");
    }
  };

  const updateQuantity = (product: TProductInfo, quantity: number, variant?: TProductVariant) => {
    debugger;
    const updatedItem = cartItems.find(
      (item) => item.product._id === product._id && item.variant?._id === variant?._id
    );
    if (!updatedItem) {
      //todo : show toeast
    } else {
      if (quantity <= 0) {
        removeFromCart(product, variant);
        return;
      }
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
