import { Group } from '@/lib/types';

export interface LanguageTaxonomy {
  slug: string;
  name: string;
  nativeName: string;
  primaryKeyword: string;
}

export const SUPPORTED_LANGUAGES: LanguageTaxonomy[] = [
  { slug: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', primaryKeyword: 'Tamil WhatsApp Group Links' },
  { slug: 'english', name: 'English', nativeName: 'English', primaryKeyword: 'English WhatsApp Group Links' },
  { slug: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', primaryKeyword: 'Hindi WhatsApp Group Links' },
  { slug: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', primaryKeyword: 'Malayalam WhatsApp Group Links' },
  { slug: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', primaryKeyword: 'Telugu WhatsApp Group Links' },
  { slug: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', primaryKeyword: 'Kannada WhatsApp Group Links' },
];

export const PRIORITY_90_DAY_CLUSTERS = [
  { priority: 1, keyword: 'WhatsApp group links', path: '/whatsapp' },
  { priority: 2, keyword: 'Tamil WhatsApp group links', path: '/india/tamil' },
  { priority: 3, keyword: 'Jobs WhatsApp group links', path: '/india/tamil/jobs' },
  { priority: 4, keyword: 'Education WhatsApp groups', path: '/india/tamil/education' },
  { priority: 5, keyword: 'Business WhatsApp groups', path: '/india/tamil/business' },
  { priority: 6, keyword: 'Study WhatsApp groups', path: '/india/english/education' },
  { priority: 7, keyword: 'Technology WhatsApp groups', path: '/india/tamil/technology' },
  { priority: 8, keyword: 'Gaming WhatsApp groups', path: '/india/tamil/gaming' },
  { priority: 9, keyword: 'Country-specific group links', path: '/groups/india' },
  { priority: 10, keyword: 'WhatsApp group links by language', path: '/india' },
];

export const ALLOWED_INVITE_DOMAINS = [
  'chat.whatsapp.com',
  'whatsapp.com',
  'wa.me',
  't.me',
  'telegram.me',
  'arattai.in',
  'discord.gg',
  'discord.com',
  'facebook.com',
  'fb.com',
  'instagram.com',
  'ig.me',
];

/**
 * Validates that a community invite URL points to a recognized messaging platform
 * and is well-formed (Broken Link & Anti-Spam Pre-Check).
 */
export function validateGroupInviteUrl(rawUrl: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, reason: 'Invite URL must start with https://' };
    }
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const isKnownHost = ALLOWED_INVITE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
    if (!isKnownHost) {
      return {
        valid: false,
        reason: 'Please enter a valid WhatsApp, Telegram, Arattai, Discord, Instagram, or Facebook invite link.',
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid URL format. Example: https://chat.whatsapp.com/...' };
  }
}

/**
 * Indexation Manager: Prevents Google scaled content abuse / thin doorway penalties.
 * Only allows search engines to index programmatic landing pages that have actual active listings.
 */
export function getIndexationRobots(matchingCount: number, isRootHub: boolean = false) {
  const shouldIndex = isRootHub || matchingCount >= 1;
  return {
    index: shouldIndex,
    follow: true,
    googleBot: {
      index: shouldIndex,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
    },
  };
}

/**
 * Automated SEO Metadata Mapper for Programmatic Geo/Language/Category Landing Pages
 */
export function buildProgrammaticSeoMeta(opts: {
  siteUrl: string;
  canonicalPath: string;
  countryName: string;
  stateName?: string;
  cityName?: string;
  languageName?: string;
  categoryName?: string;
  matchingCount: number;
}) {
  const { siteUrl, canonicalPath, countryName, stateName, cityName, languageName, categoryName, matchingCount } = opts;

  const locationParts = [cityName, stateName, countryName].filter(Boolean);
  const locationLabel = locationParts.join(', ');
  const langLabel = languageName ? `${languageName} ` : '';
  const catLabel = categoryName ? `${categoryName} ` : '';

  const title = `${langLabel}${catLabel}WhatsApp & Telegram Groups in ${locationLabel} – Active Invites`;
  const description =
    matchingCount > 0
      ? `Browse ${matchingCount}+ verified ${langLabel.toLowerCase()}${catLabel.toLowerCase()}WhatsApp, Telegram & Arattai groups in ${locationLabel}. Direct invite links, zero spam, updated regularly.`
      : `Discover or add verified ${langLabel.toLowerCase()}${catLabel.toLowerCase()}WhatsApp & Telegram groups in ${locationLabel}. Free instant directory listing without login.`;

  const keywords = [
    `${langLabel}${catLabel}WhatsApp group links`,
    `${locationLabel} ${catLabel}groups`,
    `${langLabel}Telegram channels`,
    `${catLabel}community links ${countryName}`,
    'active group invite links',
  ].map((k) => k.trim());

  return {
    title,
    description,
    keywords,
    canonical: `${siteUrl}${canonicalPath}`,
    robots: getIndexationRobots(matchingCount, !stateName && !cityName && !categoryName && !languageName),
  };
}

/**
 * Generates Schema.org ItemList JSON-LD for Directory Pages
 */
export function buildGroupItemListSchema(siteUrl: string, name: string, groups: Group[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: groups.length,
    itemListElement: groups.slice(0, 15).map((g, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: g.name,
      url: `${siteUrl}/group/${g.slug}`,
      description: g.description,
    })),
  };
}
