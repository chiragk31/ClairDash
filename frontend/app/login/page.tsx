import type { Metadata } from "next";

import BrandingPanel from "@/components/auth/BrandingPanel";
import LoginForm     from "@/components/auth/LoginForm";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "Login | ClairDash",
  description: "Sign in to your ClairDash customer operations dashboard.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
// This is a Server Component — LoginForm handles the "use client" boundary.
// Sidebar and Navbar are intentionally absent (no (dashboard) layout).

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">

      {/* Left — Branding */}
      <BrandingPanel />

      {/* Right — Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#12121e] relative">
        <LoginForm />
      </section>

      {/* Footer — absolute so it overlays both halves */}
      <footer className="absolute bottom-0 left-0 w-full flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm">
        <span className="text-lg font-bold text-[#e9e6f7]">ClairDash</span>

        <nav className="flex gap-6 mt-4 md:mt-0" aria-label="Footer links">
          {["Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#757482] hover:text-[#e9e6f7] transition-colors opacity-80 hover:opacity-100"
            >
              {link}
            </a>
          ))}
        </nav>

        <span className="text-[#757482] mt-4 md:mt-0">
          © 2024 ClairDash. Precision through Atmosphere.
        </span>
      </footer>
    </main>
  );
}
