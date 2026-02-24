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
  isReady: boolean;
};

type AuthContextValue = AuthState & {
  setAuth: (user: AuthUser) => void;
  clearAuth: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { user?: AuthUser };
    return data.user ?? null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isReady: false,
  });

  useEffect(() => {
    let isMounted = true;
    fetchCurrentUser().then((user) => {
      if (!isMounted) {
        return;
      }
      setState({ user, isReady: true });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setAuth = useCallback((user: AuthUser) => {
    setState({ user, isReady: true });
  }, []);

  const clearAuth = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout errors.
    }
    setState({ user: null, isReady: true });
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
