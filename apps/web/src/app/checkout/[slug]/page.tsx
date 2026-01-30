import { notFound } from "next/navigation";
import { CheckoutClient } from "../../../components/CheckoutClient";
import { getEventBySlug, getGlobalConfig } from "../../../lib/contentstack";

interface CheckoutPageProps {
  params: {
    slug: string;
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const [event, config] = await Promise.all([getEventBySlug(params.slug), getGlobalConfig()]);
  if (!event) {
    notFound();
  }

  return <CheckoutClient event={event} config={config} />;
}

