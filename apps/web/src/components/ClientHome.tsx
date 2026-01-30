"use client";

import { useMemo, useState } from "react";
import type { Banner, Event, EventSection as EventSectionType, GlobalConfig, RecommendationRule } from "@shared/types";
import type { GeoCountry } from "../lib/geo";
import { BannerCarousel } from "./BannerCarousel";
import { EventSection } from "./EventSection";

interface ClientHomeProps {
  banners: Banner[];
  events: Event[];
  config: GlobalConfig;
  geoCountry: GeoCountry;
  recommendations: RecommendationRule[];
  sections: EventSectionType[];
}

export function ClientHome({ banners, events, config, geoCountry, recommendations, sections }: ClientHomeProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(geoCountry.name);
  const [price, setPrice] = useState("Any");
  const [date, setDate] = useState("Anytime");

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const locationNormalized = location.toLowerCase();
    const locationFiltered = events.filter((event) =>
      event.venue.country.toLowerCase().includes(locationNormalized)
    );
    if (!normalized) {
      return locationFiltered.length ? locationFiltered : events;
    }
    const byQuery = events.filter((event) => {
      const inTitle = event.title.toLowerCase().includes(normalized);
      const inAbout = (event.about ?? "").toLowerCase().includes(normalized);
      return inTitle || inAbout;
    });
    return byQuery.length ? byQuery : locationFiltered;
  }, [events, query, location]);

  const recommended = useMemo(() => {
    if (!config.featureFlags.recommendations) {
      return filteredEvents.slice(0, 6);
    }
    const ruleTags = new Set(recommendations.flatMap((rule) => rule.eventTags));
    const matches = filteredEvents.filter((event) => event.tags.some((tag) => ruleTags.has(tag)));
    return matches.length ? matches : filteredEvents.slice(0, 6);
  }, [filteredEvents, recommendations, config.featureFlags.recommendations]);

  const eventMap = useMemo(() => {
    return new Map(events.map((event) => [event.id, event]));
  }, [events]);

  const filteredIds = useMemo(() => {
    return new Set(filteredEvents.map((event) => event.id));
  }, [filteredEvents]);

  const dynamicSections = sections.length
    ? sections
    : [
        { id: "recommended", title: "Recommended for you", slug: "recommended", events: recommended.map((e) => ({ uid: e.id })) }
      ];

  const ensureMinimumCards = (items: Event[], min = 5): Event[] => {
    if (items.length >= min) return items;
    if (!items.length) return filteredEvents.slice(0, min);
    const padded = [...items];
    let idx = 0;
    while (padded.length < min) {
      padded.push(items[idx % items.length]);
      idx += 1;
    }
    return padded;
  };

  const ensureMinimumBanners = (items: Banner[], min = 5): Banner[] => {
    if (items.length >= min) return items;
    if (!items.length) return items;
    const padded = [...items];
    let idx = 0;
    while (padded.length < min) {
      padded.push(items[idx % items.length]);
      idx += 1;
    }
    return padded;
  };

  const paddedBanners = ensureMinimumBanners(banners, 5);

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 pb-16 pt-8">
      <section className="grid gap-10 md:grid-cols-[1fr_0.8fr] items-start">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="badge badge-brand">Live tonight</div>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white md:text-5xl">
              Discover events that match your mood.
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Concerts, sports, movies, and festivals with instant booking, QR tickets, and smooth seat selection.
            </p>
          </div>
        </div>
        <div className="glass rounded-3xl p-5 animate-fade-up">
            <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
              <input
                className="input-base"
                placeholder="Search concerts, sports, artists..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="btn-primary">Search</button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <select className="input-base" value={date} onChange={(event) => setDate(event.target.value)}>
                <option>Anytime</option>
                <option>Today</option>
                <option>This weekend</option>
                <option>Next 7 days</option>
              </select>
              <select className="input-base" value={location} onChange={(event) => setLocation(event.target.value)}>
                <option>{geoCountry.name}</option>
                <option>United States</option>
                <option>India</option>
                <option>United Kingdom</option>
              </select>
              <select className="input-base" value={price} onChange={(event) => setPrice(event.target.value)}>
                <option>Any</option>
                <option>Under $50</option>
                <option>$50-$120</option>
                <option>$120+</option>
              </select>
            </div>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        <span className="badge badge-muted">Fast checkout</span>
        <span className="badge badge-muted">Seat map preview</span>
        <span className="badge badge-muted">Wallet & QR tickets</span>
      </section>

      <section className="mt-6">
        <BannerCarousel banners={paddedBanners} />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Seat selection</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Tap to reserve in seconds</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Real-time availability with seat maps.</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Personalized</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Your vibe, curated</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Recommendations based on what you love.</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Instant tickets</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">QR passes on the go</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Save to wallet, scan and enter.</p>
        </div>
      </section>

      <div className="mt-24">
      {dynamicSections.map((section) => {
        const sectionEvents = section.events
          .map((ref) => eventMap.get(ref.uid))
          .filter((event): event is Event => Boolean(event));
        const visibleEvents = sectionEvents.filter((event) => filteredIds.has(event.id));
        const paddedEvents = ensureMinimumCards(
          visibleEvents.length ? visibleEvents : filteredEvents,
          5
        );
          return (
            <EventSection
              key={section.id}
              id={section.slug}
              title={section.title}
            events={paddedEvents.length ? paddedEvents : filteredEvents.slice(0, 6)}
            />
          );
        })}
      </div>
    </main>
  );
}

