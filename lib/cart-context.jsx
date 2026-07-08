"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "weejuice-cart-v1";

// Chaque ligne est identifiée par juiceId + formatId.
function lineKey(item) {
  return `${item.juiceId}::${item.formatId}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.items;

    case "ADD": {
      const key = lineKey(action.item);
      const existing = state.find((l) => lineKey(l) === key);
      if (existing) {
        return state.map((l) =>
          lineKey(l) === key
            ? { ...l, quantity: Math.min(99, l.quantity + action.item.quantity) }
            : l
        );
      }
      return [...state, action.item];
    }

    case "SET_QTY":
      return state
        .map((l) =>
          lineKey(l) === action.key ? { ...l, quantity: action.quantity } : l
        )
        .filter((l) => l.quantity > 0);

    case "REMOVE":
      return state.filter((l) => lineKey(l) !== action.key);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  // Hydratation depuis localStorage au montage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persistance.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, l) => n + l.quantity, 0);
    const total = items.reduce((n, l) => n + l.quantity * l.unitPrice, 0);
    return {
      items,
      count,
      total,
      lineKey,
      add: (item) => dispatch({ type: "ADD", item }),
      setQty: (key, quantity) => dispatch({ type: "SET_QTY", key, quantity }),
      remove: (key) => dispatch({ type: "REMOVE", key }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
