"use client";

import type { Event } from "@shared/types";
import { EventCard } from "./EventCard";
import { useEffect, useRef } from "react";

interface EventSectionProps {
  id: string;
  title: string;
  events: Event[];
}

export function EventSection({ id, title, events }: EventSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || events.length <= 1) return;

    let index = 0;
    const interval = setInterval(() => {
      const card = container.querySelector<HTMLElement>("[data-carousel-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16;
      index = (index + 1) % events.length;
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }, 4500);

    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <section id={id} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">{title}</h2>
        <span className="text-xs text-slate-500">{events.length} events</span>
      </div>
      <div ref={scrollRef} className="carousel pb-2">
        {events.map((event) => (
          <div key={event.id} className="carousel-card" data-carousel-card>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}

