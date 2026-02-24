"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

export const useRequireAuth = (redirectTo = "/login") => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!user) {
      router.replace(redirectTo);
    }
  }, [isReady, user, router, redirectTo]);

  return { user, isReady };
};

export const useRedirectIfAuthenticated = (redirectTo = "/dashboard") => {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (user) {
      router.replace(redirectTo);
    }
  }, [isReady, user, router, redirectTo]);

  return { user, isReady };
};
