import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ensureDemoUsers,
  getCurrentUser,
  login as loginService,
  loginDemo as loginDemoService,
  logout as logoutService,
  registerCustomer as registerCustomerService,
  registerTailor as registerTailorService,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureDemoUsers()
      .then(() => setUser(getCurrentUser()))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      refresh: () => setUser(getCurrentUser()),
      async login(identifier, password) {
        const result = await loginService(identifier, password);
        if (result.ok) setUser(result.user);
        return result;
      },
      async loginDemo(kind) {
        const result = await loginDemoService(kind);
        if (result.ok) setUser(result.user);
        return result;
      },
      async registerCustomer(payload) {
        const result = await registerCustomerService(payload);
        if (result.ok) setUser(result.user);
        return result;
      },
      async registerTailor(payload) {
        const result = await registerTailorService(payload);
        if (result.ok) setUser(result.user);
        return result;
      },
      logout() {
        logoutService();
        setUser(null);
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
