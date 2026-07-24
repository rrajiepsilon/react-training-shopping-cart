import { createSlice } from '@reduxjs/toolkit';

export const SHIPPING_COST = 4.99;
const TAX_RATE = 0.08;

function getDiscount(subtotal, couponCode) {
  if (couponCode === 'SAVE10') return subtotal * 0.1;
  if (couponCode === 'FLAT20') return 20;
  return 0;
}

function calculateTotals(items, couponCode = '') {
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

function refreshTotals(state) {
  Object.assign(state, calculateTotals(state.items, state.couponCode));
}

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  couponCode: '',
  totalItems: 0,
  grandTotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart(state, action) {
      state.items = action.payload;
      refreshTotals(state);
    },
    addItem(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      refreshTotals(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      refreshTotals(state);
    },
    increaseQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.quantity += 1;
        refreshTotals(state);
      }
    },
    decreaseQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        refreshTotals(state);
      }
    },
    applyCoupon(state, action) {
      const code = action.payload.trim().toUpperCase();
      state.couponCode = code === 'SAVE10' || code === 'FLAT20' ? code : '';
      refreshTotals(state);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = '';
      refreshTotals(state);
    },
  },
});

export const {
  hydrateCart,
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  applyCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
