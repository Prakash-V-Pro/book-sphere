const contentstack = require("@contentstack/management");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

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

function listAssets() {
  const assetsDir = path.join(__dirname, "assets");
  if (!fs.existsSync(assetsDir)) {
    return [];
  }
  return fs.readdirSync(assetsDir).filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file));
}

async function run() {
  const files = listAssets();
  if (!files.length) {
    console.log("No image files found in tools/contentstack-setup/assets.");
    console.log("Add a few .jpg/.png images and re-run.");
    return;
  }

  const stack = await getStack();
  const retryConfig = { retryLimit: 0, retryDelay: 0, timeout: 120000 };
  if (typeof stack.setConfig === "function") {
    stack.setConfig(retryConfig);
  } else if (stack.config && typeof stack.config === "object") {
    Object.assign(stack.config, retryConfig);
  }
  for (const fileName of files) {
    const filePath = path.join(__dirname, "assets", fileName);
    const upload = stack.asset();
    const asset = await upload.create(
      {
        asset: {
          upload: fs.createReadStream(filePath),
          filename: fileName
        }
      },
      retryConfig
    );
    console.log(`Uploaded asset: ${asset.uid} (${fileName})`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

