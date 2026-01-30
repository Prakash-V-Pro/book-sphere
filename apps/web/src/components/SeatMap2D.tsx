import { useMemo } from "react";
import type { Event, SeatZone } from "@shared/types";
import { calculateZonePrice } from "../lib/pricing";

interface SeatMap2DProps {
  event: Event;
  selectedZone: SeatZone;
  onSelectZone: (zone: SeatZone) => void;
}

export function SeatMap2D({ event, selectedZone, onSelectZone }: SeatMap2DProps) {
  const zones = event.seatMap.zones;
  const maxCols = useMemo(() => Math.max(...zones.map((zone) => zone.cols)), [zones]);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-base font-semibold text-slate-900 dark:text-white">
        {event.seatMap.orientation === "stage_top" ? "Stage" : "Screen"}
      </div>
      <div className="mt-4 grid gap-3">
        {zones.map((zone) => {
          const price = calculateZonePrice(event, zone);
          return (
            <button
              key={zone.id}
              className={`rounded-2xl border p-4 text-left transition ${
                zone.id === selectedZone.id
                  ? "border-brand-500 bg-brand-50 dark:bg-slate-900"
                  : "border-slate-200 bg-white hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900"
              }`}
              onClick={() => onSelectZone(zone)}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{zone.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-300">{price} {event.currency}</div>
              </div>
              <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
                {Array.from({ length: zone.rows * maxCols }).map((_, index) => {
                  const row = Math.floor(index / maxCols);
                  const col = index % maxCols;
                  const isActive = row < zone.rows && col < zone.cols;
                  return (
                    <div
                      key={`${zone.id}-${index}`}
                      className={`h-5 rounded-md text-center text-[9px] ${
                        zone.id === selectedZone.id ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                      }`}
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {isActive ? "•" : ""}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

