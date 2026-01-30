import type { Banner, Event, EventSection, GlobalConfig, RecommendationRule, TierRule } from "@shared/types";

const API_KEY = process.env.CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.CONTENTSTACK_DELIVERY_TOKEN;
const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT;
const HOST = process.env.CONTENTSTACK_HOST ?? "cdn.contentstack.io";

const hasContentstackConfig = Boolean(API_KEY && DELIVERY_TOKEN && ENVIRONMENT);

const defaultConfig: GlobalConfig = {
  geoIpEndpoint: "https://ipapi.co/json/",
  paymentGateways: ["Card", "UPI", "NetBanking", "Wallet"],
  featureFlags: {
    parking: true,
    discounts: true,
    recommendations: true
  }
};

const defaultTiers: TierRule[] = [
  { key: "tier1", label: "Platinum Pulse", maxTickets: 25 },
  { key: "tier2", label: "Golden Groove", maxTickets: 14 },
  { key: "normal", label: "Rhythm Access", maxTickets: 9 }
];

const mockEvents: Event[] = [
  {
    id: "evt_rockwave",
    slug: "rockwave-2026",
    title: "RockWave Live 2026",
    type: "concert",
    currency: "USD",
    about:
      "RockWave Live 2026 brings arena-sized energy with a full-band experience, immersive lighting, and a setlist built for sing-alongs.",
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
  },
  {
    id: "evt_cinematica",
    slug: "cinematica-premiere",
    title: "Cinematica Premiere",
    type: "movie",
    currency: "USD",
    about:
      "Cinematica Premiere is a red-carpet screening with cast Q&A, cinematic sound design, and collector passes.",
    schedule: {
      startAt: "2026-02-01T19:30:00Z",
      bookingOpensAt: "2026-01-31T10:00:00Z"
    },
    venue: {
      name: "Lumen Screenhouse",
      address: "66 Silver Street",
      city: "Seattle",
      country: "USA",
      location: { lat: 47.6062, lng: -122.3321 }
    },
    tags: ["cinema", "premiere"],
    isPromoted: false,
    banner: {
      url: "https://images.contentstack.io/v3/assets/mock/banner-movie.jpg",
      title: "Cinematica"
    },
    seatMap: {
      id: "seatmap_cinematica",
      orientation: "screen_top",
      zones: [
        { id: "front", label: "Front", distanceFactor: 0.2, basePrice: 14, rows: 4, cols: 10 },
        { id: "mid", label: "Middle", distanceFactor: 0.6, basePrice: 18, rows: 6, cols: 12 },
        { id: "rear", label: "Rear", distanceFactor: 0.9, basePrice: 24, rows: 6, cols: 14 }
      ]
    },
    basePrice: 20,
    priceCurve: "increase_with_distance",
    parkingAvailable: false
  },
  {
    id: "evt_stadium_rush",
    slug: "stadium-rush-finals",
    title: "Stadium Rush Finals",
    type: "sports",
    currency: "USD",
    about:
      "Stadium Rush Finals delivers championship intensity with halftime performances, fan zones, and premium hospitality.",
    schedule: {
      startAt: "2026-03-05T18:00:00Z",
      bookingOpensAt: "2026-03-01T10:00:00Z"
    },
    venue: {
      name: "Pulse Arena",
      address: "400 Victory Road",
      city: "Chicago",
      country: "USA",
      location: { lat: 41.8781, lng: -87.6298 }
    },
    tags: ["sports", "finals", "featured"],
    isPromoted: true,
    banner: {
      url: "https://images.contentstack.io/v3/assets/mock/banner-sports.jpg",
      title: "Stadium Rush"
    },
    seatMap: {
      id: "seatmap_stadium",
      orientation: "stage_top",
      zones: [
        { id: "front", label: "Front Row", distanceFactor: 0.2, basePrice: 180, rows: 5, cols: 12 },
        { id: "mid", label: "Mid Bowl", distanceFactor: 0.6, basePrice: 120, rows: 6, cols: 14 },
        { id: "upper", label: "Upper Deck", distanceFactor: 0.9, basePrice: 80, rows: 8, cols: 16 }
      ]
    },
    basePrice: 180,
    priceCurve: "decrease_with_distance",
    parkingAvailable: true
  }
];

const mockBanners: Banner[] = [
  {
    id: "bnr_1",
    title: "Concerts that feel cinematic",
    subtitle: "Book premium seats before they sell out",
    image: {
      url: "https://images.contentstack.io/v3/assets/mock/hero-1.jpg",
      title: "Concert hero"
    },
    link: "/event/rockwave-2026"
  },
  {
    id: "bnr_2",
    title: "Movie nights, curated",
    subtitle: "New premieres every weekend",
    image: {
      url: "https://images.contentstack.io/v3/assets/mock/hero-2.jpg",
      title: "Movie hero"
    },
    link: "/event/cinematica-premiere"
  }
];

const mockRecommendations: RecommendationRule[] = [
  {
    id: "rec_1",
    interestTags: ["rock", "live"],
    eventTags: ["rock", "featured"]
  }
];

