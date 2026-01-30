import Link from "next/link";
import type { Event } from "@shared/types";
import { useMemo } from "react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const countdown = useMemo(() => {
    const diff = new Date(event.schedule.bookingOpensAt).getTime() - Date.now();
    if (Number.isNaN(diff)) return "Open soon";
    const mins = Math.max(0, Math.floor(diff / 60000));
    if (mins === 0) return "Opens now";
    if (mins < 60) return `Opens in ${mins}m`;
    const hrs = Math.floor(mins / 60);
    return `Opens in ${hrs}h`;
  }, [event.schedule.bookingOpensAt]);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover-tilt dark:border-slate-800 dark:bg-slate-900"
    >
      {event.banner?.url ? (
        <img
          src={event.banner.url}
          alt={event.banner.title}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-gradient-to-r from-brand-200 to-brand-100" />
      )}
      <div className="space-y-3 p-4">
        <div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">{event.title}</div>
          <div className="text-sm text-slate-500 dark:text-slate-300">{event.venue.city}, {event.venue.country}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-muted">{event.type.toUpperCase()}</span>
          {event.isPromoted && <span className="badge badge-brand">Promotion</span>}
          <span className="badge badge-muted animate-pulseSoft">{countdown}</span>
        </div>
        {event.about ? (
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
            {event.about}
          </p>
        ) : null}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
          <span>Starts {new Date(event.schedule.startAt).toLocaleDateString()}</span>
          <span>From {event.currency} {Math.max(10, Math.round(event.basePrice * 0.6))}</span>
        </div>
      </div>
    </Link>
  );
}

