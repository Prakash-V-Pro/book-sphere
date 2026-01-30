const contentstack = require("@contentstack/management");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/.env` });
dotenv.config({ path: `${__dirname}/env` });
dotenv.config();

const requiredEnv = ["CS_MANAGEMENT_TOKEN", "CS_STACK_API_KEY", "CS_ENVIRONMENT_NAME"];
const sanitize = (value) => (value || "").trim().replace(/^"+|"+$/g, "");
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}. Add it to tools/contentstack-setup/.env or your shell env.`);
  }
});

const managementToken = sanitize(process.env.CS_MANAGEMENT_TOKEN);
const userAuthToken = sanitize(process.env.CS_AUTH_TOKEN);
const stackApiKey = sanitize(process.env.CS_STACK_API_KEY);
const managementHost = sanitize(process.env.CS_MANAGEMENT_HOST) || "api.contentstack.io";

const client = contentstack.client({
  host: managementHost,
  ...(managementToken ? { headers: { authorization: managementToken } } : {}),
  ...(userAuthToken ? { authtoken: userAuthToken } : {}),
  retryLimit: 0,
  timeout: 120000
});

async function getStack() {
  return client.stack({ api_key: stackApiKey });
}

async function getFirstAsset(stack) {
  const assets = await stack.asset().query().find();
  const list = assets.items || assets;
  if (!list || !list.length) {
    return null;
  }
  const asset = list[0];
  return { uid: asset.uid };
}

async function createEntry(contentType, entryData) {
  return contentType.entry().create({ entry: entryData });
}

async function publishEntry(entry, environment) {
  await entry.publish({
    publishDetails: {
      environments: [environment],
      locales: ["en-us"]
    }
  });
}

async function run() {
  const stack = await getStack();
  const asset = await getFirstAsset(stack);
  const assetRef = asset ? { uid: asset.uid } : undefined;

  const seatMapType = stack.contentType("seatmap");
  const seatMapEntry = await createEntry(seatMapType, {
    title: "Concert_Default",
    orientation: "stage_top",
    zones_json: JSON.stringify([
      { id: "vip", label: "VIP", distanceFactor: 0.2, basePrice: 240, rows: 4, cols: 8 },
      { id: "gold", label: "Gold", distanceFactor: 0.5, basePrice: 180, rows: 6, cols: 10 },
      { id: "silver", label: "Silver", distanceFactor: 0.9, basePrice: 120, rows: 8, cols: 12 }
    ])
  });
  await publishEntry(seatMapEntry, process.env.CS_ENVIRONMENT_NAME);

  const eventType = stack.contentType("event");
  const baseSeatMap = {
    id: seatMapEntry.uid,
    orientation: "stage_top",
    zones: [
      { id: "vip", label: "VIP", distanceFactor: 0.2, basePrice: 240, rows: 4, cols: 8 },
      { id: "gold", label: "Gold", distanceFactor: 0.5, basePrice: 180, rows: 6, cols: 10 },
      { id: "silver", label: "Silver", distanceFactor: 0.9, basePrice: 120, rows: 8, cols: 12 }
    ]
  };
  const eventSeeds = [
    {
      title: "RockWave Live 2026",
      slug: "rockwave-2026",
      type: "concert",
      city: "Austin",
      tags: ["rock", "live", "featured"],
      about:
        "RockWave Live 2026 brings arena-sized energy with a full-band experience, immersive lighting, and a setlist built for sing-alongs. Expect special guests, exclusive merch drops, and a finale that lights up the night.",
      promoted: true
    },
    {
      title: "Cinematica Premiere",
      slug: "cinematica-premiere",
      type: "movie",
      city: "Seattle",
      tags: ["cinema", "premiere"],
      about:
        "Cinematica Premiere is a red-carpet screening with cast Q&A, cinematic sound design, and collector passes. Arrive early for the pre-show lounge and limited-edition posters.",
      promoted: false
    },
    {
      title: "Stadium Rush Finals",
      slug: "stadium-rush-finals",
      type: "sports",
      city: "Chicago",
      tags: ["sports", "finals", "featured"],
      about:
        "Stadium Rush Finals delivers championship intensity with halftime performances, fan zones, and premium hospitality. Grab your seats now for the biggest rivalry match of the season.",
      promoted: true
    }
  ];
  const createdEvents = [];
  for (const seed of eventSeeds) {
    const entry = await createEntry(eventType, {
      title: seed.title,
      slug: seed.slug,
      type: seed.type,
      currency: "USD",
      schedule: {
        start_at: "2026-02-18T20:00:00Z",
        booking_opens_at: "2026-02-18T10:00:00Z"
      },
      venue: {
        name: "Aurora Dome",
        address: "12 Horizon Ave",
        city: seed.city,
        country: "USA",
        location: { lat: 30.2672, lng: -97.7431 }
      },
      about: seed.about,
      event_tags: seed.tags,
      is_promoted: seed.promoted,
      banner: undefined,
      gallery: undefined,
      seat_map_json: JSON.stringify(baseSeatMap),
      base_price: 240,
      price_curve: "decrease_with_distance",
      parking_available: true
    });
    await publishEntry(entry, process.env.CS_ENVIRONMENT_NAME);
    createdEvents.push(entry);
  }

  const bannerType = stack.contentType("banner");
  const bannerSeeds = [
    {
      title: "Concerts that feel cinematic",
      subtitle: "Book premium seats before they sell out",
      link: "/event/rockwave-2026"
    },
    {
      title: "Finals week hype",
      subtitle: "Stadium nights with premium views",
      link: "/event/stadium-rush-finals"
    },
    {
      title: "Premiere nights",
      subtitle: "New releases and fan-only Q&A",
      link: "/event/cinematica-premiere"
    }
  ];
  for (const banner of bannerSeeds) {
    const bannerEntry = await createEntry(bannerType, {
      ...banner,
      image: undefined
    });
    await publishEntry(bannerEntry, process.env.CS_ENVIRONMENT_NAME);
  }

  const tierType = stack.contentType("tier_rule");
  const tiers = [
    { key: "tier1", label: "Platinum Pulse", max_tickets: 25 },
    { key: "tier2", label: "Golden Groove", max_tickets: 14 },
    { key: "normal", label: "Rhythm Access", max_tickets: 9 }
  ];
  for (const tier of tiers) {
    const entry = await createEntry(tierType, tier);
    await publishEntry(entry, process.env.CS_ENVIRONMENT_NAME);
  }

  const configType = stack.contentType("global_config");
  const configEntry = await createEntry(configType, {
    geo_ip_endpoint: "https://ipapi.co/json/",
    payment_gateways: ["Card", "UPI", "NetBanking", "Wallet"],
    feature_flags: { parking: true, discounts: true, recommendations: true }
  });
  await publishEntry(configEntry, process.env.CS_ENVIRONMENT_NAME);

  const sectionType = stack.contentType("event_section");
  const sectionEntry = await createEntry(sectionType, {
    title: "Recommended for you",
    slug: "recommended",
    layout: "carousel",
    events: createdEvents.map((event) => ({ uid: event.uid }))
  });
  await publishEntry(sectionEntry, process.env.CS_ENVIRONMENT_NAME);

  console.log("Sample entries created and published.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

