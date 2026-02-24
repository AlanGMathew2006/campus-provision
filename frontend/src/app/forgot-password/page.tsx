"use client";

import { useState } from "react";
import { useRedirectIfAuthenticated } from "../../hooks/useAuth";
import { requestPasswordReset } from "../../features/auth/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useRedirectIfAuthenticated();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset({ email: email.trim() });
      setSuccess(response.message);
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Unable to request a reset. Try again later.");
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
            <h1 className="cp-auth-panel__title">Reset your password</h1>
            <p className="cp-auth-panel__body">
              We will send you a secure link to reset your password.
            </p>
          </div>
          <div className="cp-auth-panel__footer">
            Need help? Contact support.
          </div>
        </div>

        <div className="cp-auth-form">
          <div className="cp-auth-card">
            <div>
              <h2 className="cp-auth-title">Forgot password</h2>
              <p className="cp-auth-subtitle">
                Enter your email to receive a reset link.
              </p>
            </div>

            <form className="cp-stack" onSubmit={handleSubmit}>
              <div className="cp-field">
                <label className="cp-label" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@calpoly.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {error ? <p className="cp-error">{error}</p> : null}
              {success ? <p className="cp-success">{success}</p> : null}

              <div className="cp-auth-actions">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
