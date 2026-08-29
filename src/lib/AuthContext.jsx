import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, tokenStore } from '@/api/restClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = async () => {
    if (!tokenStore.get()) {
      setIsLoadingAuth(false); setIsAuthenticated(false); setAuthChecked(true); return null;
    }
    try {
      setIsLoadingAuth(true); setAuthError(null);
      const currentUser = await api.auth.me();
      setUser(currentUser); setIsAuthenticated(true); return currentUser;
    } catch (error) {
      tokenStore.clear(); setUser(null); setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) setAuthError({ type: 'auth_required', message: error.message });
      return null;
    } finally { setIsLoadingAuth(false); setAuthChecked(true); }
  };

  useEffect(() => { checkUserAuth(); }, []);

  const logout = async (shouldRedirect = true) => {
    await api.auth.logout();
    setUser(null); setIsAuthenticated(false);
    if (shouldRedirect) window.location.href = '/';
  };

  const navigateToLogin = () => { window.location.href = '/login'; };

  return <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings: false, authError, appPublicSettings: null, authChecked, logout, navigateToLogin, checkUserAuth, checkAppState: checkUserAuth }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
