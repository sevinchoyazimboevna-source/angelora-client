import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "@/lib/storage";

const MAX = 8;

const initialState = {
  ids: loadState("recentlyViewed", []),
};

const slice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    addRecentlyViewed(state, action) {
      const id = action.payload;
      state.ids = [id, ...state.ids.filter((x) => x !== id)].slice(0, MAX);
    },
    clearRecentlyViewed(state) {
      state.ids = [];
    },
    hydrateRecentlyViewed(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed, hydrateRecentlyViewed } = slice.actions;
export default slice.reducer;

export const selectRecentlyViewedIds = (state) => state.recentlyViewed.ids;