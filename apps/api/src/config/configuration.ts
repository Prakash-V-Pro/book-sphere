export interface ApiConfig {
  port: number;
  contentstack: {
    apiKey: string;
    deliveryToken: string;
    environment: string;
    host: string;
  };
}

export function getConfig(): ApiConfig {
  return {
    port: Number(process.env.API_PORT ?? 4000),
    contentstack: {
      apiKey: process.env.API_CONTENTSTACK_API_KEY ?? "",
      deliveryToken: process.env.API_CONTENTSTACK_DELIVERY_TOKEN ?? "",
      environment: process.env.API_CONTENTSTACK_ENVIRONMENT ?? "",
      host: process.env.API_CONTENTSTACK_HOST ?? "cdn.contentstack.io"
    }
  };
}

