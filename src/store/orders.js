import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { api, normalizeOrder } from "@/api/restClient";
import { loadState } from "@/lib/storage";
import { formatOrderNumber } from "@/lib/format";


const ORDER_STATUSES = ["PAUSE", "PROCESS", "FINISH", "DELETE"];

const extractList = (data) =>
  data?.list ||
  data?.items ||
  data?.orders ||
  data?.docs ||
  (Array.isArray(data) && data[0]?.list) ||
  (Array.isArray(data) ? data : []);

export const fetchOrders = createAsyncThunk("orders/fetchAll", async (_, { rejectWithValue }) => {
  try {
    // Backend /order/all requires orderStatus as a required param, so there is no
    // single call that returns "all" orders — fetch each status and merge them.
    const responses = await Promise.all(
      ORDER_STATUSES.map((orderStatus) =>
        api.orders.all({ page: 1, limit: 50, orderStatus }).catch(() => null)
      )
    );

    const merged = responses.flatMap((data) => (data ? extractList(data) : []));

    if (import.meta.env.DEV) {
      console.log("ORDERS API raw (per status):", responses, "→ merged:", merged);
    }

    const normalized = merged.map(normalizeOrder).filter(Boolean);
    normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
    return normalized;
  } catch (error) {
    if (import.meta.env.DEV) console.error("ORDERS API error:", error);
    return rejectWithValue(error.message);
  }
});

const initialState = {
  // Backend'dan real buyurtmalar fetchOrders() orqali keladi — soxta demo
  // buyurtmalar (Eleanor Vance va h.k.) olib tashlandi.
  list: loadState("orders", []),
  lastPlaced: null,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder(state, action) {
      const { items, total, shipping, payment } = action.payload;
      const n = 100313 + state.list.filter((o) => o.id.startsWith("ord-10")).length;
      const order = {
        id: `ord-${n}`,
        number: formatOrderNumber(n),
        date: new Date().toISOString(),
        items,
        total,
        status: "Processing",
        shipping,
        payment: { method: payment?.method, last4: payment?.last4 },
      };
      state.list.unshift(order);
      state.lastPlaced = order.id;
    },
    clearLastPlaced(state) {
      state.lastPlaced = null;
    },
    hydrateOrders(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.status = "succeeded"; state.list = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.status = "failed"; state.error = action.payload || action.error.message; });
  },

});

export const { placeOrder, clearLastPlaced, hydrateOrders } = slice.actions;
export default slice.reducer;

export const selectOrders = (state) => state.orders.list;
export const selectLastPlacedId = (state) => state.orders.lastPlaced;
export const selectOrderById = createSelector(
  [selectOrders, (_, id) => id],
  (orders, id) => orders.find((o) => o.id === id) || null
);