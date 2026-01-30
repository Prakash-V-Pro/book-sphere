export type EventType = "concert" | "movie" | "sports" | "theater" | "other";
export type CurrencyCode = "USD" | "EUR" | "INR" | "GBP" | "AUD" | string;
export type TierKey = "tier1" | "tier2" | "normal";
export interface TierRule {
    key: TierKey;
    label: string;
    maxTickets: number;
}
export interface SeatZone {
    id: string;
    label: string;
    distanceFactor: number;
    basePrice: number;
    rows: number;
    cols: number;
}
export interface SeatMap {
    id: string;
    zones: SeatZone[];
    orientation: "stage_top" | "screen_top";
}
export interface EventSchedule {
    startAt: string;
    bookingOpensAt: string;
    bookingClosesAt?: string;
}
export interface Venue {
    name: string;
    address: string;
    city: string;
    country: string;
    location?: {
        lat: number;
        lng: number;
    };
}
export interface EventAsset {
    url: string;
    title: string;
    description?: string;
}
export interface Event {
    id: string;
    slug: string;
    title: string;
    type: EventType;
    currency: CurrencyCode;
    schedule: EventSchedule;
    venue: Venue;
    about?: string;
    tags: string[];
    isPromoted: boolean;
    banner?: EventAsset;
    gallery?: EventAsset[];
    seatMap: SeatMap;
    basePrice: number;
    priceCurve: "decrease_with_distance" | "increase_with_distance";
    parkingAvailable: boolean;
}
export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    image: EventAsset;
    link?: string;
}
export interface RecommendationRule {
    id: string;
    interestTags: string[];
    eventTags: string[];
}
export interface EventSection {
    id: string;
    title: string;
    slug: string;
    layout?: string;
    events: Array<{
        uid: string;
    }>;
}
export interface GlobalConfig {
    geoIpEndpoint: string;
    paymentGateways: string[];
    featureFlags: Record<string, boolean>;
}
export interface BookingRequest {
    eventId: string;
    tickets: number;
    tier: TierKey;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    parking: boolean;
    discountCode?: string;
}
export interface BookingResult {
    bookingId: string;
    totalPrice: number;
    currency: CurrencyCode;
    pdfFileName: string;
}
