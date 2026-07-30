"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/profile");
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS..."
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary uppercase"
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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer shadow-lg"
            >
              SIGN IN TO ACCOUNT
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
