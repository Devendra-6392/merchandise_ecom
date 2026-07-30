"use client";

import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-primary text-white py-24 px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <span className="font-body text-xs font-bold tracking-[0.25em] text-white/80 uppercase block mb-3">
            PRIVATE CLIENT DISPATCH
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            RECEIVE PRIVATE DROP NOTIFICATIONS
          </h2>
          <p className="font-body text-sm text-white/90 font-light max-w-lg leading-relaxed">
            Subscribers receive 1-hour priority access to limited capsule releases before public availability. No spam, strictly archival announcements.
          </p>
        </div>

        <div className="lg:col-span-6">
          {submitted ? (
            <div className="bg-white/10 p-8 border border-white/30 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 text-white">check_circle</span>
              <h3 className="font-display text-2xl font-bold text-white mb-1">ACCESS GRANTED</h3>
              <p className="font-body text-xs text-white/80 tracking-wider uppercase">
                YOU HAVE BEEN ADDED TO THE PRIVATE ORANGERED REGISTRY.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL ADDRESS..."
                className="bg-white/10 text-white placeholder:text-white/60 px-6 py-4 font-body text-xs tracking-wider uppercase outline-none focus:bg-white/20 border border-white/30 flex-grow rounded-none transition-colors"
              />
              <button
                type="submit"
                className="bg-inverse-surface hover:bg-black text-white px-8 py-4 font-body text-xs font-bold tracking-[0.2em] uppercase rounded-none transition-all duration-300 horizontal-expansion cursor-pointer shrink-0"
              >
                JOIN REGISTRY
              </button>
            </form>
          )}
          <p className="font-body text-[10px] text-white/60 tracking-wider uppercase mt-4">
            BY SUBSCRIBING YOU AGREE TO OUR PRIVACY POLICY AND TERMS OF CURATION.
          </p>
        </div>
      </div>
    </section>
  );
}
