import { createSlice, createSelector } from "@reduxjs/toolkit";
import { loadState } from "@/lib/storage";

const initialState = {
  ids: loadState("wishlist", []),
};

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i === -1) state.ids.unshift(id);
      else state.ids.splice(i, 1);
    },
    removeFromWishlist(state, action) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    clearWishlist(state) {
      state.ids = [];
    },
    hydrateWishlist(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, hydrateWishlist } = slice.actions;
export default slice.reducer;

export const selectWishlist = (state) => state.wishlist;
export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectWishlistCount = createSelector([selectWishlistIds], (ids) => ids.length);
export const selectIsWishlisted = createSelector(
  [selectWishlistIds, (_, id) => id],
  (ids, id) => ids.includes(id)
);