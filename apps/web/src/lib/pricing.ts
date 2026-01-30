import type { Event, SeatZone } from "@shared/types";

export function calculateZonePrice(event: Event, zone: SeatZone): number {
  const distance = zone.distanceFactor;
  if (event.priceCurve === "decrease_with_distance") {
    return Math.max(10, Math.round(zone.basePrice * (1 - distance * 0.4)));
  }
  return Math.max(10, Math.round(zone.basePrice * (1 + distance * 0.4)));
}

export function calculateTotalPrice(
  event: Event,
  zone: SeatZone,
  tickets: number,
  discountPercent?: number
): number {
  const zonePrice = calculateZonePrice(event, zone);
  const subtotal = zonePrice * tickets;
  if (discountPercent && discountPercent > 0) {
    return Math.max(0, Math.round(subtotal * (1 - discountPercent / 100)));
  }
  return subtotal;
}

