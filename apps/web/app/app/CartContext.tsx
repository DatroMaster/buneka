"use client";

import type { Tables } from "@buneka/database";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Product = Tables<"products">;
export type CartItem = { product: Product; quantity: number };

type CartContextValue = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
