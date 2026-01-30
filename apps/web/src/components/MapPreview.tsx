import type { Venue } from "@shared/types";

interface MapPreviewProps {
  venue: Venue;
}

export function MapPreview({ venue }: MapPreviewProps) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-base font-semibold text-slate-900 dark:text-white">Venue map</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{venue.name}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{venue.address}, {venue.city}</div>
      <div
        className="mt-4 flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-semibold text-slate-700 dark:from-slate-900 dark:to-slate-800 dark:text-slate-200"
      >
        Map preview
      </div>
    </div>
  );
}

