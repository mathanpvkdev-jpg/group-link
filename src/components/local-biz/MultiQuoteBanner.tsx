'use client';

import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ShieldCheck, Clock, PhoneCall } from 'lucide-react';
import { SEED_CATEGORIES } from '@/lib/local-biz/seed-data';

interface MultiQuoteBannerProps {
  defaultCategory?: string;
  defaultCity?: string;
}

/**
 * Sulekha / Justdial style rapid requirement matcher ("Get Free Quotes in 60s")
 */
export const MultiQuoteBanner: React.FC<MultiQuoteBannerProps> = ({
  defaultCategory = '',
  defaultCity = '',
}) => {
  const [category, setCategory] = useState(defaultCategory || SEED_CATEGORIES[0]?.name || 'Home Services');
  const [city, setCity] = useState(defaultCity);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 6 || !city.trim()) {
      setError('Please enter your name, city/pincode, and valid mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const resp = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: 'multi-quote-broadcast',
          customerName: name.trim(),
          customerPhone: phone.trim(),
          pincode: city.match(/\b\d{6}\b/)?.[0] || null,
          requirement: `[${category}] in ${city.trim()}: ${requirement.trim() || 'Requesting best quote & availability'}`,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => null);
        throw new Error(data?.error?.message || 'Unable to submit quote request.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-7 border border-blue-500/30 shadow-xl relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>Free Multi-Vendor Quote Match</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black leading-tight">
            Get Best Quotes from Verified Local Experts in 60s
          </h2>
          <p className="text-xs text-blue-100/85 leading-relaxed">
            Skip calling dozens of numbers. Tell us what you need once and connect directly with trusted service providers near you with zero broker fees.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-emerald-300 pt-1">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              No Login Needed
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Fast Callback
            </span>
            <span className="inline-flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              100% Free
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
          {submitted ? (
            <div className="text-center py-4 space-y-2.5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-extrabold text-white">
                Requirement Sent to Local Specialists!
              </h3>
              <p className="text-xs text-blue-100 max-w-md mx-auto">
                Verified <strong>{category}</strong> providers in <strong>{city}</strong> have received your enquiry and will contact you on <strong>{phone}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setRequirement('');
                }}
                className="mt-1 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Post Another Requirement
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-100 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  aria-label="Select service category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-semibold outline-none cursor-pointer"
                >
                  {SEED_CATEGORIES.slice(0, 20).map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  required
                  placeholder="City or Pincode (e.g. Chennai / 600017)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Brief requirement (optional, e.g. 2 BHK painting or AC gas refill)"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending...' : 'Get Free Quotes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
