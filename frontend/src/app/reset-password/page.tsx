"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRedirectIfAuthenticated } from "../../hooks/useAuth";
import { confirmPasswordReset } from "../../features/auth/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useRedirectIfAuthenticated();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset link is invalid or missing.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await confirmPasswordReset({ token, password });
      setSuccess(response.message);
      setPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      if (submitError instanceof Error) {
        const message = submitError.message.toLowerCase();
        if (message.includes("invalid") || message.includes("expired")) {
          setError("This reset link is invalid or expired.");
        } else {
          setError(submitError.message);
        }
      } else {
        setError("Unable to reset password. Try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <section className="cp-auth-shell">
        <div className="cp-auth-panel">
          <div className="cp-auth-panel__content">
            <span className="cp-auth-panel__logo">Campus Provision</span>
            <h1 className="cp-auth-panel__title">Set a new password</h1>
            <p className="cp-auth-panel__body">
              Choose a new password to get back into your account.
            </p>
          </div>
          <div className="cp-auth-panel__footer">
            Passwords must be at least 8 characters.
          </div>
        </div>

        <div className="cp-auth-form">
          <div className="cp-auth-card">
            <div>
              <h2 className="cp-auth-title">Create a new password</h2>
              <p className="cp-auth-subtitle">
                Enter your new password below.
              </p>
            </div>

            <form className="cp-stack" onSubmit={handleSubmit}>
              <div className="cp-field">
                <label className="cp-label" htmlFor="password">
                  New password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              {error ? <p className="cp-error">{error}</p> : null}
              {success ? <p className="cp-success">{success}</p> : null}

              <div className="cp-auth-actions">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Updating..." : "Update password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
