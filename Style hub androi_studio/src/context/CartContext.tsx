import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItemProduct } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItemProduct[];
  addToCart: (product: Product, quantity?: number, silent?: boolean) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  badgeBounce: boolean;
  cartVersion: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'stylehub_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [badgeBounce, setBadgeBounce] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const [cart, setCart] = useState<CartItemProduct[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          product: {
            id: 1,
            title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
            price: 109.95,
            description: 'Your perfect pack for everyday use and walks in the forest.',
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
            rating: { rate: 3.9, count: 120 }
          },
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronous localStorage persistence
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const triggerBadgeAnimation = useCallback(() => {
    setBadgeBounce(true);
    const timer = setTimeout(() => setBadgeBounce(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 1. Pure immutable state updates ensuring immediate React rerenders across all components
  const addToCart = useCallback((product: Product, quantity = 1, silent = false) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      let updated: CartItemProduct[];
      if (exists) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product: { ...product }, quantity }];
      }
      return updated;
    });

    setCartVersion((v) => v + 1);
    triggerBadgeAnimation();

    if (!silent) {
      showToast({
        title: '¡Producto añadido!',
        message: `${quantity > 1 ? `${quantity}x ` : ''}${product.title}`,
        type: 'success',
        image: product.image,
      });
    }
  }, [showToast, triggerBadgeAnimation]);

  const removeFromCart = useCallback((productId: number) => {
    let removedItemTitle = '';
    let removedItemImage = '';

    setCart((prev) => {
      const target = prev.find((i) => i.product.id === productId);
      if (target) {
        removedItemTitle = target.product.title;
        removedItemImage = target.product.image;
      }
      return prev.filter((item) => item.product.id !== productId);
    });

    setCartVersion((v) => v + 1);

    if (removedItemTitle) {
      showToast({
        title: 'Producto eliminado',
        message: `${removedItemTitle} se quitó de tu carrito.`,
        type: 'info',
        image: removedItemImage,
      });
    }
  }, [showToast]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    setCartVersion((v) => v + 1);
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartVersion((v) => v + 1);
  }, []);

  const getItemQuantity = useCallback((productId: number): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  // Derived reactive calculations with useMemo
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => {
    return subtotal * 0.08;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
        subtotal,
        tax,
        total,
        isCartOpen,
        setIsCartOpen,
        badgeBounce,
        cartVersion,
      }}
    >
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
