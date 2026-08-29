import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";

import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import store from "@/store";
import { ModalProvider } from "@/contexts/ModalContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppErrorBoundary from "@/components/AppErrorBoundary";

import { fetchProducts } from "@/store/products";

import Home from "@/pages/Home";
import Jewelry from "@/pages/Jewelry";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import Account from "@/pages/Account";
import AccountProfile from "@/pages/account/AccountProfile";
import Orders from "@/pages/account/Orders";
import OrderDetail from "@/pages/account/OrderDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 50,
        order: "createdAt",
      })
    );
  }, [dispatch]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jewelry" element={<Jewelry />} />
        <Route path="/collections" element={<Collections />} />
        <Route
          path="/collections/:collectionId"
          element={<CollectionDetail />}
        />
        <Route
          path="/product/:productId"
          element={<ProductDetail />}
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />

        <Route
          element={
            <ProtectedRoute
              unauthenticatedElement={
                <Navigate to="/login" replace />
              }
            />
          }
        >
          <Route path="/account" element={<Account />}>
            <Route index element={<AccountProfile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Provider store={store}>
            <ModalProvider>
              <Router>
                <ScrollToTop />
                <AuthenticatedApp />
              </Router>
            </ModalProvider>
          </Provider>

          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;