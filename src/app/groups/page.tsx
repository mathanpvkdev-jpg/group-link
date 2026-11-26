'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { INITIAL_GROUPS, CATEGORIES } from '@/lib/data';
import { Group, Platform } from '@/lib/types';
import { JustdialHeroStrip } from '@/components/common/JustdialHeroStrip';
import { TypewriterText } from '@/components/common/TypewriterText';
import { GroupStore } from '@/lib/groups/store';
import { ENABLE_GOOGLE_FORMS } from '@/lib/forms-config';
import { GroupCard } from '@/components/GroupCard';

const GROUP_LANGUAGES = ['All', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <GroupsPageContent />
    </Suspense>
  );
}

function GroupsPageContent() {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get('platform');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>(() => {
    return platformParam ? platformParam.toLowerCase() : 'all';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'members'>('popular');

  const [groups, setGroups] = useState<Group[]>(() => GroupStore.getGroupsSync());

  // Fetch live groups from Supabase + localStorage on mount
  useEffect(() => {
    GroupStore.getGroups().then((all) => {
      if (all && all.length > 0) setGroups(all);
    });
  }, []);

  // Sync state if platform query parameter in URL changes
  useEffect(() => {
    if (platformParam) {
      setSelectedPlatform(platformParam.toLowerCase());
    } else {
      setSelectedPlatform('all');
    }
  }, [platformParam]);

  // Submission Form State (Zero Login -> Direct Auto-Publish)
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'whatsapp' as Platform,
    category: 'Technology',
    language: 'English',
    city: '',
    inviteUrl: '',
    description: '',
  });

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(t => t.length > 0);
        const searchTarget = `${g.name} ${g.description} ${g.city || ''} ${g.area || ''} ${g.state || ''} ${g.category} ${g.language || ''}`.toLowerCase();
        const matchesTokens = tokens.every(tok => searchTarget.includes(tok)) || tokens.some(tok => searchTarget.includes(tok));
        if (!matchesTokens) return false;
      }
      if (selectedPlatform !== 'all' && g.platform !== selectedPlatform) return false;
      if (selectedCategory !== 'all' && g.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedLanguage !== 'All' && (g.language || 'English').toLowerCase() !== selectedLanguage.toLowerCase()) return false;
      if (verifiedOnly && !g.isVerified) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      if (sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    });
  }, [groups, searchQuery, selectedPlatform, selectedCategory, selectedLanguage, verifiedOnly, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.inviteUrl.trim()) return;

    try {
      setSubmitting(true);
      const created = await GroupStore.createGroup({
        name: formData.name.trim(),
        platform: formData.platform,
        category: formData.category,
        language: formData.language,
        city: formData.city.trim() || undefined,
        inviteUrl: formData.inviteUrl.trim(),
        description: formData.description.trim() || `${formData.name} community group.`,
      });

      setGroups((prev) => [created, ...prev.filter((g) => g.slug !== created.slug)]);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        platform: 'whatsapp',
        category: 'Technology',
        language: 'English',
        city: '',
        inviteUrl: '',
        description: '',
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col justify-between">
      <Header />

      <main className="w-full bg-surface flex-grow">
        <div className="flex flex-col w-full">
          {/* ========================================================
              1. HERO SECTION
             ======================================================== */}
          <section className="relative w-full bg-surface-container-low py-space-xl px-gutter overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-fixed-dim rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
              <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-highest text-on-surface-variant font-label-md mb-space-md shadow-sm text-xs">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hub
                </span>
                <span>Over 25,000+ Active Communities Connected</span>
              </div>

              <h1 className="font-headline-xl text-3xl sm:text-5xl font-black text-on-surface tracking-tight max-w-4xl mb-space-md leading-tight min-h-[3.2em] sm:min-h-[2.4em]">
                Discover &amp; Join Verified{' '}
                <TypewriterText
                  words={[
                    'WhatsApp Groups',
                    'Arattai Communities',
                    'Telegram Channels',
                    'Discord Servers',
                    'Instagram Broadcasts',
                    'Professional Circles',
                  ]}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-primary bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-primary"
                  cursorClassName="text-emerald-500"
                />
              </h1>

              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mb-space-xl">
                Connect with like-minded individuals across Arattai (by Zoho), WhatsApp, Telegram, Instagram Broadcast, and Discord groups. Explore verified local communities, professional circles, tech hubs, and educational channels.
              </p>

              {/* AI Search Prompt / Location & Pincode Tip Banner */}
              <div className="w-full max-w-4xl mb-space-sm p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-purple-500/10 border border-emerald-500/20 text-xs sm:text-sm text-left flex items-center gap-2.5 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                <span className="text-on-surface font-medium">
                  <strong className="text-primary font-bold">✨ AI Search Tip:</strong> Enter <strong>Area Name, Pincode (e.g. 600017) and City</strong> to get business and community group search faster in AI.
                </span>
              </div>

              {/* Prominent Search Bar Component */}
              <div className="w-full max-w-4xl bg-surface-container-lowest p-space-sm rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-space-sm mb-space-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-space-sm px-space-md w-full md:w-1/2 py-space-sm">
                  <span className="material-symbols-outlined text-outline">search</span>
                  <input
                    className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none text-sm font-medium"
                    placeholder="Search topic, area name, pincode (e.g. 600017) or city..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="hidden md:block w-[1px] h-8 bg-surface-container-high" />

                <div className="flex items-center gap-space-sm px-space-md w-full md:w-1/3 py-space-sm">
                  <span className="material-symbols-outlined text-outline">category</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-on-surface focus:outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.slice(0, 15).map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-auto">
                  <button
                    onClick={() => {}}
                    className="w-full md:w-auto px-space-xl py-space-md bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-space-sm shadow-md cursor-pointer"
                  >
                    <span>Search</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Submit Link Callout Badge */}
              <div className="flex flex-wrap items-center justify-center gap-space-md text-xs text-on-surface-variant">
                <span>Are you a group admin?</span>
                <Link
                  className="inline-flex items-center gap-space-xs text-primary font-bold hover:underline"
                  href="/submit-group"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Add your group link directly (No Login • Free)</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================
              2. PLATFORM FILTER TABS SECTION (STICKY)
             ======================================================== */}
          <section className="w-full py-space-xs sm:py-space-md bg-surface px-gutter sticky top-14 sm:top-28 z-40 backdrop-blur-md bg-surface/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-space-md pb-space-xs scrollbar-none -webkit-overflow-scrolling-touch">
              <div className="flex items-center gap-space-xs sm:gap-space-sm min-w-max py-0.5">
                <button
                  onClick={() => setSelectedPlatform('all')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedPlatform === 'all'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  All Platforms ({groups.length})
                </button>

                {/* Arattai (Zoho) ALWAYS FIRST PRIORITY */}
                <button
                  onClick={() => setSelectedPlatform('arattai')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'arattai'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                  <span>Arattai (Zoho) 🇮🇳</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => setSelectedPlatform('whatsapp')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'whatsapp'
                      ? 'bg-secondary text-on-secondary shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => setSelectedPlatform('telegram')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'telegram'
                      ? 'bg-primary text-on-primary shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                  <span>Telegram</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'instagram'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-pink-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    photo_camera
                  </span>
                  <span>Instagram</span>
                </button>

                {/* Discord */}
                <button
                  onClick={() => setSelectedPlatform('discord')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'discord'
                      ? 'bg-indigo-600 text-white shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                  <span>Discord</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => setSelectedPlatform('facebook')}
                  className={`px-space-lg py-space-sm rounded-full text-xs font-bold transition-all flex items-center gap-space-xs cursor-pointer ${
                    selectedPlatform === 'facebook'
                      ? 'bg-blue-600 text-white shadow-md font-black'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================
              JUSTDIAL HERO STRIP & CATEGORY TILES (GROUPS VARIANT)
             ======================================================== */}
          <section className="w-full max-w-7xl mx-auto px-gutter pt-8">
            <JustdialHeroStrip variant="groups" />
          </section>

          {/* ========================================================
              3. POPULAR & RECENTLY ADDED GROUPS GRID
             ======================================================== */}
          <section className="w-full py-space-xl px-gutter max-w-7xl mx-auto space-y-6">
            {/* Competitor-grade Quick Intent & Language Discovery Bar */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant mr-1">
                  Language:
                </span>
                {GROUP_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-on-surface border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                    }`}
                  >
                    {lang === 'All' ? 'All Languages' : lang}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-on-surface-variant mr-1">Trending Searches:</span>
                  {[
                    { label: 'Jobs & Hiring', q: 'jobs' },
                    { label: 'Tamil Groups', lang: 'Tamil' },
                    { label: 'AI & Tech', q: 'tech' },
                    { label: 'Business & B2B', q: 'business' },
                    { label: 'Study & UPSC', q: 'study' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        if (chip.lang) {
                          setSelectedLanguage(chip.lang);
                          setSearchQuery('');
                        } else if (chip.q) {
                          setSearchQuery(chip.q);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary text-on-surface font-semibold transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <span>Verified Active Only</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <span className="text-label-sm uppercase tracking-wider text-primary font-bold text-xs">
                  Trending Directories ({filteredGroups.length} Active)
                </span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-space-xs">
                  Popular &amp; Verified Groups
                </h2>
              </div>
              <div className="flex items-center gap-space-sm text-xs">
                <span className="text-body-sm text-on-surface-variant font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-surface-container px-space-md py-space-sm rounded-xl text-on-surface font-semibold focus:outline-none cursor-pointer border border-slate-200 dark:border-slate-800"
                >
                  <option value="popular">Most Active / Popular</option>
                  <option value="latest">Recently Added</option>
                  <option value="members">Highest Members</option>
                </select>
              </div>
            </div>

            {/* Cards Grid (Using Upgraded GroupCard with Details, Copy, Share, Report & Direct Join) */}
            {filteredGroups.length === 0 ? (
              <div className="rounded-3xl bg-surface-container-low border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <h3 className="text-lg font-extrabold text-on-surface">No matching groups found</h3>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                  Try clearing your filters or be the first group admin to list this topic directly (takes 10 seconds, zero login).
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPlatform('all');
                      setSelectedCategory('all');
                      setSelectedLanguage('All');
                      setVerifiedOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <a
                    href="#submit-section"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
                  >
                    + Add Your Group Free
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {filteredGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}

            {/* Cross-Vertical Discovery Banner: Groups -> Nammabus Local Business Directory */}
            <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Nammabus Local Business &amp; B2B Hub
                </span>
                <h3 className="text-base sm:text-lg font-black text-on-surface">
                  Need a Trusted Local Technician, Photographer, or B2B Supplier?
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Explore 40+ verified service categories across India or list your own business directly with zero broker fees.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/local-biz/businesses"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Explore Local Businesses →
                </Link>
                <Link
                  href="/local-biz/add-business"
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-on-surface hover:border-blue-500 transition-colors"
                >
                  + Add Business Free
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================
              4. GROUP OWNER SUBMISSION SECTION
             ======================================================== */}
          <section className="w-full py-space-xl bg-surface-container-low px-gutter relative overflow-hidden my-space-xl" id="submit-section">
            <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-12 shadow-xl relative z-10 border border-slate-200 dark:border-slate-800">
              <div className="text-center max-w-2xl mx-auto mb-space-lg space-y-3">
                <span className="text-label-sm uppercase tracking-wider text-primary font-bold text-xs">
                  Grow Your Audience
                </span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-space-xs mb-space-sm">
                  Add Your Group Link Directly
                </h2>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm">
                  Are you running an Arattai, WhatsApp, or Telegram community? Add your invite link directly below — no login needed, goes live immediately!
                </p>

                {ENABLE_GOOGLE_FORMS && (
                  <div className="pt-2">
                    <a
                      href="https://forms.gle/oZzitWMZ8xtB9rmx5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-sm shadow-lg"
                    >
                      <span>Click Here to Submit Group (Google Form)</span>
                    </a>
                  </div>
                )}
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Group link added successfully! Your group is now live in the directory above!</span>
                </div>
              )}

              <form className="space-y-space-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">Group Name</label>
                    <input
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all"
                      placeholder="e.g., Chennai AI Researchers"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">Platform Type</label>
                    <select
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all cursor-pointer"
                      value={formData.platform}
                      onChange={(e: any) => setFormData({ ...formData, platform: e.target.value })}
                    >
                      <option value="arattai">Arattai (by Zoho) - India Priority</option>
                      <option value="whatsapp">WhatsApp Community / Group</option>
                      <option value="telegram">Telegram Channel / Group</option>
                      <option value="discord">Discord Server</option>
                      <option value="facebook">Facebook Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">Category</label>
                    <select
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Tech & Startups">Tech &amp; Startups</option>
                      <option value="Education & Study">Education &amp; Study</option>
                      <option value="Jobs & Careers">Jobs &amp; Careers</option>
                      <option value="Local Community">Local Community</option>
                      <option value="Crypto & Finance">Crypto &amp; Finance</option>
                      <option value="Entertainment & Arts">Entertainment &amp; Arts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">Invite Link URL</label>
                    <input
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all"
                      placeholder="https://chat.whatsapp.com/... or https://t.me/..."
                      required
                      type="url"
                      value={formData.inviteUrl}
                      onChange={(e) => setFormData({ ...formData, inviteUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">Language</label>
                    <select
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all cursor-pointer"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Kannada">Kannada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-space-xs">City / Area (Optional)</label>
                    <input
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all"
                      placeholder="e.g., Chennai, Coimbatore, Bangalore"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-space-xs">Group Description</label>
                  <textarea
                    className="w-full bg-surface-container-low px-space-md py-space-sm rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent transition-all"
                    placeholder="Write a short description about your group rules, topic focus, and guidelines..."
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-space-sm pt-1">
                  <input
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                    id="terms"
                    required
                    type="checkbox"
                  />
                  <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                    I confirm that this community link adheres to community guidelines and does not promote spam or prohibited content.
                  </label>
                </div>

                <div className="flex justify-center pt-space-md">
                  <button
                    className="px-space-xl py-space-md bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container transition-all shadow-md flex items-center gap-space-sm cursor-pointer"
                    type="submit"
                    disabled={submitting}
                  >
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    <span>{submitting ? 'Publishing...' : 'Publish Group Link Directly (Free • No Login)'}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ========================================================
              5. SEO CONTENT SECTION: 7,000+ GROUPS IN 2026
             ======================================================== */}
          <section className="w-full py-16 px-gutter bg-surface-container-low border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-5xl mx-auto space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider block">
                    Verified Directory Index (2026)
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-on-surface mt-1">
                    7,000+ Active WhatsApp, Arattai &amp; Telegram Groups in 2026
                  </h2>
                </div>
                <Link
                  href="/groups-2026"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm w-fit cursor-pointer"
                >
                  <span>Explore 7,000+ Groups Guide</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-on-surface-variant leading-relaxed">
                <div className="p-5 rounded-2xl bg-surface border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span>📚</span>
                    <span>7,000+ Verified Study &amp; Job Groups</span>
                  </h3>
                  <p>
                    Discover active, spam-free study groups for UPSC, NEET, JEE, Banking, and IT careers in 2026. Daily current affairs PDFs, job alerts, and interview prep shared by verified community admins across India.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span>🇮🇳</span>
                    <span>Arattai (by Zoho) - India&apos;s #1 Choice</span>
                  </h3>
                  <p>
                    Championing indigenous Indian digital communities, Arattai by Zoho offers ad-free, secure group discussions with zero third-party tracking. Join thousands of Tamil, Hindi, Kannada, Telugu, and English channels.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Zero Spam &amp; Fraud Awareness</span>
                  </h3>
                  <p>
                    All group invite links are vetted for safety. Never share banking OTPs or sensitive personal information. Report suspicious communities instantly to our 24/7 trust &amp; safety moderation desk.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
