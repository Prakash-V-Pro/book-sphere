"use client";

import { useMemo, useState } from "react";
import type { Event, TierRule } from "@shared/types";
import { BookingForm } from "./BookingForm";
import { PricingSummary } from "./PricingSummary";
import { SeatMap2D } from "./SeatMap2D";
import { MapPreview } from "./MapPreview";
import { CountdownBadge } from "./CountdownBadge";

interface EventDetailClientProps {
  event: Event;
  tiers: TierRule[];
}

export function EventDetailClient({ event, tiers }: EventDetailClientProps) {
  const [selectedZone, setSelectedZone] = useState(event.seatMap.zones[0]);
  const [tickets, setTickets] = useState(2);
  const [tier, setTier] = useState(tiers[0]?.key ?? "normal");

  const discountPercent = useMemo(() => {
    return event.isPromoted ? 10 : 0;
  }, [event.isPromoted]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="badge badge-brand">{event.type.toUpperCase()}</span>
            {event.isPromoted && <span className="badge badge-muted">Promoted</span>}
          </div>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{event.title}</h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {event.about ?? "Experience an unforgettable night with immersive audio, brilliant visuals, and a crowd that brings the energy."}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
            <span>{event.venue.city}, {event.venue.country}</span>
            <span>·</span>
            <span>{new Date(event.schedule.startAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Booking opens</span>
            <CountdownBadge opensAt={event.schedule.bookingOpensAt} />
          </div>
          <div className="mt-4">
            <PricingSummary event={event} zone={selectedZone} tickets={tickets} discountPercent={discountPercent} />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SeatMap2D event={event} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
          <MapPreview venue={event.venue} />
        </div>
        <div className="space-y-6">
          <BookingForm
            tiers={tiers}
            tickets={tickets}
            tier={tier}
            onTierChange={setTier}
            onTicketsChange={(value) => setTickets(Math.max(1, value))}
            eventSlug={event.slug}
            selectedZoneId={selectedZone.id}
          />
        </div>
      </section>
    </main>
  );
}

