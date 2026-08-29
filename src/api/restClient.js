const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3007"
).replace(/\/$/, "");

const TOKEN_KEY = "angelora_access_token";

export const tokenStore = {
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },

  set(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const token = tokenStore.get();

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed (${response.status})`;

    const error = new Error(
      Array.isArray(message) ? message.join(", ") : message
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

const unwrap = (data) => {
  return data?.data ?? data?.result ?? data;
};

const extractToken = (data) => {
  return (
    data?.accesToken ||
    data?.accessToken ||
    data?.access_token ||
    data?.token ||
    data?.jwt ||
    null
  );
};

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${API_URL}/${image.replace(/^\/+/, "")}`;
};

const authApi = {
  async login({ name, password }) {
    const response = await request("/member/login", {
      method: "POST",
      body: JSON.stringify({
        memberNick: name,
        memberPassword: password,
      }),
    });

    const data = unwrap(response);
    const token = extractToken(data);

    if (token) {
      tokenStore.set(token);
    }

    return data?.member || data?.user || data;
  },

  async register({ name, phone, password }) {

    const response = await request("/member/signup", {
      method: "POST",
      body: JSON.stringify({
        memberNick: name,
        memberPhone: phone,
        memberPassword: password,
      }),
    });

    const data = unwrap(response);
    const token = extractToken(data);

    if (token) {
      tokenStore.set(token);
    }

    return data?.member || data?.user || data;
  },

  async me() {
    const response = await request("/member/detail");
    const data = unwrap(response);

    return data?.member || data?.user || data;
  },

  // POST /member/update — real Member schema maydonlari:
  // memberNick, memberPhone, memberAddres, memberDesc, memberImage (fayl)
  async updateProfile(fields = {}, imageFile) {
    let response;

    if (imageFile) {
      const form = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          form.append(key, value);
        }
      });
      form.append("memberImage", imageFile);

      response = await request("/member/update", {
        method: "POST",
        body: form,
      });
    } else {
      response = await request("/member/update", {
        method: "POST",
        body: JSON.stringify(fields),
      });
    }

    const data = unwrap(response);
    return data?.member || data?.user || data;
  },

  async logout() {
    try {
      await request("/member/logout", {
        method: "POST",
      });
    } finally {
      tokenStore.clear();
    }
  },
};

const productsApi = {
  async all(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20),
      order: String(params.order ?? "createdAt"),
    });

    if (params.productCollection) {
      query.set("productCollection", params.productCollection);
    }

    if (params.search) {
      query.set("search", params.search);
    }

    const response = await request(`/product/all?${query.toString()}`);

    return unwrap(response);
  },

  async byId(id) {
    const response = await request(
      `/product/${encodeURIComponent(id)}`
    );

    return unwrap(response);
  },

  // Backendda alohida "best sellers" endpoint yo'q — mavjud /product/all'ni
  // productViews (ko'rishlar soni) bo'yicha kamayish tartibida so'raymiz,
  // chunki schema'da "bestSeller" degan alohida maydon yo'q.
  async bestSellers(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 8),
      order: "productViews",
    });

    const response = await request(`/product/all?${query.toString()}`);

    return unwrap(response);
  },

  // Backendda alohida "new arrivals" endpoint yo'q — /product/all'ning
  // standart tartibi createdAt bo'yicha kamayish (eng yangisi birinchi),
  // shuning uchun shunchaki limit bilan chaqiramiz.
  async newArrivals(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 8),
      order: "createdAt",
    });

    const response = await request(`/product/all?${query.toString()}`);

    return unwrap(response);
  },
};

const ordersApi = {
  async create(payload) {
    const response = await request("/order/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return unwrap(response);
  },

  async all(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 50),
      // Backend /order/all requires orderStatus as a required query param.
      orderStatus: String(params.orderStatus ?? "PROCESS"),
    });

    const response = await request(`/order/all?${query.toString()}`);
    return unwrap(response);
  },

  async update(payload) {
    const response = await request("/order/update", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return unwrap(response);
  },
};

