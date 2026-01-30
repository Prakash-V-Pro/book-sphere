import { notFound } from "next/navigation";
import { EventDetailClient } from "../../../components/EventDetailClient";
import { getEventBySlug, getTierRules } from "../../../lib/contentstack";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    notFound();
  }
  const tiers = await getTierRules();

  return <EventDetailClient event={event} tiers={tiers} />;
}