const mockSections: EventSection[] = [
  {
    id: "sec_recommended",
    title: "Recommended for you",
    slug: "recommended",
    layout: "carousel",
    events: mockEvents.map((event) => ({ uid: event.id }))
  },
  {
    id: "sec_upcoming",
    title: "Upcoming events",
    slug: "upcoming",
    layout: "carousel",
    events: mockEvents.map((event) => ({ uid: event.id }))
  },
  {
    id: "sec_promoted",
    title: "Promoted picks",
    slug: "promotions",
    layout: "carousel",
    events: mockEvents.filter((event) => event.isPromoted).map((event) => ({ uid: event.id }))
  }
];

type RawAsset = { url?: string; title?: string; uid?: string; filename?: string } | string;

function pickField<T>(raw: Record<string, unknown>, camel: string, snake: string): T | undefined {
  return (raw[camel] ?? raw[snake]) as T | undefined;
}

function normalizeAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function buildAssetUrl(asset?: { uid?: string; filename?: string }): string | undefined {
  if (!asset?.uid || !asset?.filename || !API_KEY) return undefined;
  return `https://images.contentstack.io/v3/assets/${API_KEY}/${asset.uid}/${asset.filename}`;
}

function mapAsset(raw?: RawAsset | RawAsset[]): { url: string; title: string } | undefined {
  if (!raw) return undefined;
  const asset = Array.isArray(raw) ? raw[0] : raw;
  if (typeof asset === "string") {
    const url = normalizeAssetUrl(asset);
    return url ? { url, title: "Asset" } : undefined;
  }
  const url =
    normalizeAssetUrl(asset?.url) ??
    buildAssetUrl({ uid: asset?.uid, filename: asset?.filename });
  if (!url) return undefined;
  return { url, title: asset?.title ?? "Asset" };
}

