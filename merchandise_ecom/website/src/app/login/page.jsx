"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    setFormError("");
    clearError();

    if (!email.trim()) {
      setFormError("PLEASE ENTER YOUR EMAIL ADDRESS.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("PLEASE ENTER A VALID EMAIL ADDRESS.");
      return false;
    }

    if (!password) {
      setFormError("PLEASE ENTER YOUR PASSWORD.");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/profile");
    } else {
      setFormError(res.error || "SIGN IN FAILED. PLEASE CHECK YOUR CREDENTIALS.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-10 border border-outline-variant/40 shadow-2xl">
          <div className="text-center mb-8">
            <span className="font-body text-xs font-bold tracking-[0.25em] text-primary uppercase block mb-2">
              CLIENT REGISTRY
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface">SIGN IN</h1>
            <p className="font-body text-xs text-on-surface-variant font-light mt-2">
              ACCESS YOUR PRIVATE ATELIER RESERVATIONS & ORDER HISTORY.
            </p>
          </div>

          {(formError || authError) && (
            <div className="mb-6 bg-error/10 border border-error/40 p-4 text-xs font-body text-error flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{formError || authError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  clearError();
                }}
                className="text-error font-bold text-sm leading-none cursor-pointer hover:opacity-70"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError("");
                }}
                placeholder="ENTER EMAIL ADDRESS..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary uppercase text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider">
                  PASSWORD
                </label>
                <a href="#" className="text-[10px] font-body text-primary font-bold hover:underline uppercase">
                  FORGOT PASSWORD?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 pr-10 text-xs font-body outline-none focus:border-primary text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer material-symbols-outlined text-lg"
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-primary-container cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : (
                "SIGN IN TO ACCOUNT"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant/30 pt-6 text-center">
            <p className="font-body text-xs text-on-surface-variant">
              NEW TO ORANGERED STUDIO?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline uppercase tracking-wider">
                JOIN PRIVATE REGISTRY →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
