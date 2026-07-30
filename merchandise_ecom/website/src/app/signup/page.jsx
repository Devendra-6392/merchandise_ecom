"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    router.push("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 md:p-10 border border-outline-variant/40 shadow-2xl">
          <div className="text-center mb-8">
            <span className="font-body text-xs font-bold tracking-[0.25em] text-primary uppercase block mb-2">
              ORANGERED MEMBERSHIP
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface">JOIN PRIVATE REGISTRY</h1>
            <p className="font-body text-xs text-on-surface-variant font-light mt-2">
              ENJOY PRIORITY ACCESS TO LIMITED RUN CAPSULES & PRIVATE SHOWINGS.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="DEVENDRA BHATT..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ENTER EMAIL ADDRESS..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="CREATE PASSWORD..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="CONFIRM PASSWORD..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer shadow-lg"
            >
              CREATE CLIENT ACCOUNT
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
