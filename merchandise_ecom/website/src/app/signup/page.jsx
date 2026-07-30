"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignUpPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    setFormError("");
    clearError();

    if (!name.trim()) {
      setFormError("PLEASE ENTER YOUR FULL NAME.");
      return false;
    }

    if (!email.trim()) {
      setFormError("PLEASE ENTER YOUR EMAIL ADDRESS.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("PLEASE ENTER A VALID EMAIL ADDRESS.");
      return false;
    }

    if (!password || password.length < 6) {
      setFormError("PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG.");
      return false;
    }

    if (password !== confirmPassword) {
      setFormError("PASSWORDS DO NOT MATCH.");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const res = await signup(name.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/profile");
    } else {
      setFormError(res.error || "REGISTRATION FAILED. PLEASE TRY AGAIN.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-10 border border-outline-variant/40 shadow-2xl">
          <div className="text-center mb-8">
            <span className="font-body text-xs font-bold tracking-[0.25em] text-primary uppercase block mb-2">
              CLIENT REGISTRATION
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface">JOIN ATELIER REGISTRY</h1>
            <p className="font-body text-xs text-on-surface-variant font-light mt-2">
              CREATE YOUR CLIENT ACCOUNT FOR DISPATCH TRACKING & CUSTOM MERCHANDISE.
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

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError("");
                }}
                placeholder="ENTER YOUR FULL NAME..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary uppercase text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>

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
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                PASSWORD
              </label>
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

            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formError) setFormError("");
                }}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary text-on-surface"
              />
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
                  <span>CREATING REGISTRY ACCOUNT...</span>
                </>
              ) : (
                "CREATE CLIENT ACCOUNT"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant/30 pt-6 text-center">
            <p className="font-body text-xs text-on-surface-variant">
              ALREADY REGISTERED?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline uppercase tracking-wider">
                SIGN IN HERE →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
