import type { Event, SeatZone } from "@shared/types";
import { calculateTotalPrice, calculateZonePrice } from "../lib/pricing";

interface PricingSummaryProps {
  event: Event;
  zone: SeatZone;
  tickets: number;
  discountPercent?: number;
}

export function PricingSummary({ event, zone, tickets, discountPercent }: PricingSummaryProps) {
  const zonePrice = calculateZonePrice(event, zone);
  const total = calculateTotalPrice(event, zone, tickets, discountPercent);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-base font-semibold text-slate-900 dark:text-white">Pricing summary</div>
      <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        <div>Zone price: {zonePrice} {event.currency}</div>
        <div>Tickets: {tickets}</div>
        {discountPercent ? <div>Discount: {discountPercent}%</div> : null}
      </div>
      <div className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
        Total: {total} {event.currency}
      </div>
    </div>
  );
}

