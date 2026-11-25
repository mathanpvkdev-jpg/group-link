'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseUnit } from '@/components/AdSenseUnit';
import { SafetyWarningBanner } from '@/components/SafetyWarningBanner';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Link2,
  Globe,
  PlusCircle,
} from 'lucide-react';
import { CATEGORIES, SAFE_COUNTRIES } from '@/lib/data';
import { Platform } from '@/lib/types';
import { GroupStore } from '@/lib/groups/store';
import { ENABLE_GOOGLE_FORMS, FORMS_CONFIG } from '@/lib/forms-config';

export default function SubmitGroupPage() {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('whatsapp');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'Technology');
  const [inviteUrl, setInviteUrl] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Chennai');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [agreed, setAgreed] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdGroup, setCreatedGroup] = useState<{ name: string; slug: string; platform: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your Group or Channel Name.');
      return;
    }
    if (!inviteUrl.trim() || !inviteUrl.startsWith('http')) {
      setError('Please enter a valid Invite Link URL starting with https://');
      return;
    }
    if (!description.trim()) {
      setError('Please write a short description of your group.');
      return;
    }
    if (!agreed) {
      setError('Please confirm that your group follows community guidelines.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await GroupStore.createGroup({
        name: name.trim(),
        platform,
        category,
        inviteUrl: inviteUrl.trim(),
        description: description.trim(),
        country,
        state: state.trim(),
        city: city.trim(),
        language,
      });

      setCreatedGroup({
        name: created.name,
        slug: created.slug,
        platform: created.platform,
      });

      // Reset form inputs
      setName('');
      setInviteUrl('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Could not submit group. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 flex-grow space-y-6">
        <SafetyWarningBanner />
        <AdSenseUnit slotKey="headerLeaderboard" />

        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span>NO LOGIN REQUIRED • INSTANT AUTO-PUBLISH (FREE ₹0)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Add &amp; Promote Your Group Link
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Add your WhatsApp, Arattai, Telegram, or Discord group link directly to our public directory. Zero registration, zero fees — goes live immediately for organic traffic!
          </p>
        </div>

        {/* GOOGLE FORM OPTION (HIDDEN BY DEFAULT - CONTROLLED VIA ENABLE_GOOGLE_FORMS) */}
        {ENABLE_GOOGLE_FORMS && (
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-600/20 space-y-4 text-center">
            <h2 className="text-2xl font-black">Submit Group via Official Google Form</h2>
            <a
              href={FORMS_CONFIG.submitGroup.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl"
            >
              <span>Click Here to Open Google Form</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* DIRECT WEBSITE SUBMISSION FORM (NO LOGIN, AUTO-PUBLISHED) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          {createdGroup ? (
            <div className="py-8 text-center space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-black uppercase tracking-wider">
                  LIVE IN DIRECTORY
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  &ldquo;{createdGroup.name}&rdquo; Added!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Your {createdGroup.platform.toUpperCase()} community link is now live and indexed in our directory for visitors across India &amp; globally.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/group/${createdGroup.slug}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Live Group Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/groups"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Browse Directory</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setCreatedGroup(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Another Group</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Row 1: Group Name & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Group / Channel Name *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chennai Tech & Startup Founders"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Platform *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="whatsapp">WhatsApp Group / Community</option>
                    <option value="arattai">Arattai (by Zoho) – India Priority</option>
                    <option value="telegram">Telegram Channel / Group</option>
                    <option value="instagram">Instagram Broadcast Channel</option>
                    <option value="discord">Discord Server</option>
                    <option value="facebook">Facebook Group</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Invite Link & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Direct Invite Link URL *
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      required
                      value={inviteUrl}
                      onChange={(e) => setInviteUrl(e.target.value)}
                      placeholder="https://chat.whatsapp.com/... or https://t.me/..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Country, State, City, Language */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {SAFE_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                    <option value="Global">🌍 Global</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Multilingual">Multilingual</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Group Description &amp; Rules *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe who should join, group topics, job updates, or rules..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  I confirm this group link does not contain spam, scam, or illegal content and follows our community guidelines.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-70"
              >
                <Globe className="w-4 h-4" />
                <span>{submitting ? 'Publishing Group...' : 'Publish Group Link Directly (Free ₹0 • No Login)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* WHATSAPP GROUP ADMIN GUIDE & REVOKE TUTORIAL SECTION */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              📘
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">WhatsApp Group Admin Guide &amp; Revoke Link Tutorial</h2>
              <p className="text-xs text-slate-400">Everything you need to know about group links, revoking invite access &amp; safety rules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>1. Private vs Public Group Links</span>
              </h3>
              <p>
                <strong>Public Groups:</strong> Anyone with the invite link can join directly without prior admin approval. Great for maximum community growth and promotion!
              </p>
              <p>
                <strong>Private Admin Approval Groups:</strong> Turning on &quot;Approve New Members&quot; in group settings lets admins review member profiles before granting access.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>2. How Admins Revoke / Reset Invite Link</span>
              </h3>
              <p>If your group reaches capacity or receives unwanted spammers, you can instantly deactivate your invite link using 3 simple steps:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Open WhatsApp ➔ Tap <strong>Group Info</strong>.</li>
                <li>Tap <strong>Invite via Link</strong>.</li>
                <li>Tap <strong>Reset Link / Revoke Link</strong> ➔ Confirm Reset.</li>
              </ol>
            </div>
          </div>
        </section>

        <AdSenseUnit slotKey="inArticle" />
      </main>

      <Footer />
    </div>
  );
}
