'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Group } from '@/lib/types';
import {
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Flag,
  Share2,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Users,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';
import { ReportModal } from './ReportModal';

interface GroupCardProps {
  group: Group;
}

const PLATFORM_STYLES: Record<string, { gradient: string; label: string; dot: string }> = {
  arattai: {
    gradient: 'from-amber-500 to-orange-500',
    label: 'Arattai by Zoho',
    dot: 'bg-amber-400',
  },
  whatsapp: {
    gradient: 'from-emerald-500 to-green-600',
    label: 'WhatsApp',
    dot: 'bg-emerald-400',
  },
  telegram: {
    gradient: 'from-sky-500 to-blue-500',
    label: 'Telegram',
    dot: 'bg-sky-400',
  },
  youtube: {
    gradient: 'from-rose-600 to-red-600',
    label: 'YouTube',
    dot: 'bg-rose-400',
  },
  instagram: {
    gradient: 'from-amber-500 via-rose-500 to-purple-600',
    label: 'Instagram',
    dot: 'bg-pink-400',
  },
  facebook: {
    gradient: 'from-blue-600 to-blue-700',
    label: 'Facebook',
    dot: 'bg-blue-400',
  },
  discord: {
    gradient: 'from-indigo-500 to-purple-600',
    label: 'Discord',
    dot: 'bg-indigo-400',
  },
  linkedin: {
    gradient: 'from-blue-700 to-blue-800',
    label: 'LinkedIn',
    dot: 'bg-blue-300',
  },
  reddit: {
    gradient: 'from-orange-500 to-red-500',
    label: 'Reddit',
    dot: 'bg-orange-400',
  },
};

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const pStyle = PLATFORM_STYLES[group.platform] ?? {
    gradient: 'from-slate-600 to-slate-700',
    label: group.platform,
    dot: 'bg-slate-400',
  };

  const checkedLabel = (() => {
    if (!group.lastChecked) return 'Verified Today';
    const d = new Date(group.lastChecked);
    if (Number.isNaN(d.getTime())) return group.lastChecked;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  })();

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/group/${group.slug}`;
      navigator.clipboard.writeText(url);
      showToast('✓ Page link copied!');
    }
  };

  const handleCopyInvite = () => {
    if (typeof window !== 'undefined' && group.inviteUrl) {
      navigator.clipboard.writeText(group.inviteUrl);
      showToast('✓ Invite URL copied!');
    }
  };

  return (
    <>
      <div
        className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 card-hover ${
          group.isFeatured
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-400/80 shadow-md shadow-amber-500/10'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5'
        }`}
      >
        {/* Top color accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${pStyle.gradient}`} />

        {/* Featured Badge Overlay */}
        {group.isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/30">
              <Zap className="w-3 h-3 fill-slate-950" />
              SPONSORED
            </span>
          </div>
        )}

        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
          {/* Top Line: 🟢 WhatsApp · Chennai */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full ${pStyle.dot}`} />
              <span>{pStyle.label}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{group.city || group.state || 'All India'}</span>
            </div>

            {group.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                VERIFIED
              </span>
            )}
          </div>

          {/* Group Name */}
          <Link href={`/group/${group.slug}`} className="block">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {group.name}
            </h3>
          </Link>

          {/* Description excerpt */}
          {group.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {group.description}
            </p>
          )}

          {/* Category, Language & Freshness Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {group.category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
              🌐 {group.language || 'English'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              Checked {checkedLabel}
            </span>
          </div>

          {/* Members · Active + Quick Utility Buttons */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium pt-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <strong>{group.memberCount.toLocaleString()}</strong> Members
              </span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyInvite}
                title="Copy Direct Invite Link"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                title="Share Group Page"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                title="Report Broken or Spam Link"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Actions: [ View & Join Page ] + [ Direct Invite ] */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              href={`/group/${group.slug}`}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                group.platform === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : group.platform === 'telegram'
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                  : group.platform === 'arattai'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black'
                  : group.platform === 'instagram'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-pink-500/20 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>View &amp; Join</span>
            </Link>
            <a
              href={group.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${pStyle.label} invite directly`}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Direct</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Copied toast */}
        {toastText && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 animate-fade-in whitespace-nowrap z-20">
            {toastText}
          </div>
        )}
      </div>

      {reportModalOpen && (
        <ReportModal
          groupId={group.id}
          groupName={group.name}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </>
  );
};
