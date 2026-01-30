"use client";

import { useMemo } from "react";
import type { Event } from "@shared/types";
import { useSearchParams } from "next/navigation";

interface SuccessClientProps {
  event: Event;
}

export function SuccessClient({ event }: SuccessClientProps) {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "BK-0001";
  const tickets = Number(params.get("tickets") ?? 1);
  const tier = params.get("tier") ?? "normal";
  const name = params.get("name") ?? "Guest";
  const email = params.get("email") ?? "";
  const phone = params.get("phone") ?? "";

  const fileName = useMemo(() => {
    const date = new Date(event.schedule.startAt).toISOString().replace(/[:.]/g, "-");
    const safeTitle = event.title.replace(/[^a-z0-9]+/gi, "_").toUpperCase();
    return `${safeTitle}_${date}_${tickets}.pdf`;
  }, [event.title, event.schedule.startAt, tickets]);

  const handleDownload = () => {
    const content = [
      `Booking ID: ${bookingId}`,
      `Event: ${event.title}`,
      `Venue: ${event.venue.name}, ${event.venue.city}`,
      `Time: ${new Date(event.schedule.startAt).toLocaleString()}`,
      `Tickets: ${tickets}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Tier: ${tier}`
    ].join("\\n");

    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="glass rounded-3xl p-8">
        <div className="text-sm text-brand-600">Payment successful</div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          Your booking is confirmed
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Event details</div>
            <div>{event.title}</div>
            <div>{event.venue.name}, {event.venue.city}</div>
            <div>{new Date(event.schedule.startAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Booking details</div>
            <div>Booking ID: {bookingId}</div>
            <div>Tickets: {tickets}</div>
            <div>Tier: {tier}</div>
          </div>
        </div>
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="font-semibold text-slate-900 dark:text-white">Attendee</div>
          <div>{name}</div>
          <div>{email}</div>
          <div>{phone}</div>
        </div>
        <button className="btn-primary mt-6 w-full md:w-auto" onClick={handleDownload} type="button">
          Download ticket
        </button>
      </div>
    </main>
  );
}

