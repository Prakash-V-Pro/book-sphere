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
  const stack = await client.stack({ api_key: stackApiKey });
  const retryConfig = { retryLimit: 0, retryDelay: 0, timeout: 120000 };
  if (typeof stack.setConfig === "function") {
    stack.setConfig(retryConfig);
  } else if (stack.config && typeof stack.config === "object") {
    Object.assign(stack.config, retryConfig);
  }
  return stack;
}

async function getAssets(stack) {
  const assets = await stack.asset().query().find();
  return assets.items || assets || [];
}

async function updateAndPublish(entry, data, env) {
  const updated = await entry.update({ entry: data });
  await updated.publish({
    publishDetails: {
      environments: [env],
      locales: ["en-us"]
    }
  });
  return updated;
}

function pickAssets(assets, count) {
  if (!assets.length) return [];
  const shuffled = [...assets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((asset) => ({ uid: asset.uid }));
}

async function run() {
  const stack = await getStack();
  const assets = await getAssets(stack);

  if (!assets.length) {
    console.log("No assets found. Upload assets first.");
    return;
  }

  const bannerType = stack.contentType("banner");
  const eventType = stack.contentType("event");

  const bannerEntries = await bannerType.entry().query().find();
  const bannerList = bannerEntries.items || bannerEntries || [];
  for (const entry of bannerList) {
    const image = pickAssets(assets, 1)[0];
    if (!image) continue;
    await updateAndPublish(entry, { image }, process.env.CS_ENVIRONMENT_NAME);
    console.log(`Updated banner image: ${entry.uid}`);
  }

  const eventEntries = await eventType.entry().query().find();
  const eventList = eventEntries.items || eventEntries || [];
  for (const entry of eventList) {
    const [banner, ...gallery] = pickAssets(assets, 5);
    await updateAndPublish(
      entry,
      {
        banner,
        gallery: gallery.length ? gallery : undefined
      },
      process.env.CS_ENVIRONMENT_NAME
    );
    console.log(`Updated event assets: ${entry.uid}`);
  }

  console.log("Asset attachment complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