export const normalizeProduct = (raw) => {
  if (!raw) {
    return null;
  }

  const id = raw.id || raw._id || raw.productId;

  if (!id) {
    return null;
  }

  const rawImages =
    raw.images ||
    raw.productImages ||
    (raw.productImage ? [raw.productImage] : []);

  const images = (
    Array.isArray(rawImages)
      ? rawImages
      : [rawImages]
  )
    .filter(Boolean)
    .map(getImageUrl);

  const collection = String(
    raw.collection ||
      raw.productCollection ||
      "rings"
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const category = String(
    raw.category ||
      raw.productCategory ||
      raw.productCollection ||
      "rings"
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const material =
    raw.material ||
    raw.productMaterial ||
    "GOLD";

  // Filtrlash uchun xom backend enum qiymati (GOLD/WHITE_GOLD/ROSE_GOLD/PLATINUM/SILVER)
  const materialType = raw.productMaterial || null;

  const carat =
    raw.carat ??
    raw.productCarat ??
    null;

  const name =
    raw.name ||
    raw.productName ||
    "ANGELORA Piece";

  const price = Number(
    raw.price ??
      raw.productPrice ??
      0
  );

  const stock = Number(
    raw.stock ??
      raw.productLeftCount ??
      0
  );

  return {
    ...raw,

    id: String(id),

    materialType,

    slug:
      raw.slug ||
      String(id),

    name,

    price,

    stock,

    category,

    collection,

    material: carat
      ? `${material} ${carat}K`
      : material,

    metal:
      raw.metal ||
      material,

    // Backendda mahsulotning metali bitta va statik (variant tanlash yo'q) —
    // shu UI komponentlar (metal selector) buzilmasligi uchun bir elementli massiv sifatida beramiz.
    metals: [
      raw.metal || material,
    ],

    stone:
      raw.stone ||
      raw.productStone ||
      "None",

    color:
      raw.color ||
      "Gold",

    carat,

    images,

    sizes:
      raw.sizes ||
      raw.productSizes ||
      null,

    rating: Number(
      raw.rating ?? 4.8
    ),

    reviewCount: Number(
      raw.reviewCount ?? 0
    ),

    bestSeller:
      Boolean(raw.bestSeller),

    newArrival:
      Boolean(raw.newArrival),

    featured:
      Boolean(raw.featured ?? raw.productFeatured),

    badge:
      raw.badge ||
      null,

    description:
      raw.description ||
      raw.productDesc ||
      "",

    details:
      raw.details ||
      "",

    shipping:
      raw.shipping ||
      "Complimentary insured shipping.",

    care:
      raw.care ||
      "Handle with care and store separately.",
  };
};

// Backend order status enum → UI'da ishlatiladigan label
const ORDER_STATUS_LABELS = {
  PAUSE: "Pending",
  PROCESS: "Processing",
  FINISH: "Delivered",
  DELETE: "Cancelled",
};

// Backend /order/all natijasini (Order + qo'shib berilgan orderItems/productData)
// UI'ning kutgan tekis shakliga o'giradi.
export const normalizeOrder = (raw) => {
  if (!raw) {
    return null;
  }

  const id = raw._id || raw.id;

  if (!id) {
    return null;
  }

  const productById = new Map(
    (raw.productData || []).map((p) => [String(p._id || p.id), p])
  );

  const items = (raw.orderItems || []).map((it) => {
    const product = productById.get(String(it.productId));
    const rawImages = product?.productImages || [];

    return {
      productId: String(it.productId),
      name: product?.productName || "ANGELORA Piece",
      image: rawImages[0] ? getImageUrl(rawImages[0]) : null,
      price: Number(it.itemPrice ?? 0),
      qty: Number(it.itemQuantity ?? 1),
      metal: product?.productMaterial || null,
      size: null,
    };
  });

  return {
    id: String(id),
    number: `#${String(id).slice(-6).toUpperCase()}`,
    date: raw.createdAt || new Date().toISOString(),
    items,
    total: Number(raw.orderTotal ?? 0),
    delivery: Number(raw.orderDelivery ?? 0),
    status: ORDER_STATUS_LABELS[raw.orderStatus] || "Pending",
    // Backend hozircha yetkazib berish manzilini saqlamaydi (Order.model.ts'da yo'q).
    shipping: raw.shipping || null,
    payment: raw.payment || null,
  };
};

export const api = {
  url: API_URL,
  request,
  auth: authApi,
  products: productsApi,
  orders: ordersApi,
};

export default api;