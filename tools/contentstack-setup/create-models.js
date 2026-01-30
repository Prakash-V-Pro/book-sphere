const contentstack = require("@contentstack/management");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/.env` });
dotenv.config({ path: `${__dirname}/env` });
dotenv.config();

const requiredEnv = ["CS_MANAGEMENT_TOKEN", "CS_STACK_API_KEY"];
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

async function ensureContentType(stack, definition) {
  try {
    const existing = await stack.contentType(definition.uid).fetch();
    return existing;
  } catch {
    const created = await stack.contentType().create({ content_type: definition });
    return created;
  }
}

function buildContentTypes() {
  return [
    {
      title: "GlobalConfig",
      uid: "global_config",
      schema: [
        { display_name: "Geo IP Endpoint", uid: "geo_ip_endpoint", data_type: "text", mandatory: true, unique: false },
        {
          display_name: "Payment Gateways",
          uid: "payment_gateways",
          data_type: "text",
          multiple: true
        },
        {
          display_name: "Feature Flags",
          uid: "feature_flags",
          data_type: "group",
          schema: [
            { display_name: "Parking", uid: "parking", data_type: "boolean" },
            { display_name: "Discounts", uid: "discounts", data_type: "boolean" },
            { display_name: "Recommendations", uid: "recommendations", data_type: "boolean" }
          ]
        }
      ]
    },
    {
      title: "SeatMap",
      uid: "seatmap",
      schema: [
        { display_name: "Title", uid: "title", data_type: "text", mandatory: true, unique: false },
        {
          display_name: "Orientation",
          uid: "orientation",
          data_type: "text",
          field_metadata: { description: "stage_top or screen_top" }
        },
        { display_name: "Zones JSON", uid: "zones_json", data_type: "text" }
      ]
    },
    {
      title: "Event",
      uid: "event",
      schema: [
        { display_name: "Title", uid: "title", data_type: "text", mandatory: true, unique: false },
        { display_name: "Slug", uid: "slug", data_type: "text", mandatory: true, unique: true },
        {
          display_name: "Type",
          uid: "type",
          data_type: "text",
          field_metadata: { description: "concert, movie, sports, theater, other" }
        },
        { display_name: "Currency", uid: "currency", data_type: "text" },
        {
          display_name: "Schedule",
          uid: "schedule",
          data_type: "group",
          schema: [
            { display_name: "Start At", uid: "start_at", data_type: "text" },
            { display_name: "Booking Opens At", uid: "booking_opens_at", data_type: "text" },
            { display_name: "Booking Closes At", uid: "booking_closes_at", data_type: "text" }
          ]
        },
        {
          display_name: "Venue",
          uid: "venue",
          data_type: "group",
          schema: [
            { display_name: "Name", uid: "name", data_type: "text" },
            { display_name: "Address", uid: "address", data_type: "text" },
            { display_name: "City", uid: "city", data_type: "text" },
            { display_name: "Country", uid: "country", data_type: "text" },
            {
              display_name: "Location",
              uid: "location",
              data_type: "group",
              schema: [
                { display_name: "Lat", uid: "lat", data_type: "number" },
                { display_name: "Lng", uid: "lng", data_type: "number" }
              ]
            }
          ]
        },
        {
          display_name: "About",
          uid: "about",
          data_type: "text",
          field_metadata: { multiline: true }
        },
        {
          display_name: "Tags",
          uid: "event_tags",
          data_type: "text",
          multiple: true
        },
        { display_name: "Is Promoted", uid: "is_promoted", data_type: "boolean" },
        { display_name: "Banner", uid: "banner", data_type: "file" },
        {
          display_name: "Gallery",
          uid: "gallery",
          data_type: "file",
          multiple: true
        },
        {
          display_name: "Seat Map JSON",
          uid: "seat_map_json",
          data_type: "text"
        },
        { display_name: "Base Price", uid: "base_price", data_type: "number" },
        {
          display_name: "Price Curve",
          uid: "price_curve",
          data_type: "text",
          field_metadata: { description: "decrease_with_distance or increase_with_distance" }
        },
        { display_name: "Parking Available", uid: "parking_available", data_type: "boolean" }
      ]
    },
    {
      title: "Banner",
      uid: "banner",
      schema: [
        { display_name: "Title", uid: "title", data_type: "text", mandatory: true },
        { display_name: "Subtitle", uid: "subtitle", data_type: "text" },
        { display_name: "Image", uid: "image", data_type: "file" },
        { display_name: "Link", uid: "link", data_type: "text" }
      ]
    },
    {
      title: "Promotion",
      uid: "promotion",
      schema: [
        { display_name: "Title", uid: "title", data_type: "text" },
        { display_name: "Badge Text", uid: "badge_text", data_type: "text" },
        { display_name: "Event", uid: "event", data_type: "reference", reference_to: ["event"] }
      ]
    },
    {
      title: "RecommendationRule",
      uid: "recommendation_rule",
      schema: [
        {
          display_name: "Interest Tags",
          uid: "interest_tags",
          data_type: "text",
          multiple: true
        },
        {
          display_name: "Event Tags",
          uid: "event_tags",
          data_type: "text",
          multiple: true
        }
      ]
    },
    {
      title: "TierRule",
      uid: "tier_rule",
      schema: [
        { display_name: "Key", uid: "key", data_type: "text" },
        { display_name: "Label", uid: "label", data_type: "text" },
        { display_name: "Max Tickets", uid: "max_tickets", data_type: "number" }
      ]
    },
    {
      title: "NotificationTemplate",
      uid: "notification_template",
      schema: [
        { display_name: "Channel", uid: "channel", data_type: "text" },
        { display_name: "Subject", uid: "subject", data_type: "text" },
        { display_name: "Body", uid: "body", data_type: "text" }
      ]
    },
    {
      title: "EventSection",
      uid: "event_section",
      schema: [
        { display_name: "Title", uid: "title", data_type: "text", mandatory: true },
        { display_name: "Slug", uid: "slug", data_type: "text", mandatory: true, unique: true },
        {
          display_name: "Events",
          uid: "events",
          data_type: "reference",
          reference_to: ["event"],
          multiple: true
        },
        { display_name: "Layout", uid: "layout", data_type: "text" }
      ]
    }
  ];
}

async function run() {
  const stack = await getStack();
  const types = buildContentTypes();
  for (const type of types) {
    const result = await ensureContentType(stack, type);
    console.log(`Content type ready: ${result.uid}`);
  }
  console.log("All content types are ready.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

