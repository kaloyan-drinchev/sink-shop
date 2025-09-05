import React, { createContext, useContext, useState, useEffect } from "react";
import type { SinkData } from "../components/SinkCard/SinkCard";

export interface CartItem {
  id: string;
  title: string;
  priceEur: number;
  priceBgn: number;
  image: string;
  quantity: number;
  category: string;
  tag: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (sink: SinkData) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: (isEnglish: boolean) => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("artindoHomeCart");
        if (savedCart && savedCart !== "[]") {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("artindoHomeCart");
      } finally {
        setIsInitialized(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("artindoHomeCart", JSON.stringify(items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (sink: SinkData) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === sink.id);

      if (existingItem) {
        // If item already exists, increment quantity
        return prevItems.map((item) =>
          item.id === sink.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item
        const cartItem: CartItem = {
          id: sink.id,
          title: sink.title,
          priceEur: sink.priceEur,
          priceBgn: sink.priceBgn,
          image: sink.image,
          quantity: 1,
          category: sink.category,
          tag: sink.tag,
        };
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = (isEnglish: boolean) => {
    return items.reduce((total, item) => {
      const price = isEnglish ? item.priceEur : item.priceBgn;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
