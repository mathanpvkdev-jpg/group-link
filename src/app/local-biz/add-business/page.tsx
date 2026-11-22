'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Building2,
  ExternalLink,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { LocalBizHeader } from '@/components/local-biz/LocalBizHeader';
import { LocalBizFooter } from '@/components/local-biz/LocalBizFooter';
import { FORMS_CONFIG } from '@/lib/forms-config';

export default function AddBusinessPage() {
  const googleFormUrl = FORMS_CONFIG.registerBusiness.shortUrl; // https://forms.gle/FVQVofUVejQ2ebiA7
  const googleFormEmbedUrl = FORMS_CONFIG.registerBusiness.embedUrl;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <LocalBizHeader />

      {/* Breadcrumb & Main Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/local-biz" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">List Your Business</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            List Your Business on Nammabus India
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Reach thousands of buyers, customers, and clients looking for your products and services. 100% Free Forever with Zero Broker Fees.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* OFFICIAL GOOGLE FORM HERO CARD */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL GOOGLE FORM REGISTRATION (100% FREE ₹0)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Register Your Business via Official Google Form
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Submit your business name, contact info, area, and service details directly to our directory team. Zero commission, direct customer calls &amp; WhatsApp leads.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/20"
            >
              <span>Click Here to Open Google Form</span>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </a>
          </div>

          <p className="text-[11px] text-blue-200">
            ⚡ Clicking opens the official Google Form in a new tab. Fast 2-minute registration.
          </p>
        </div>

        {/* 4 BENEFIT HIGHLIGHTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 mx-auto flex items-center justify-center font-bold text-xs">
              ₹0
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white">100% Free Forever</div>
            <div className="text-[11px] text-slate-500">Zero broker commissions</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 mx-auto flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white">Direct Leads</div>
            <div className="text-[11px] text-slate-500">Calls &amp; WhatsApp direct to you</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-600 mx-auto flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white">Pan-India Reach</div>
            <div className="text-[11px] text-slate-500">Target buyers in your city</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-600 mx-auto flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white">Quick Setup</div>
            <div className="text-[11px] text-slate-500">Takes less than 2 minutes</div>
          </div>
        </div>

        {/* EMBEDDED GOOGLE FORM IFRAME */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Fill Business Details Online
              </h3>
            </div>
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Open in New Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 flex justify-center">
            <iframe
              src={googleFormEmbedUrl}
              width="100%"
              height="950"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full border-0 min-h-[850px]"
              title="Official Business Registration Google Form"
            >
              Loading Google Form…
            </iframe>
          </div>
        </div>

        {/* HOW IT WORKS / VERIFICATION GUIDE */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">How Business Listing Works (3 Easy Steps)</h2>
              <p className="text-xs text-slate-400">Everything you need to know about registering your shop or services on Nammabus.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Fill Google Form</h3>
              <p className="text-slate-400 leading-relaxed">
                Provide your Business Name, Category, State, District, WhatsApp number, and services description.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Quick Verification</h3>
              <p className="text-slate-400 leading-relaxed">
                Our verification desk checks your WhatsApp and mobile contact to ensure genuine customer trust.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Start Receiving Leads</h3>
              <p className="text-slate-400 leading-relaxed">
                Your business profile goes live on our directory with direct calling &amp; WhatsApp click-to-chat buttons.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LocalBizFooter />
    </div>
  );
}
