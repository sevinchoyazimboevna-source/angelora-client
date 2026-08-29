import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { api, normalizeProduct } from "@/api/restClient";
import { CATEGORIES } from "@/data/products";

const getList = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.docs)) return data.docs;

  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.products)) return data.data.products;

  return [];
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.products.all(params);

      console.log("PRODUCT API:", response);

      return getList(response)
        .map(normalizeProduct)
        .filter(Boolean);
    } catch (error) {
      console.error("PRODUCT ERROR:", error);
      return rejectWithValue(error.message || "Failed to load products");
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.products.bestSellers(params);

      return getList(response)
        .map(normalizeProduct)
        .filter(Boolean);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load best sellers");
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.products.newArrivals(params);

      return getList(response)
        .map(normalizeProduct)
        .filter(Boolean);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load new arrivals");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.products.byId(id);
      const product = normalizeProduct(response);

      if (!product) {
        return rejectWithValue("Product not found");
      }

      return product;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load product");
    }
  }
);

const initialState = {
  items: [],
  // Backendda alohida "/category" endpoint yo'q — kategoriyalar CategoryShowcase'da
  // ham ishlatiladigan statik CATEGORIES ro'yxatidan olinadi (data/products.js).
  categories: CATEGORIES,
  collections: [
    { id: "all", name: "All", image: "/img/all.jpg" },
    { id: "rings", name: "Rings", image: "/img/rings.jpg" },
    { id: "necklaces", name: "Necklaces", image: "/img/ne.jpg" },
    { id: "earrings", name: "Earrings", image: "/img/er.jpg" },
    { id: "bracelets", name: "Bracelets", image: "/img/brr.jpg" },
    { id: "watches", name: "Watches", image: "/img/wt.jpg" },
  ],
  status: "idle",
  error: null,
  detail: {
    item: null,
    status: "idle",
    error: null,
  },
  bestSellers: {
    items: [],
    status: "idle",
    error: null,
  },
  newArrivals: {
    items: [],
    status: "idle",
    error: null,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = {
        item: null,
        status: "idle",
        error: null,
      };
    },
    clearProducts(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;

        console.log("PRODUCTS IN REDUX:", action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detail = {
          item: null,
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detail = {
          item: action.payload,
          status: "succeeded",
          error: null,
        };

        const exists = state.items.some(
          (product) => product.id === action.payload.id
        );

        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detail = {
          item: null,
          status: "failed",
          error: action.payload || "Failed to load product",
        };
      })
      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellers.status = "loading";
        state.bestSellers.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers.status = "succeeded";
        state.bestSellers.items = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellers.status = "failed";
        state.bestSellers.error = action.payload || "Failed to load best sellers";
      })
      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivals.status = "loading";
        state.newArrivals.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals.status = "succeeded";
        state.newArrivals.items = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.newArrivals.status = "failed";
        state.newArrivals.error = action.payload || "Failed to load new arrivals";
      });
  },
});

export const { clearDetail, clearProducts } = productsSlice.actions;

export default productsSlice.reducer;

export const selectProductsState = (state) => state.products;

export const selectProducts = (state) => state.products.items;

export const selectProductsStatus = (state) => state.products.status;

export const selectProductsError = (state) => state.products.error;

export const selectCategories = (state) => state.products.categories;

export const selectCollections = (state) => state.products.collections;

export const selectProductDetail = (state) => state.products.detail;

export const selectProductById = createSelector(
  [selectProducts, (_, id) => id],
  (products, id) =>
    products.find(
      (product) => product.id === id || product.slug === id
    ) || null
);

export const selectFeaturedProducts = createSelector(
  [selectProducts],
  (products) => products.filter((product) => product.featured)
);

export const selectBestSellers = (state) => state.products.bestSellers.items;

export const selectBestSellersStatus = (state) => state.products.bestSellers.status;

export const selectNewArrivals = (state) => state.products.newArrivals.items;

export const selectNewArrivalsStatus = (state) => state.products.newArrivals.status;

export const selectProductsByCategory = createSelector(
  [selectProducts, (_, category) => category],
  (products, category) =>
    category
      ? products.filter((product) => product.category === category)
      : products
);

export const selectProductsByCollection = createSelector(
  [selectProducts, (_, collection) => collection],
  (products, collection) =>
    collection
      ? products.filter((product) => product.collection === collection)
      : products
);

export const selectRelatedProducts = createSelector(
  [selectProducts, (_, product) => product],
  (products, product) =>
    product
      ? products
          .filter(
            (item) =>
              item.category === product.category &&
              item.id !== product.id
          )
          .slice(0, 4)
      : []
);

export const selectCollectionById = createSelector(
  [selectCollections, (_, id) => id],
  (collections, id) =>
    collections.find(
      (collection) =>
        collection.id === id ||
        collection.name?.toLowerCase() === String(id).toLowerCase()
    ) || null
);