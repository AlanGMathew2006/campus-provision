"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { signupRequest } from "../../features/auth/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

type SignupForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Signup failed. Please try again.";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await signupRequest({
        name: form.name.trim(),
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
            <h1 className="cp-auth-panel__title">Join the Campus Community</h1>
            <p className="cp-auth-panel__body">
              Create your profile to unlock personalized dining recommendations,
              budgets, and meal insights.
            </p>
          </div>
          <div className="cp-auth-panel__footer">
            Built for Cal Poly students
          </div>
        </div>

        <div className="cp-auth-form">
          <div className="cp-auth-card">
            <div>
              <h2 className="cp-auth-title">Create account</h2>
              <p className="cp-auth-subtitle">Start your journey in minutes.</p>
            </div>

            <form className="cp-stack" onSubmit={handleSubmit}>
              <div className="cp-field">
                <label className="cp-label" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Martinez"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
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
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error ? <p className="cp-error">{error}</p> : null}

              <div className="cp-auth-actions">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
                <p className="cp-auth-row">
                  Already have an account?{" "}
                  <a className="cp-auth-link" href="/login">
                    Sign in
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
