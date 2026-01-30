import { Injectable } from "@nestjs/common";
import type { Banner, Event, GlobalConfig, RecommendationRule, TierRule } from "@shared/types";
import { getConfig } from "../config/configuration";

@Injectable()
export class ContentstackService {
  private cache = new Map<string, { ts: number; data: unknown }>();

  private mockEvents: Event[] = [
    {
      id: "evt_rockwave",
      slug: "rockwave-2026",
      title: "RockWave Live 2026",
      type: "concert",
      currency: "USD",
      schedule: {
        startAt: "2026-02-18T20:00:00Z",
        bookingOpensAt: "2026-02-18T10:00:00Z"
      },
      venue: {
        name: "Aurora Dome",
        address: "12 Horizon Ave",
        city: "Austin",
        country: "USA",
        location: { lat: 30.2672, lng: -97.7431 }
      },
      tags: ["rock", "live", "featured"],
      isPromoted: true,
      banner: {
        url: "https://images.contentstack.io/v3/assets/mock/banner-rock.jpg",
        title: "RockWave Live"
      },
      seatMap: {
        id: "seatmap_rockwave",
        orientation: "stage_top",
        zones: [
          { id: "vip", label: "VIP", distanceFactor: 0.2, basePrice: 240, rows: 4, cols: 8 },
          { id: "gold", label: "Gold", distanceFactor: 0.5, basePrice: 180, rows: 6, cols: 10 },
          { id: "silver", label: "Silver", distanceFactor: 0.9, basePrice: 120, rows: 8, cols: 12 }
        ]
      },
      basePrice: 240,
      priceCurve: "decrease_with_distance",
      parkingAvailable: true
    }
  ];

  private mockBanners: Banner[] = [
    {
      id: "bnr_1",
      title: "Concerts that feel cinematic",
      subtitle: "Book premium seats before they sell out",
      image: {
        url: "https://images.contentstack.io/v3/assets/mock/hero-1.jpg",
        title: "Concert hero"
      },
      link: "/event/rockwave-2026"
    }
  ];

  private mockGlobalConfig: GlobalConfig = {
    geoIpEndpoint: "https://ipapi.co/json/",
    paymentGateways: ["Card", "UPI", "NetBanking", "Wallet"],
    featureFlags: { parking: true, discounts: true, recommendations: true }
  };

  private mockTierRules: TierRule[] = [
    { key: "tier1", label: "Platinum Pulse", maxTickets: 25 },
    { key: "tier2", label: "Golden Groove", maxTickets: 14 },
    { key: "normal", label: "Rhythm Access", maxTickets: 9 }
  ];

  private mockRecommendations: RecommendationRule[] = [
    { id: "rec_1", interestTags: ["rock"], eventTags: ["featured", "rock"] }
  ];

  private cacheGet<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    if (Date.now() - item.ts > 60_000) {
      this.cache.delete(key);
      return undefined;
    }
    return item.data as T;
  }

  private cacheSet<T>(key: string, data: T): void {
    this.cache.set(key, { ts: Date.now(), data });
  }

  private hasConfig(): boolean {
    const config = getConfig().contentstack;
    return Boolean(config.apiKey && config.deliveryToken && config.environment);
  }

  private async fetchContentstack<T>(path: string): Promise<T> {
    const config = getConfig().contentstack;
    const url = new URL(`https://${config.host}/v3${path}`);
    url.searchParams.set("environment", config.environment);

    const response = await fetch(url.toString(), {
      headers: {
        api_key: config.apiKey,
        access_token: config.deliveryToken
      }
    });

    if (!response.ok) {
      throw new Error(`Contentstack error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async getEvents(): Promise<Event[]> {
    const cached = this.cacheGet<Event[]>("events");
    if (cached) return cached;
    if (!this.hasConfig()) return this.mockEvents;

    try {
      const response = await this.fetchContentstack<{ entries: Event[] }>("/content_types/event/entries");
      this.cacheSet("events", response.entries);
      return response.entries;
    } catch {
      return this.mockEvents;
    }
  }

  async getBanners(): Promise<Banner[]> {
    const cached = this.cacheGet<Banner[]>("banners");
    if (cached) return cached;
    if (!this.hasConfig()) return this.mockBanners;

    try {
      const response = await this.fetchContentstack<{ entries: Banner[] }>("/content_types/banner/entries");
      this.cacheSet("banners", response.entries);
      return response.entries;
    } catch {
      return this.mockBanners;
    }
  }

  async getGlobalConfig(): Promise<GlobalConfig> {
    const cached = this.cacheGet<GlobalConfig>("global_config");
    if (cached) return cached;
    if (!this.hasConfig()) return this.mockGlobalConfig;

    try {
      const response = await this.fetchContentstack<{ entries: GlobalConfig[] }>(
        "/content_types/global_config/entries"
      );
      const config = response.entries[0] ?? this.mockGlobalConfig;
      this.cacheSet("global_config", config);
      return config;
    } catch {
      return this.mockGlobalConfig;
    }
  }

  async getTierRules(): Promise<TierRule[]> {
    const cached = this.cacheGet<TierRule[]>("tier_rules");
    if (cached) return cached;
    if (!this.hasConfig()) return this.mockTierRules;

    try {
      const response = await this.fetchContentstack<{ entries: TierRule[] }>("/content_types/tier_rule/entries");
      const rules = response.entries.length ? response.entries : this.mockTierRules;
      this.cacheSet("tier_rules", rules);
      return rules;
    } catch {
      return this.mockTierRules;
    }
  }

  async getRecommendations(): Promise<RecommendationRule[]> {
    const cached = this.cacheGet<RecommendationRule[]>("recommendations");
    if (cached) return cached;
    if (!this.hasConfig()) return this.mockRecommendations;

    try {
      const response = await this.fetchContentstack<{ entries: RecommendationRule[] }>(
        "/content_types/recommendation_rule/entries"
      );
      this.cacheSet("recommendations", response.entries);
      return response.entries;
    } catch {
      return this.mockRecommendations;
    }
  }
}

