'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { LocalBizHeader } from '@/components/local-biz/LocalBizHeader';
import { LocalBizFooter } from '@/components/local-biz/LocalBizFooter';
import { LocalBizStore } from '@/lib/local-biz/store';
import { SEED_CATEGORIES, SEED_CITIES } from '@/lib/local-biz/seed-data';
import { STATES, getDistrictsForState } from '@/lib/india';
import { getStoredUser, setStoredUser } from '@/lib/auth';
import { ENABLE_GOOGLE_FORMS, FORMS_CONFIG } from '@/lib/forms-config';

export default function AddBusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <AddBusinessContent />
    </Suspense>
  );
}

function AddBusinessContent() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');
  const [createdName, setCreatedName] = useState('');
  const [error, setError] = useState('');

  // Form State (Zero Login Required)
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(SEED_CATEGORIES[0]?.id || 'cat-1');
  const [businessType, setBusinessType] = useState('Service Provider');
  const [yearEstablished, setYearEstablished] = useState('2024');
  const [gstNumber, setGstNumber] = useState('');

  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const districts = getDistrictsForState(selectedState);

  // Pre-fill if signed in (optional — never required!)
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      if (user.name) setContactPerson(user.name);
      if (user.email) setEmail(user.email);
      if (user.whatsappNumber) {
        setWhatsapp(user.whatsappNumber);
        setPhone(user.whatsappNumber);
      }
      if (user.businessName) setName(user.businessName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your Business Name.');
      return;
    }
    if (!selectedCity.trim() || !area.trim() || !pincode.trim()) {
      setError('Please fill in complete location details (City, Area, Pincode).');
      return;
    }
    if (!phone.trim() && !whatsapp.trim()) {
      setError('Please provide a WhatsApp or phone number so customers can reach you.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const categoryObj = SEED_CATEGORIES.find((c) => c.id === categoryId);
      const cityObj = SEED_CITIES.find(
        (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
      );

      const created = await LocalBizStore.createBusiness({
        name: name.trim(),
        category_id: categoryId,
        category_name: categoryObj?.name || 'Local Services',
        business_type: businessType,
        year_established: parseInt(yearEstablished, 10) || 2024,
        gst_number: gstNumber.trim().toUpperCase(),
        state: selectedState,
        city_name: selectedCity,
        city_id: cityObj?.id || 'city-1',
        area: area.trim(),
        pincode: pincode.trim(),
        address: address.trim() || `${area}, ${selectedCity}, ${selectedState} - ${pincode}`,
        phone: (phone || whatsapp).trim(),
        whatsapp: (whatsapp || phone).trim(),
        email: email.trim() || 'contact@nammabus.in',
        website: website.trim(),
        description:
          description.trim() ||
          `${name.trim()} offers trusted ${categoryObj?.name || 'services'} in ${area.trim()}, ${selectedCity}.`,
        status: 'approved',
        verification_status: 'verified',
      });

      const currentUser = getStoredUser();
      if (currentUser) {
        setStoredUser({
          ...currentUser,
          role: 'seller',
          accountType: 'seller',
          businessName: name.trim(),
        });
      }

      setCreatedSlug(created.slug);
      setCreatedName(created.name);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit business registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setCreatedSlug('');
    setCreatedName('');
    setName('');
    setArea('');
    setPincode('');
    setAddress('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <LocalBizHeader />

      {/* Breadcrumb & Main Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/local-biz" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              List Your Business
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NO LOGIN REQUIRED • INSTANT AUTO-PUBLISH (100% FREE ₹0)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            List Your Business on Nammabus India
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Add your business directly to our India-wide directory. Zero registration, zero broker fees — goes live automatically for organic buyer traffic!
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* GOOGLE FORM FALLBACK (HIDDEN BY DEFAULT - CONTROLLED VIA ENABLE_GOOGLE_FORMS) */}
        {ENABLE_GOOGLE_FORMS && (
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center space-y-3">
            <h2 className="text-xl font-black">Google Form Option</h2>
            <a
              href={FORMS_CONFIG.registerBusiness.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl bg-white text-slate-950 font-black text-xs"
            >
              Open Official Google Form
            </a>
          </div>
        )}

        {/* DIRECT WEBSITE BUSINESS FORM */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {submitted ? (
            <div className="p-8 text-center space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-black uppercase tracking-wider">
                  LIVE IN DIRECTORY
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  &ldquo;{createdName}&rdquo; Is Live!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Your business profile has been added automatically to Nammabus Directory across India. Customers can now call or WhatsApp you directly!
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/local-biz/businesses/${createdSlug}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Live Business Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Another Business</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>1. Basic Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Apex Engineering Works / Chennai Silk House"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {SEED_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Service Provider">Service Provider</option>
                      <option value="Retailer / Shop">Retailer / Shop</option>
                      <option value="Wholesaler / Distributor">Wholesaler / Distributor</option>
                      <option value="Manufacturer / Factory">Manufacturer / Factory</option>
                      <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Year Established
                      </label>
                      <input
                        type="number"
                        value={yearEstablished}
                        onChange={(e) => setYearEstablished(e.target.value)}
                        placeholder="2024"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        GSTIN (Optional)
                      </label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="e.g. 33AAAAA0000A1Z5"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Address */}
              <div>
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>2. Location &amp; Address</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      State *
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const nextState = e.target.value;
                        setSelectedState(nextState);
                        const newDistricts = getDistrictsForState(nextState);
                        if (newDistricts.length > 0) {
                          setSelectedCity(newDistricts[0]);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {STATES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      District / City *
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. T. Nagar, Anna Nagar, HSR Layout"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 600017"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Street Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 45/A, North Usman Road"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Direct Customer Leads */}
              <div>
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>3. Contact &amp; Direct Customer Leads</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Number * (For Direct Leads)
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Calling Mobile / Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@business.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Website or Catalog Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Services &amp; Offerings Overview *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your products, specialty services, timings, or customer offers..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-70"
                >
                  <span>
                    {submitting
                      ? 'Publishing Your Business...'
                      : '🚀 Submit & Publish Business Directly (Free ₹0 • No Login)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  🔒 Zero login required. Direct customer calls and WhatsApp inquiries forwarded straight to you.
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      <LocalBizFooter />
    </div>
  );
}
