const OWNER = "UForPel";
const REPOSITORY = "haewon-archive";
const WORKFLOW_FILE = "cloudflare-dispatch-dry-run.yml";
const API_VERSION = "2026-03-10";
const API_ROOT = "https://api.github.com";

function concatBytes(...parts) {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function derLength(length) {
  if (length < 128) return Uint8Array.of(length);
  const bytes = [];
  for (let value = length; value > 0; value = Math.floor(value / 256)) bytes.unshift(value & 255);
  return Uint8Array.of(0x80 | bytes.length, ...bytes);
}

function der(tag, value) {
  return concatBytes(Uint8Array.of(tag), derLength(value.length), value);
}

export function pemToPkcs8Bytes(pem) {
  const match = String(pem || "").trim().match(/^-----BEGIN (PRIVATE KEY|RSA PRIVATE KEY)-----([\s\S]+?)-----END \1-----$/);
  if (!match) throw new Error("GitHub App private key must be a PKCS#8 or RSA PKCS#1 PEM.");
  const binary = atob(match[2].replace(/\s/g, ""));
  const raw = Uint8Array.from(binary, character => character.charCodeAt(0));
  if (match[1] === "PRIVATE KEY") return raw;

  // GitHub App downloads commonly use PKCS#1; WebCrypto imports PKCS#8.
  const version = Uint8Array.of(0x02, 0x01, 0x00);
  const rsaEncryption = Uint8Array.of(0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00);
  return der(0x30, concatBytes(version, rsaEncryption, der(0x04, raw)));
}

function base64Url(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function createAppJwt({ appId, privateKeyPem, nowMs = Date.now(), cryptoImpl = crypto }) {
  if (!String(appId || "").trim() || !String(privateKeyPem || "").trim()) {
    throw new Error("GitHub App credentials are not configured.");
  }
  const now = Math.floor(nowMs / 1000);
  const header = base64Url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({
    iat: now - 60,
    exp: now + 540,
    iss: String(appId)
  })));
  const signingInput = header + "." + payload;
  const key = await cryptoImpl.subtle.importKey(
    "pkcs8",
    pemToPkcs8Bytes(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await cryptoImpl.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );
  return signingInput + "." + base64Url(new Uint8Array(signature));
}

function requireConfig(env) {
  for (const key of ["GITHUB_APP_ID", "GITHUB_INSTALLATION_ID", "GITHUB_APP_PRIVATE_KEY"]) {
    if (!String(env?.[key] || "").trim()) throw new Error("Missing required Worker secret: " + key);
  }
  if (!/^\d+$/.test(String(env.GITHUB_APP_ID)) || !/^\d+$/.test(String(env.GITHUB_INSTALLATION_ID))) {
    throw new Error("GitHub App and installation IDs must be numeric.");
  }
}

export async function dispatchDryRun({
  env,
  scheduledTime = Date.now(),
  cron = "manual-test",
  fetchImpl = fetch,
  cryptoImpl = crypto
}) {
  requireConfig(env);
  const scheduledAt = new Date(Number(scheduledTime)).toISOString();
  const jwt = await createAppJwt({
    appId: env.GITHUB_APP_ID,
    privateKeyPem: env.GITHUB_APP_PRIVATE_KEY,
    nowMs: Date.now(),
    cryptoImpl
  });

  const commonHeaders = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "Content-Type": "application/json"
  };
  const tokenResponse = await fetchImpl(
    API_ROOT + "/app/installations/" + encodeURIComponent(env.GITHUB_INSTALLATION_ID) + "/access_tokens",
    {
      method: "POST",
      headers: { ...commonHeaders, Authorization: "Bearer " + jwt },
      body: JSON.stringify({
        repositories: [REPOSITORY],
        permissions: { actions: "write" }
      })
    }
  );
  if (!tokenResponse.ok) throw new Error("GitHub App token exchange failed (HTTP " + tokenResponse.status + ").");
  const tokenPayload = await tokenResponse.json();
  if (!tokenPayload?.token) throw new Error("GitHub App token exchange returned no installation token.");

  const dispatchResponse = await fetchImpl(
    API_ROOT + "/repos/" + OWNER + "/" + REPOSITORY + "/actions/workflows/" + WORKFLOW_FILE + "/dispatches",
    {
      method: "POST",
      headers: { ...commonHeaders, Authorization: "Bearer " + tokenPayload.token },
      body: JSON.stringify({
        ref: "main",
        inputs: { mode: "dry-run", scheduled_at: scheduledAt, cron: String(cron).slice(0, 80) }
      })
    }
  );
  if (!dispatchResponse.ok) throw new Error("Dry-run workflow dispatch failed (HTTP " + dispatchResponse.status + ").");
  const responsePayload = await dispatchResponse.json().catch(() => ({}));
  return {
    status: "dispatched-dry-run",
    repository: OWNER + "/" + REPOSITORY,
    workflow: WORKFLOW_FILE,
    scheduledAt,
    workflowRunId: responsePayload.workflow_run_id || null
  };
}

export default {
  async scheduled(event, env) {
    const result = await dispatchDryRun({
      env,
      scheduledTime: event.scheduledTime,
      cron: event.cron
    });
    console.log(JSON.stringify(result));
  }
};
