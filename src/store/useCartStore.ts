import { create } from 'zustand';
import type { CartItem, CartState, CartTotals, CouponCode } from '../shared/types';

export const SHIPPING_COST = 4.99;
const TAX_RATE = 0.08;

function getDiscount(subtotal: number, couponCode: CouponCode): number {
  if (couponCode === 'SAVE10') return subtotal * 0.1;
  if (couponCode === 'FLAT20') return 20;
  return 0;
}

function calculateTotals(items: CartItem[], couponCode: CouponCode = ''): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = getDiscount(subtotal, couponCode);
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * TAX_RATE;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = taxable + SHIPPING_COST + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    couponCode,
    totalItems,
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  couponCode: '',
  totalItems: 0,
  grandTotal: 0,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      const items = existing
        ? state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...state.items, { ...product, quantity }];
      return { items, ...calculateTotals(items, state.couponCode) };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== productId);
      return { items, ...calculateTotals(items, state.couponCode) };
    }),

  increaseQuantity: (productId) =>
    set((state) => {
      const item = state.items.find((entry) => entry.id === productId);
      if (!item) return state;
      const items = state.items.map((entry) =>
        entry.id === productId ? { ...entry, quantity: entry.quantity + 1 } : entry,
      );
      return { items, ...calculateTotals(items, state.couponCode) };
    }),

  decreaseQuantity: (productId) =>
    set((state) => {
      const item = state.items.find((entry) => entry.id === productId);
      if (!item || item.quantity <= 1) return state;
      const items = state.items.map((entry) =>
        entry.id === productId ? { ...entry, quantity: entry.quantity - 1 } : entry,
      );
      return { items, ...calculateTotals(items, state.couponCode) };
    }),

  applyCoupon: (code) =>
    set((state) => {
      const normalized = code.trim().toUpperCase();
      const couponCode: CouponCode =
        normalized === 'SAVE10' || normalized === 'FLAT20' ? normalized : '';
      return calculateTotals(state.items, couponCode);
    }),

  clearCart: () =>
    set({
      items: [],
      ...calculateTotals([], ''),
    }),
}));
