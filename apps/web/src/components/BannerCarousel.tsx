"use client";

import Link from "next/link";
import type { Banner } from "@shared/types";
import { useEffect, useRef } from "react";

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || banners.length <= 1) return;
    let index = 0;
    const timer = setInterval(() => {
      const card = container.querySelector<HTMLElement>("[data-banner-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16;
      index = (index + 1) % banners.length;
      container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }, 3500);

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="glass rounded-3xl p-4">
      <div ref={scrollRef} className="carousel" style={{ height: "40vh" }}>
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link ?? "#"}
            className="banner-card relative h-full overflow-hidden rounded-2xl bg-white shadow-soft transition hover-tilt dark:bg-slate-900"
            data-banner-card
          >
            {banner.image?.url ? (
              <img
                src={banner.image.url}
                alt={banner.image.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-brand-200 to-brand-100" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 backdrop-blur dark:bg-slate-950/80">
              <div className="text-base font-semibold text-slate-900 dark:text-white">{banner.title}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">{banner.subtitle}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

