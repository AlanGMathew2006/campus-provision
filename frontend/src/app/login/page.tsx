"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { loginRequest } from "../../features/auth/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export type LoginForm = {
  email: string;
  password: string;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Login failed. Please try again.";

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginRequest({
        email: form.email.trim(),
        password: form.password,
      });
      setAuth(response.token, response.user);
      router.push("/dashboard");
    } catch (submitError) {
      console.error(submitError);
      setError(getErrorMessage(submitError));
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
            <h1 className="cp-auth-panel__title">Welcome to Campus Life</h1>
            <p className="cp-auth-panel__body">
              Track meals, manage your spending, and personalize your dining
              experience across campus.
            </p>
          </div>
          <div className="cp-auth-panel__footer">
            Designed around Cal Poly dining
          </div>
        </div>

        <div className="cp-auth-form">
          <div className="cp-auth-card">
            <div>
              <h2 className="cp-auth-title">Login</h2>
              <p className="cp-auth-subtitle">
                Welcome back. Please enter your details.
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
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="cp-auth-row">
                <label className="cp-auth-row">
                  <input type="checkbox" /> Remember me
                </label>
                <button className="cp-auth-link" type="button">
                  Forgot password?
                </button>
              </div>

              {error ? <p className="cp-error">{error}</p> : null}

              <div className="cp-auth-actions">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                <p className="cp-auth-row">
                  New here?{" "}
                  <a className="cp-auth-link" href="/signup">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
