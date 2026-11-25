import { Group, Platform } from '@/lib/types';
import { INITIAL_GROUPS } from '@/lib/data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const GROUPS_STORAGE_KEY = 'grouphub_custom_groups';

class GroupStoreClass {
  private customGroups: Group[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initStore();
  }

  private initStore() {
    if (typeof window !== 'undefined' && !this.initialized) {
      try {
        const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
        if (stored) {
          this.customGroups = JSON.parse(stored);
        }
        this.initialized = true;
      } catch (e) {
        console.warn('LocalStorage read warning in GroupStore:', e);
      }
    }
  }

  private persistCustomGroups() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(this.customGroups));
      } catch (e) {}
    }
  }

  private mapSupabaseRow(row: any): Group {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      platform: (row.platform_slug || 'whatsapp') as Platform,
      inviteUrl: row.invite_url,
      country: row.country || 'India',
      countryCode: row.country_code || 'IN',
      state: row.state || '',
      city: row.city || '',
      area: row.area || '',
      category: row.category_name || 'Technology',
      language: row.language || 'English',
      memberCount: row.member_count || 120,
      imageUrl: row.image_url,
      status: row.status || 'approved',
      isVerified: row.is_verified ?? true,
      isFeatured: row.is_featured ?? false,
      lastChecked: row.updated_at || row.created_at || new Date().toISOString(),
      reportsCount: row.reports_count || 0,
      viewsCount: row.views_count || 1,
      clicksCount: row.clicks_count || 0,
      adminEmail: row.admin_email,
      ownerEmail: row.owner_email,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Synchronous list of custom + initial groups for immediate render
   */
  getGroupsSync(): Group[] {
    this.initStore();
    const seenSlugs = new Set<string>();
    const combined: Group[] = [];

    for (const g of [...this.customGroups, ...INITIAL_GROUPS]) {
      if (!seenSlugs.has(g.slug)) {
        seenSlugs.add(g.slug);
        combined.push(g);
      }
    }
    return combined;
  }

  /**
   * Async list merging Supabase live rows + custom local groups + initial seed groups
   */
  async getGroups(): Promise<Group[]> {
    this.initStore();
    let supabaseGroups: Group[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          supabaseGroups = data.map((row: any) => this.mapSupabaseRow(row));
        }
      } catch (e) {
        console.warn('Supabase groups fetch fallback:', e);
      }
    }

    const seenInviteUrls = new Set<string>();
    const seenSlugs = new Set<string>();
    const combined: Group[] = [];

    for (const g of [...supabaseGroups, ...this.customGroups, ...INITIAL_GROUPS]) {
      const urlKey = g.inviteUrl.trim().toLowerCase();
      if (!seenSlugs.has(g.slug) && !seenInviteUrls.has(urlKey)) {
        seenSlugs.add(g.slug);
        seenInviteUrls.add(urlKey);
        combined.push(g);
      }
    }

    return combined;
  }

  async getGroupBySlug(slug: string): Promise<Group | null> {
    const all = await this.getGroups();
    return all.find((g) => g.slug === slug) || null;
  }

  /**
   * Direct public submission (No Login Required -> Auto-Approved for Immediate Traffic)
   */
  async createGroup(data: {
    name: string;
    platform: Platform;
    category: string;
    inviteUrl: string;
    description: string;
    country?: string;
    state?: string;
    city?: string;
    area?: string;
    language?: string;
  }): Promise<Group> {
    this.initStore();

    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug || 'community-group'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      platform: data.platform,
      inviteUrl: data.inviteUrl.trim(),
      country: data.country || 'India',
      countryCode: (data.country || 'India').toLowerCase() === 'india' ? 'IN' : 'GLOBAL',
      state: data.state || '',
      city: data.city || '',
      area: data.area || '',
      category: data.category || 'Technology',
      language: data.language || 'English',
      memberCount: 1,
      status: 'approved', // Instant Auto-Approve for immediate directory listing
      isVerified: true,
      isFeatured: false,
      lastChecked: now,
      reportsCount: 0,
      viewsCount: 1,
      clicksCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Save locally immediately
    this.customGroups.unshift(newGroup);
    this.persistCustomGroups();

    // Persist to Supabase live database (anonymous public insert enabled)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('groups')
          .insert([
            {
              name: newGroup.name,
              slug: newGroup.slug,
              description: newGroup.description,
              platform_slug: newGroup.platform,
              category_name: newGroup.category,
              invite_url: newGroup.inviteUrl,
              country: newGroup.country,
              country_code: newGroup.countryCode,
              state: newGroup.state || null,
              city: newGroup.city || null,
              area: newGroup.area || null,
              language: newGroup.language,
              member_count: 1,
              status: 'approved',
              is_verified: true,
              is_featured: false,
            },
          ])
          .select()
          .single();

        if (!error && inserted) {
          return this.mapSupabaseRow(inserted);
        }
        if (error) {
          console.warn('Supabase group insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase group insert fallback:', err);
      }
    }

    return newGroup;
  }
}

export const GroupStore = new GroupStoreClass();
