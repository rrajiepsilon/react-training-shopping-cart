import { create } from "zustand";
import { persist } from "zustand/middleware";

function recalcTotals(items) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, subtotal };
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.id === product.id);

        const nextItems = existing
          ? items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [
              ...items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity,
              },
            ];

        set({ items: nextItems, ...recalcTotals(nextItems) });
      },

      updateQuantity: (id, quantity) => {
        const items = get().items;
        const nextItems =
          quantity <= 0
            ? items.filter((item) => item.id !== id)
            : items.map((item) => (item.id === id ? { ...item, quantity } : item));

        set({ items: nextItems, ...recalcTotals(nextItems) });
      },

      removeItem: (id) => {
        const nextItems = get().items.filter((item) => item.id !== id);
        set({ items: nextItems, ...recalcTotals(nextItems) });
      },

      clearCart: () => set({ items: [], itemCount: 0, subtotal: 0 }),
    }),
    {
      name: "cartly-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // only persist raw items
      onRehydrateStorage: () => (state) => {
        // Recompute derived totals after rehydrating from localStorage
        if (state) {
          const { itemCount, subtotal } = recalcTotals(state.items);
          state.itemCount = itemCount;
          state.subtotal = subtotal;
        }
      },
    }
  )
);
