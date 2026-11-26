import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSenseUnit } from '@/components/AdSenseUnit';
import { PaidPromotionCarousel } from '@/components/PaidPromotionCarousel';
import { GroupCard } from '@/components/GroupCard';
import { SAFE_COUNTRIES, CATEGORIES } from '@/lib/data';
import { GroupStore } from '@/lib/groups/store';
import {
  SUPPORTED_LANGUAGES,
  buildProgrammaticSeoMeta,
  buildGroupItemListSchema,
} from '@/lib/seo-engine';
import { MapPin, Globe, ChevronRight, Users, Languages, Tag } from 'lucide-react';

interface PageProps {
  params: Promise<{
    country: string;
    params?: string[];
  }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

function resolvePathSegments(countrySlug: string, paramArray: string[]) {
  const countryObj = SAFE_COUNTRIES.find((c) => c.slug === countrySlug);
  if (!countryObj) return null;

  let stateSlug = '';
  let stateName = '';
  let citySlug = '';
  let cityName = '';
  let languageSlug = '';
  let languageName = '';
  let categorySlug = '';
  let categoryName = '';

  if (paramArray.length === 1) {
    const seg = paramArray[0].toLowerCase();
    const langMatch = SUPPORTED_LANGUAGES.find((l) => l.slug === seg);
    const stateMatch = countryObj.states.find((s) => s.slug === seg);
    const catMatch = CATEGORIES.find((cat) => cat.slug === seg);

    if (langMatch) {
      languageSlug = langMatch.slug;
      languageName = langMatch.name;
    } else if (stateMatch) {
      stateSlug = stateMatch.slug;
      stateName = stateMatch.name;
    } else if (catMatch) {
      categorySlug = catMatch.slug;
      categoryName = catMatch.name;
    }
  } else if (paramArray.length === 2) {
    const seg0 = paramArray[0].toLowerCase();
    const seg1 = paramArray[1].toLowerCase();

    const langMatch = SUPPORTED_LANGUAGES.find((l) => l.slug === seg0);
    const stateMatch = countryObj.states.find((s) => s.slug === seg0);
    const catMatch = CATEGORIES.find((cat) => cat.slug === seg1);

    if (langMatch) {
      languageSlug = langMatch.slug;
      languageName = langMatch.name;
      if (catMatch) {
        categorySlug = catMatch.slug;
        categoryName = catMatch.name;
      }
    } else if (stateMatch) {
      stateSlug = stateMatch.slug;
      stateName = stateMatch.name;
      const cityMatch = stateMatch.cities.find((ci) => ci.slug === seg1);
      if (cityMatch) {
        citySlug = cityMatch.slug;
        cityName = cityMatch.name;
      } else if (catMatch) {
        categorySlug = catMatch.slug;
        categoryName = catMatch.name;
      }
    }
  } else if (paramArray.length >= 3) {
    const seg0 = paramArray[0].toLowerCase();
    const seg1 = paramArray[1].toLowerCase();
    const seg2 = paramArray[2].toLowerCase();

    const stateMatch = countryObj.states.find((s) => s.slug === seg0);
    if (stateMatch) {
      stateSlug = stateMatch.slug;
      stateName = stateMatch.name;
      const cityMatch = stateMatch.cities.find((ci) => ci.slug === seg1);
      if (cityMatch) {
        citySlug = cityMatch.slug;
        cityName = cityMatch.name;
      }
      const catMatch = CATEGORIES.find((cat) => cat.slug === seg2);
      if (catMatch) {
        categorySlug = catMatch.slug;
        categoryName = catMatch.name;
      }
    }
  }

  return {
    countryObj,
    stateSlug,
    stateName,
    citySlug,
    cityName,
    languageSlug,
    languageName,
    categorySlug,
    categoryName,
  };
}

function filterGroupsByContext(
  groups: Awaited<ReturnType<typeof GroupStore.getGroups>>,
  resolved: NonNullable<ReturnType<typeof resolvePathSegments>>
) {
  return groups.filter((g) => {
    if (g.country.toLowerCase() !== resolved.countryObj.name.toLowerCase()) return false;
    if (resolved.stateName && g.state?.toLowerCase() !== resolved.stateName.toLowerCase()) return false;
    if (resolved.cityName && g.city?.toLowerCase() !== resolved.cityName.toLowerCase()) return false;
    if (resolved.languageName) {
      const langLower = resolved.languageName.toLowerCase();
      const groupLang = (g.language || '').toLowerCase();
      const searchCorpus = `${g.name} ${g.description}`.toLowerCase();
      if (groupLang !== langLower && !searchCorpus.includes(langLower)) return false;
    }
    if (resolved.categoryName) {
      const catLower = resolved.categoryName.toLowerCase();
      const groupCat = (g.category || '').toLowerCase();
      const matchesCat =
        groupCat.includes(catLower) ||
        (catLower === 'jobs & careers' && groupCat.includes('job')) ||
        (catLower === 'education & study' && (groupCat.includes('education') || groupCat.includes('study')));
      if (!matchesCat) return false;
    }
    return true;
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const paramArray = resolvedParams.params || [];
  const parsed = resolvePathSegments(resolvedParams.country, paramArray);

  if (!parsed) return { title: 'Groups Directory | GroupHub' };

  const allGroups = await GroupStore.getGroups();
  const matchingGroups = filterGroupsByContext(allGroups, parsed);

  const canonicalPath = paramArray.length > 0
    ? `/groups/${parsed.countryObj.slug}/${paramArray.join('/')}`
    : `/groups/${parsed.countryObj.slug}`;

  const seo = buildProgrammaticSeoMeta({
    siteUrl,
    canonicalPath,
    countryName: parsed.countryObj.name,
    stateName: parsed.stateName,
    cityName: parsed.cityName,
    languageName: parsed.languageName,
    categoryName: parsed.categoryName,
    matchingCount: matchingGroups.length,
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: 'website',
    },
  };
}

export default async function DynamicGeoGroupPage({ params }: PageProps) {
  const resolvedParams = await params;
  const paramArray = resolvedParams.params || [];
  const parsed = resolvePathSegments(resolvedParams.country, paramArray);

  if (!parsed) {
    notFound();
  }

  const allGroups = await GroupStore.getGroups();
  const matchingGroups = filterGroupsByContext(allGroups, parsed);

  const {
    countryObj,
    stateSlug,
    stateName,
    citySlug,
    cityName,
    languageSlug,
    languageName,
    categorySlug,
    categoryName,
  } = parsed;

  const displayLocation = [cityName, stateName, countryObj.name].filter(Boolean).join(', ');
  const langPrefix = languageName ? `${languageName} ` : '';
  const catHeading = categoryName || 'WhatsApp & Telegram Groups';

  // JSON-LD Breadcrumbs (Clean live domain, no placeholder URLs)
  const breadcrumbItems: Array<{ '@type': string; position: number; name: string; item: string }> = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    { '@type': 'ListItem', position: 2, name: countryObj.name, item: `${siteUrl}/groups/${countryObj.slug}` },
  ];

  if (languageName) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: languageName,
      item: `${siteUrl}/groups/${countryObj.slug}/${languageSlug}`,
    });
  }

  if (stateName) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: stateName,
      item: `${siteUrl}/groups/${countryObj.slug}/${stateSlug}`,
    });
  }

  if (cityName) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: cityName,
      item: `${siteUrl}/groups/${countryObj.slug}/${stateSlug}/${citySlug}`,
    });
  }

  if (categoryName) {
    const catPath = languageSlug
      ? `${siteUrl}/groups/${countryObj.slug}/${languageSlug}/${categorySlug}`
      : stateSlug && citySlug
      ? `${siteUrl}/groups/${countryObj.slug}/${stateSlug}/${citySlug}/${categorySlug}`
      : `${siteUrl}/groups/${countryObj.slug}/${categorySlug}`;
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: categoryName,
      item: catPath,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const itemListSchema =
    matchingGroups.length > 0
      ? buildGroupItemListSchema(siteUrl, `${langPrefix}${catHeading} in ${displayLocation}`, matchingGroups)
      : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex-grow space-y-6">
        <AdSenseUnit slotKey="headerLeaderboard" />

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-500">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/groups/${countryObj.slug}`} className="hover:text-emerald-500">
            {countryObj.flag} {countryObj.name}
          </Link>
          {languageName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/groups/${countryObj.slug}/${languageSlug}`} className="hover:text-emerald-500">
                {languageName}
              </Link>
            </>
          )}
          {stateName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/groups/${countryObj.slug}/${stateSlug}`} className="hover:text-emerald-500">
                {stateName}
              </Link>
            </>
          )}
          {cityName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/groups/${countryObj.slug}/${stateSlug}/${citySlug}`} className="hover:text-emerald-500">
                {cityName}
              </Link>
            </>
          )}
          {categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{categoryName}</span>
            </>
          )}
        </nav>

        {/* Page Header Title */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-3 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>Verified Community Directory: {displayLocation}{languageName ? ` · ${languageName}` : ''}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {langPrefix}{cityName || stateName || countryObj.name} {catHeading}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Browse verified {langPrefix.toLowerCase()}WhatsApp group links, Telegram channels, and Arattai communities operating in {displayLocation}. Updated regularly to eliminate expired links and prevent spam.
          </p>
        </div>

        <PaidPromotionCarousel
          currentCountry={countryObj.name}
          currentState={stateName}
          currentCity={cityName}
          currentCategory={categoryName}
        />

        {/* Layout Grid (Main Content + Internal Linking / AdSense Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {matchingGroups.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No active groups listed yet for {langPrefix}{displayLocation}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Are you an admin of a {langPrefix.toLowerCase()}{catHeading.toLowerCase()} group? Add your invite link directly without login for free exposure.
                </p>
                <Link
                  href="/submit-group"
                  className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  + Add Your Group Directly (Free)
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {matchingGroups.map((group, idx) => (
                  <React.Fragment key={group.id}>
                    <GroupCard group={group} />
                    {(idx + 1) % 3 === 0 && (
                      <div className="col-span-1 md:col-span-2">
                        <AdSenseUnit slotKey="inFeedGrid" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Internal Linking Engine: Related Languages & Categories */}
            <section className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Languages className="w-5 h-5 text-emerald-600" />
                  <span>Explore {countryObj.name} Groups by Language</span>
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <Link
                      key={lang.slug}
                      href={`/groups/${countryObj.slug}/${lang.slug}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        languageSlug === lang.slug
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {lang.name} ({lang.nativeName})
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Popular {langPrefix}Group Categories</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CATEGORIES.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={
                        languageSlug
                          ? `/groups/${countryObj.slug}/${languageSlug}/${cat.slug}`
                          : `/groups/${countryObj.slug}/${cat.slug}`
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        categorySlug === cat.slug
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Community Verification &amp; Safety Checklist
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-5">
                  <li>Never pay upfront fees or deposits for job interviews or freelance onboarding.</li>
                  <li>Verify group rules upon joining and keep personal banking details private.</li>
                  <li>Help keep the community safe by reporting expired or misleading invite URLs.</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Add Your {langPrefix}Group</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Own an active {langPrefix.toLowerCase()}WhatsApp or Telegram group? Publish it directly without login and attract genuine daily members.
              </p>
              <Link
                href="/submit-group"
                className="block w-full py-2.5 text-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                + Add Group Free (No Login)
              </Link>
            </div>
            <AdSenseUnit slotKey="sidebarSticky" />
          </div>
        </div>

        <AdSenseUnit slotKey="betweenSections" />
      </main>

      <Footer />
    </div>
  );
}
