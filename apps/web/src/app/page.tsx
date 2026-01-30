import { ClientHome } from "../components/ClientHome";
import { getBanners, getEventSections, getEvents, getGlobalConfig, getRecommendations } from "../lib/contentstack";
import { getCountryFromIp } from "../lib/geo";

export default async function HomePage() {
  const [config, banners, events, recommendations, sections] = await Promise.all([
    getGlobalConfig(),
    getBanners(),
    getEvents(),
    getRecommendations(),
    getEventSections()
  ]);
  const geoCountry = await getCountryFromIp(config);

  return (
    <ClientHome
      banners={banners}
      events={events}
      config={config}
      recommendations={recommendations}
      sections={sections}
      geoCountry={geoCountry}
    />
  );
}

