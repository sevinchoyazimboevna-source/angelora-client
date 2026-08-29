import { configureStore } from "@reduxjs/toolkit";
import productsReducer, { fetchProducts } from "./products";
import filtersReducer from "./filters";
import cartReducer from "./cart";
import wishlistReducer from "./wishlist";
import recentlyViewedReducer from "./recentlyViewed";
import ordersReducer from "./orders";
import profileReducer from "./profile";
import { saveState } from "@/lib/storage";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer,
    orders: ordersReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Selective persistence — only cart, wishlist, recently viewed, orders & profile.
// Products are never persisted so inventory stays fresh.
let t;
store.subscribe(() => {
  clearTimeout(t);
  t = setTimeout(() => {
    const s = store.getState();
    saveState("cart", s.cart.items);
    saveState("cartDiscount", { discountCode: s.cart.discountCode, discountRate: s.cart.discountRate });
    saveState("wishlist", s.wishlist.ids);
    saveState("recentlyViewed", s.recentlyViewed.ids);
    saveState("orders", s.orders.list);
    saveState("profile", s.profile.info);
    saveState("profileSettings", s.profile.settings);
  }, 300);
});

// Kick off the initial catalog load.
store.dispatch(fetchProducts());

export default store;