import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, tokenStore } from "../api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = tokenStore.get();
    if (!t) { setLoading(false); return; }
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (data) => {
    const { token, user } = await api.register(data);
    tokenStore.set(token);
    setUser(user);
  }, []);

  const login = useCallback(async (data) => {
    const { token, user } = await api.login(data);
    tokenStore.set(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch { /* ignore */ }
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
