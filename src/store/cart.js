import { createSlice, createSelector } from "@reduxjs/toolkit";
import { loadState, saveState } from "@/lib/storage";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FLAT = 25;
const TAX_RATE = 0.08;
const DISCOUNT_CODES = { ANGELORA10: 0.1, WELCOME: 0.15 };

const persistedDiscount = loadState("cartDiscount", { discountCode: null, discountRate: 0 });

const initialState = {
  items: loadState("cart", []),
  discountCode: persistedDiscount.discountCode,
  discountRate: persistedDiscount.discountRate,
};

const keyOf = (item) => `${item.productId}|${item.metal}|${item.size || "-"}`;

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const incoming = action.payload;
      const key = keyOf(incoming);
      const existing = state.items.find((i) => keyOf(i) === key);
      if (existing) {
        existing.qty = Math.min(99, existing.qty + (incoming.qty || 1));
      } else {
        state.items.push({ ...incoming, qty: incoming.qty || 1, key });
      }
    },
    updateQty(state, action) {
      const { key, qty } = action.payload;
      const item = state.items.find((i) => keyOf(i) === key);
      if (item) item.qty = Math.max(1, Math.min(99, qty));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => keyOf(i) !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.discountCode = null;
      state.discountRate = 0;
    },
    applyDiscount(state, action) {
      const code = String(action.payload || "").toUpperCase();
      const rate = DISCOUNT_CODES[code];
      if (rate) {
        state.discountCode = code;
        state.discountRate = rate;
      } else {
        state.discountCode = null;
        state.discountRate = 0;
      }
    },
    removeDiscount(state) {
      state.discountCode = null;
      state.discountRate = 0;
    },
    hydrateCart(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
  applyDiscount,
  removeDiscount,
  hydrateCart,
} = slice.actions;

export default slice.reducer;

// ---- Selectors (memoized) ----
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((n, i) => n + i.qty, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0)
);

export const selectCartDiscount = createSelector(
  [selectCartSubtotal, (state) => state.cart.discountRate],
  (subtotal, rate) => Math.round(subtotal * rate)
);

export const selectCartShipping = createSelector(
  [selectCartSubtotal, selectCartDiscount],
  (subtotal, discount) => {
    if (subtotal === 0) return 0;
    return subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  }
);

export const selectCartTax = createSelector(
  [selectCartSubtotal, selectCartDiscount],
  (subtotal, discount) => Math.round((subtotal - discount) * TAX_RATE)
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectCartShipping, selectCartTax],
  (subtotal, discount, shipping, tax) => subtotal - discount + shipping + tax
);

export const selectCartSummary = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectCartShipping, selectCartTax, selectCartTotal, selectCartCount],
  (subtotal, discount, shipping, tax, total, count) => ({
    subtotal,
    discount,
    shipping,
    tax,
    total,
    count,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount)),
  })
);