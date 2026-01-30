import { notFound } from "next/navigation";
import { getEventBySlug } from "../../../lib/contentstack";
import { SuccessClient } from "../../../components/SuccessClient";

interface SuccessPageProps {
  params: {
    slug: string;
  };
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    notFound();
  }

  return <SuccessClient event={event} />;
}

