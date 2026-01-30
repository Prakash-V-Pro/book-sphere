import type { GlobalConfig } from "@shared/types";

export interface GeoCountry {
  name: string;
  code: string;
  city?: string;
  currency?: string;
}

export async function getCountryFromIp(config: GlobalConfig): Promise<GeoCountry> {
  try {
    const response = await fetch(config.geoIpEndpoint, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error("Geo lookup failed");
    }
    const data = (await response.json()) as {
      country_name?: string;
      country_code?: string;
      city?: string;
      currency?: string;
    };

    return {
      name: data.country_name ?? "United States",
      code: data.country_code ?? "US",
      city: data.city,
      currency: data.currency
    };
  } catch {
    return { name: "United States", code: "US", city: "Austin", currency: "USD" };
  }
}