function parseJson<T>(value?: string | T): T | undefined {
  if (!value) return undefined;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function mapGlobalConfig(raw: Record<string, unknown>): GlobalConfig {
  const flags = pickField<Record<string, boolean>>(raw, "featureFlags", "feature_flags") ?? {};
  return {
    geoIpEndpoint: pickField<string>(raw, "geoIpEndpoint", "geo_ip_endpoint") ?? defaultConfig.geoIpEndpoint,
    paymentGateways:
      pickField<string[]>(raw, "paymentGateways", "payment_gateways") ?? defaultConfig.paymentGateways,
    featureFlags: {
      parking: flags.parking ?? defaultConfig.featureFlags.parking,
      discounts: flags.discounts ?? defaultConfig.featureFlags.discounts,
      recommendations: flags.recommendations ?? defaultConfig.featureFlags.recommendations
    }
  };
}

function mapTierRule(raw: Record<string, unknown>): TierRule {
  return {
    key: pickField<string>(raw, "key", "key") ?? "normal",
    label: pickField<string>(raw, "label", "label") ?? "Member",
    maxTickets: pickField<number>(raw, "maxTickets", "max_tickets") ?? 9
  };
}

function mapSeatMap(raw: Record<string, unknown>): SeatMap {
  const zones = parseJson<SeatMap["zones"]>(pickField(raw, "zones", "zones_json")) ?? [];
  return {
    id: pickField<string>(raw, "id", "uid") ?? "seatmap",
    orientation: pickField<SeatMap["orientation"]>(raw, "orientation", "orientation") ?? "stage_top",
    zones
  };
}

function mapEvent(raw: Record<string, unknown>): Event {
  const scheduleRaw = pickField<Record<string, unknown>>(raw, "schedule", "schedule") ?? {};
  const venueRaw = pickField<Record<string, unknown>>(raw, "venue", "venue") ?? {};
  const seatMapRaw =
    parseJson<Record<string, unknown>>(pickField(raw, "seatMap", "seat_map_json")) ??
    parseJson<Record<string, unknown>>(pickField(raw, "seat_map_json", "seat_map_json")) ??
    {};

  const gallery = (pickField(raw, "gallery", "gallery") as RawAsset[] | undefined)
    ?.map((asset) => ({ url: asset.url ?? "", title: asset.title ?? "Asset" }))
    .filter((asset) => Boolean(asset.url));
  const banner = mapAsset(pickField(raw, "banner", "banner")) ?? gallery?.[0];

  return {
    id: pickField<string>(raw, "id", "uid") ?? "evt",
    slug: pickField<string>(raw, "slug", "slug") ?? "",
    title: pickField<string>(raw, "title", "title") ?? "",
    type: (pickField<string>(raw, "type", "type") ?? "concert") as Event["type"],
    currency: (pickField<string>(raw, "currency", "currency") ?? "USD") as Event["currency"],
    schedule: {
      startAt: pickField<string>(scheduleRaw, "startAt", "start_at") ?? "",
      bookingOpensAt: pickField<string>(scheduleRaw, "bookingOpensAt", "booking_opens_at") ?? "",
      bookingClosesAt: pickField<string>(scheduleRaw, "bookingClosesAt", "booking_closes_at")
    },
    venue: {
      name: pickField<string>(venueRaw, "name", "name") ?? "",
      address: pickField<string>(venueRaw, "address", "address") ?? "",
      city: pickField<string>(venueRaw, "city", "city") ?? "",
      country: pickField<string>(venueRaw, "country", "country") ?? "",
      location: pickField(venueRaw, "location", "location") as Event["venue"]["location"]
    },
    about: pickField<string>(raw, "about", "about") ?? pickField<string>(raw, "aboutEvent", "about_event"),
    tags: pickField<string[]>(raw, "event_tags", "event_tags") ?? [],
    isPromoted: Boolean(pickField<boolean>(raw, "isPromoted", "is_promoted")),
    banner,
    gallery,
    seatMap: mapSeatMap(seatMapRaw),
    basePrice: pickField<number>(raw, "basePrice", "base_price") ?? 0,
    priceCurve: (pickField<string>(raw, "priceCurve", "price_curve") ??
      "decrease_with_distance") as Event["priceCurve"],
    parkingAvailable: Boolean(pickField<boolean>(raw, "parkingAvailable", "parking_available"))
  };
}

function mapBanner(raw: Record<string, unknown>): Banner {
  return {
    id: pickField<string>(raw, "id", "uid") ?? "banner",
    title: pickField<string>(raw, "title", "title") ?? "",
    subtitle: pickField<string>(raw, "subtitle", "subtitle"),
    image: mapAsset(pickField(raw, "image", "image")) ?? { url: "", title: "Banner" },
    link: pickField<string>(raw, "link", "link")
  };
}

function mapRecommendation(raw: Record<string, unknown>): RecommendationRule {
  return {
    id: pickField<string>(raw, "id", "uid") ?? "rec",
    interestTags: pickField<string[]>(raw, "interestTags", "interest_tags") ?? [],
    eventTags: pickField<string[]>(raw, "eventTags", "event_tags") ?? []
  };
}

function mapEventSection(raw: Record<string, unknown>): EventSection {
  return {
    id: pickField<string>(raw, "id", "uid") ?? "section",
    title: pickField<string>(raw, "title", "title") ?? "",
    slug: pickField<string>(raw, "slug", "slug") ?? "",
    layout: pickField<string>(raw, "layout", "layout"),
    events: (pickField(raw, "events", "events") as Array<{ uid: string }> | undefined) ?? []
  };
}

async function fetchContentstack<T>(path: string): Promise<T> {
  if (!hasContentstackConfig) {
    throw new Error("Contentstack config missing.");
  }

  const url = new URL(`https://${HOST}/v3${path}`);
  url.searchParams.set("environment", ENVIRONMENT as string);

  const response = await fetch(url.toString(), {
    headers: {
      api_key: API_KEY as string,
      access_token: DELIVERY_TOKEN as string
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Contentstack error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGlobalConfig(): Promise<GlobalConfig> {
  if (!hasContentstackConfig) {
    return defaultConfig;
  }

  try {
    const response = await fetchContentstack<{ entries: Record<string, unknown>[] }>(
      "/content_types/global_config/entries"
    );
    return response.entries[0] ? mapGlobalConfig(response.entries[0]) : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export async function getTierRules(): Promise<TierRule[]> {
  if (!hasContentstackConfig) {
    return defaultTiers;
  }

  try {
    const response = await fetchContentstack<{ entries: Record<string, unknown>[] }>(
      "/content_types/tier_rule/entries"
    );
    return response.entries.length ? response.entries.map(mapTierRule) : defaultTiers;
  } catch {
    return defaultTiers;
  }
}

export async function getBanners(): Promise<Banner[]> {
  if (!hasContentstackConfig) {
    return mockBanners;
  }

  try {
    const response = await fetchContentstack<{ entries: Record<string, unknown>[] }>(
      "/content_types/banner/entries?include[]=image"
    );
    const banners = response.entries.map(mapBanner);
    return banners.length >= 2 ? banners : mockBanners;
  } catch {
    return mockBanners;
  }
}

export async function getEvents(): Promise<Event[]> {
  if (!hasContentstackConfig) {
    return mockEvents;
  }

  try {
    const response = await fetchContentstack<{ entries: Record<string, unknown>[] }>(
      "/content_types/event/entries?include[]=banner&include[]=gallery"
    );
    return response.entries.map(mapEvent);
  } catch {
    return mockEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const events = await getEvents();
  return events.find((event) => event.slug === slug);
}

export async function getRecommendations(): Promise<RecommendationRule[]> {
  if (!hasContentstackConfig) {
    return mockRecommendations;
  }

  try {
    const response = await fetchContentstack<{ entries: Record<string, unknown>[] }>(
      "/content_types/recommendation_rule/entries"
    );
    return response.entries.map(mapRecommendation);
  } catch {
    return mockRecommendations;
  }
}

export async function getEventSections(): Promise<EventSection[]> {
  if (!hasContentstackConfig) {
    return mockSections;
  }

  try {
    const response = await fetchContentstack<{ entries: EventSection[] }>("/content_types/event_section/entries");
    const sections = response.entries.map((entry) => mapEventSection(entry as Record<string, unknown>));
    return sections.length ? sections : mockSections;
  } catch {
    return mockSections;
  }
}

