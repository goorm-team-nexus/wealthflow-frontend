import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OPENAPI_URL = "https://d3uib3r331utfe.cloudfront.net/v3/api-docs";
const SNAPSHOT_URL = new URL("../docs/api/openapi.json", import.meta.url);
const SNAPSHOT_PATH = fileURLToPath(SNAPSHOT_URL);

function sortJson(value) {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, nestedValue]) => [key, sortJson(nestedValue)]),
    );
  }

  return value;
}

function normalizeJson(value) {
  return `${JSON.stringify(sortJson(value), null, 2)}\n`;
}

function assertOpenApiDocument(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("OpenAPI response is not a JSON object.");
  }

  if (typeof value.openapi !== "string") {
    throw new Error("OpenAPI response does not include an openapi version.");
  }

  if (value.paths === null || typeof value.paths !== "object") {
    throw new Error("OpenAPI response does not include paths.");
  }
}

async function fetchOpenApi() {
  const response = await fetch(OPENAPI_URL, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI document: ${response.status} ${response.statusText}`);
  }

  const document = await response.json();
  assertOpenApiDocument(document);
  return document;
}

async function readSnapshot() {
  const content = await readFile(SNAPSHOT_PATH, "utf8");
  const document = JSON.parse(content);
  assertOpenApiDocument(document);
  return document;
}

async function updateSnapshot() {
  const remoteDocument = await fetchOpenApi();
  await writeFile(SNAPSHOT_PATH, normalizeJson(remoteDocument), "utf8");
  console.log(`Updated ${SNAPSHOT_PATH} from ${OPENAPI_URL}`);
}

async function checkSnapshot() {
  const [remoteDocument, snapshotDocument] = await Promise.all([fetchOpenApi(), readSnapshot()]);
  const remoteContent = normalizeJson(remoteDocument);
  const snapshotContent = normalizeJson(snapshotDocument);

  if (remoteContent !== snapshotContent) {
    console.error(
      "OpenAPI snapshot is out of date. Run `npm run openapi:update` and review the diff.",
    );
    process.exitCode = 1;
    return;
  }

  console.log("OpenAPI snapshot is up to date.");
}

const command = process.argv[2];

try {
  if (command === "update") {
    await updateSnapshot();
  } else if (command === "check") {
    await checkSnapshot();
  } else {
    console.error("Usage: node scripts/sync-openapi.mjs <update|check>");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
