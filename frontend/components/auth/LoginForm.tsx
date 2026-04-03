"use client";

// ─── LoginForm ────────────────────────────────────────────────────────────────
// Controlled form with fetch-based auth, loading state, and error display.
// TODO: Replace API_URL with an env var: process.env.NEXT_PUBLIC_API_URL

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialLoginButton from "./SocialLoginButton";

const API_URL = "http://localhost:8000/api/auth/login";

interface FormState {
  email:    string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Invalid credentials. Please try again.");
      }

      // TODO: persist token from response (e.g. set cookie / localStorage)
      // const { access_token } = await res.json();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── Google OAuth placeholder ───────────────────────────────────────────────

  function handleGoogleLogin() {
    // TODO: signIn("google") via NextAuth or redirect to OAuth endpoint
    console.log("Google login — not yet implemented");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-4xl font-bold text-[#e9e6f7] tracking-tight">Welcome Back</h2>
        <p className="text-[#aba9b9]">Sign in to your dashboard</p>
      </div>

      {/* Card */}
      <div className="bg-[#181826] p-8 md:p-10 space-y-6 shadow-2xl">
        <form onSubmit={handleLogin} noValidate className="space-y-5">

          {/* Email */}
          <InputField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />

          {/* Password */}
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
            rightSlot={
              <a
                href="#"
                className="text-xs text-[#bd9dff] font-medium hover:text-[#b28cff] transition-colors"
              >
                Forgot password?
              </a>
            }
          />

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="text-[#ff6e84] text-xs font-semibold bg-[#a70138]/10 border border-[#a70138]/20 px-4 py-3"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            id="sign-in-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#8a4cfc] text-[#3c0089] font-bold py-4 uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#bd9dff] flex items-center justify-center gap-2"
            style={{ boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-[#3c0089]"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#474754] opacity-30" />
          <span className="flex-shrink mx-4 text-xs font-bold uppercase text-[#aba9b9]">or</span>
          <div className="flex-grow border-t border-[#474754] opacity-30" />
        </div>

        {/* Google */}
        <SocialLoginButton provider="google" onClick={handleGoogleLogin} disabled={loading} />
      </div>

      {/* Footer line */}
      <p className="text-center text-sm text-[#aba9b9]">
        Don&apos;t have an account?{" "}
        <a href="#" className="text-[#bd9dff] font-bold hover:underline">
          Request Access
        </a>
      </p>
    </div>
  );
}
