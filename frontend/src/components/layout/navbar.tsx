"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, clearAuth, isReady } = useAuth();
  const router = useRouter();

  if (!isReady) {
    return null;
  }

  return (
    <nav className="cp-nav">
      <div className="cp-nav__inner">
        <Link className="cp-brand" href="/">
          Campus Provision
        </Link>

        {user ? (
          <div className="cp-nav__links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/meals">Meals</Link>
            <Link href="/spending">Spending</Link>
          </div>
        ) : null}

        <div className="cp-nav__actions">
          {user ? (
            <button
              className="cp-button cp-button--ghost cp-button--sm"
              type="button"
              onClick={async () => {
                await clearAuth();
                router.push("/login");
              }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link className="cp-link" href="/login">
                Log in
              </Link>
              <Link
                className="cp-button cp-button--primary cp-button--sm"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
