"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: number | string;
  email: string;
  name?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
};

type AuthContextValue = AuthState & {
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
};

const STORAGE_KEY = "campusprovision.auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredAuth = (): { token: string | null; user: AuthUser | null } => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw) as { token?: string; user?: AuthUser };
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    };
  } catch (error) {
    console.warn("Failed to read auth from storage", error);
    return { token: null, user: null };
  }
};

const writeStoredAuth = (token: string | null, user: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!token || !user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  } catch (error) {
    console.warn("Failed to write auth to storage", error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isReady: false,
  });

  useEffect(() => {
    const stored = readStoredAuth();
    setState({ user: stored.user, token: stored.token, isReady: true });
  }, []);

  useEffect(() => {
    if (!state.isReady) {
      return;
    }
    writeStoredAuth(state.token, state.user);
  }, [state.token, state.user, state.isReady]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const stored = readStoredAuth();
      setState((prev) => ({
        ...prev,
        user: stored.user,
        token: stored.token,
        isReady: true,
      }));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setAuth = useCallback((token: string, user: AuthUser) => {
    setState({ token, user, isReady: true });
  }, []);

  const clearAuth = useCallback(() => {
    setState({ token: null, user: null, isReady: true });
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : prev.user,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setAuth,
      clearAuth,
      updateUser,
    }),
    [state, setAuth, clearAuth, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
