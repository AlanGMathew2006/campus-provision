"use client";

import { useRequireAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { isReady, user } = useRequireAuth();

  if (!isReady || !user) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        This is a placeholder dashboard. Replace with your content.
      </p>
    </main>
  );
}
