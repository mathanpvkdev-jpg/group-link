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
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { LocalBizHeader } from '@/components/local-biz/LocalBizHeader';
import { LocalBizFooter } from '@/components/local-biz/LocalBizFooter';
import { FORMS_CONFIG } from '@/lib/forms-config';

export default function AddBusinessPage() {
  const googleFormUrl = FORMS_CONFIG.registerBusiness.shortUrl; // https://forms.gle/FVQVofUVejQ2ebiA7

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
        {/* OFFICIAL GOOGLE FORM DIRECT LAUNCH CARD (NO EMBEDDED IFRAME - OPENS IN NEW TAB) */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-white shadow-2xl shadow-blue-600/25 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>OFFICIAL GOOGLE FORM (100% FREE ₹0)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Register Your Business via Official Google Form
          </h2>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Submit your business name, contact info, area, and service details directly to our directory team. Zero commission, direct customer calls &amp; WhatsApp leads.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-slate-950 font-black text-base shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/30"
            >
              <span>Click Here to Open Google Form</span>
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </a>
          </div>

          <p className="text-xs text-blue-200 flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Opens directly on official Google Forms in a new tab • Instant registration</span>
          </p>
        </div>

        {/* 4 BENEFIT HIGHLIGHTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 mx-auto flex items-center justify-center font-black text-sm">
              ₹0
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white">100% Free Forever</div>
            <div className="text-xs text-slate-500">Zero broker commissions</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 mx-auto flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white">Direct Leads</div>
            <div className="text-xs text-slate-500">Calls &amp; WhatsApp direct to you</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-600 mx-auto flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white">Pan-India Reach</div>
            <div className="text-xs text-slate-500">Target buyers in your city</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-600 mx-auto flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white">Quick Setup</div>
            <div className="text-xs text-slate-500">Takes less than 2 minutes</div>
          </div>
        </div>

        {/* HOW IT WORKS / VERIFICATION GUIDE */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
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
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Open Official Google Form</h3>
              <p className="text-slate-400 leading-relaxed">
                Click the button above to open the secure Google Form in a new tab. Provide your Business Name, Category, State, District, and WhatsApp contact.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Quick Verification</h3>
              <p className="text-slate-400 leading-relaxed">
                Our verification desk checks your WhatsApp and mobile contact to ensure genuine customer trust and authenticity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Start Receiving Leads</h3>
              <p className="text-slate-400 leading-relaxed">
                Your business profile goes live on our directory with direct calling &amp; WhatsApp click-to-chat buttons for genuine buyers.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline"
            >
              <span>Click to Open Official Google Form in New Page</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <LocalBizFooter />
    </div>
  );
}
