import { createSlice, createSelector } from "@reduxjs/toolkit";
import { selectProducts } from "./products";

const PRICE_BOUNDS = [0, 300000];

const initialState = {
  category: null, // single category or null
  collection: null,
  search: "",
  material: [],
  metal: [],
  stone: [],
  color: [],
  size: [],
  rating: 0,
  priceRange: PRICE_BOUNDS,
  sort: "featured",
  page: 1,
  pageSize: 9,
};

const slice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setCollection(state, action) {
      state.collection = action.payload;
      state.page = 1;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
      state.page = 1;
    },
    setRating(state, action) {
      state.rating = action.payload;
      state.page = 1;
    },
    toggleFacet(state, action) {
      const { key, value } = action.payload;
      const arr = state[key];
      const i = arr.indexOf(value);
      if (i === -1) arr.push(value);
      else arr.splice(i, 1);
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
    hydrate(_, action) {
      return { ...initialState, ...action.payload };
    },
  },
});

export const {
  setCategory,
  setCollection,
  setSearch,
  setSort,
  setPriceRange,
  setRating,
  toggleFacet,
  setPage,
  resetFilters,
  hydrate,
} = slice.actions;

export default slice.reducer;

export const selectFilters = (state) => state.filters;
export const selectActiveFilterCount = createSelector([selectFilters], (f) => {
  let n = 0;
  ["material", "metal", "stone", "color", "size"].forEach((k) => (n += f[k].length));
  if (f.rating) n++;
  if (f.priceRange[0] !== PRICE_BOUNDS[0] || f.priceRange[1] !== PRICE_BOUNDS[1]) n++;
  if (f.category) n++;
  if (f.collection) n++;
  return n;
});

const matches = (product, f) => {
  if (f.category && product.category !== f.category) return false;
  if (f.collection && product.collection !== f.collection) return false;
  if (f.search) {
    const q = f.search.toLowerCase();
    const hay = `${product.name} ${product.category} ${product.material} ${product.stone}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.material.length && !f.material.includes(product.material)) return false;
  if (f.metal.length && !f.metal.includes(product.metal)) return false;
  if (f.stone.length && !f.stone.includes(product.stone)) return false;
  if (f.color.length && !f.color.includes(product.color)) return false;
  if (f.size.length && (!product.sizes || !f.size.some((s) => product.sizes.includes(s)))) return false;
  if (f.rating && product.rating < f.rating) return false;
  if (product.price < f.priceRange[0] || product.price > f.priceRange[1]) return false;
  return true;
};

const sortFn = (sort) => (a, b) => {
  switch (sort) {
    case "price-asc":
      return a.price - b.price;
    case "price-desc":
      return b.price - a.price;
    case "newest":
      return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    case "rating":
      return b.rating - a.rating;
    case "best-selling":
      return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
    default:
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount;
  }
};

export const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (items, f) => {
    const filtered = items.filter((p) => matches(p, f));
    return [...filtered].sort(sortFn(f.sort));
  }
);

export const selectPagedProducts = createSelector(
  [selectFilteredProducts, selectFilters],
  (filtered, f) => {
    const start = (f.page - 1) * f.pageSize;
    return filtered.slice(start, start + f.pageSize);
  }
);

export const selectTotalPages = createSelector([selectFilteredProducts, selectFilters], (filtered, f) =>
  Math.max(1, Math.ceil(filtered.length / f.pageSize))
);