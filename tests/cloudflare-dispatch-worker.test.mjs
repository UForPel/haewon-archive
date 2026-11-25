import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto, generateKeyPairSync } from "node:crypto";
import { createAppJwt, dispatchDryRun, pemToPkcs8Bytes } from "../cloudflare/dispatch-worker.mjs";

async function makeKeys() {
  const pair = await webcrypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: Uint8Array.of(1, 0, 1), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const pkcs8 = new Uint8Array(await webcrypto.subtle.exportKey("pkcs8", pair.privateKey));
  const pem = "-----BEGIN PRIVATE KEY-----\n" + Buffer.from(pkcs8).toString("base64").match(/.{1,64}/g).join("\n") + "\n-----END PRIVATE KEY-----";
  return { pair, pem };
}

const envFor = privateKey => ({
  GITHUB_APP_ID: "123456",
  GITHUB_INSTALLATION_ID: "987654",
  GITHUB_APP_PRIVATE_KEY: privateKey
});

test("PKCS#8 PEM is decoded and JWT signature verifies", async () => {
  const { pair, pem } = await makeKeys();
  const nowMs = 1_800_000_000_000;
  const jwt = await createAppJwt({ appId: "123456", privateKeyPem: pem, nowMs, cryptoImpl: webcrypto });
  const [headerPart, payloadPart, signaturePart] = jwt.split(".");
  const decode = part => JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  assert.deepEqual(decode(headerPart), { alg: "RS256", typ: "JWT" });
  assert.deepEqual(decode(payloadPart), { iat: nowMs / 1000 - 60, exp: nowMs / 1000 + 540, iss: "123456" });
  const publicKey = await webcrypto.subtle.exportKey("spki", pair.publicKey);
  const imported = await webcrypto.subtle.importKey("spki", publicKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signature = Buffer.from(signaturePart.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  assert.equal(await webcrypto.subtle.verify("RSASSA-PKCS1-v1_5", imported, signature, new TextEncoder().encode(headerPart + "." + payloadPart)), true);
});

test("PKCS#1 PEM is converted to a valid PKCS#8 key and signs a verifiable JWT", async () => {
  const pair = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicExponent: 0x10001,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" }
  });
  const jwt = await createAppJwt({
    appId: "123456",
    privateKeyPem: pair.privateKey,
    nowMs: 1_800_000_000_000,
    cryptoImpl: webcrypto
  });
  const [headerPart, payloadPart, signaturePart] = jwt.split(".");
  const publicDer = Buffer.from(pair.publicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, ""), "base64");
  const publicKey = await webcrypto.subtle.importKey("spki", publicDer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signature = Buffer.from(signaturePart.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  assert.equal(await webcrypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signature, new TextEncoder().encode(headerPart + "." + payloadPart)), true);
  assert.ok(pemToPkcs8Bytes(pair.privateKey).length > 0);
});

test("dispatch scopes the installation token to this repository and Actions write only", async () => {
  const { pem } = await makeKeys();
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (calls.length === 1) return new Response(JSON.stringify({ token: "installation-token" }), { status: 201 });
    return new Response(JSON.stringify({ workflow_run_id: 42 }), { status: 200 });
  };
  const result = await dispatchDryRun({
    env: envFor(pem),
    scheduledTime: Date.parse("2026-11-25T11:17:00Z"),
    cron: "17 11,23 * * *",
    fetchImpl,
    cryptoImpl: webcrypto
  });
  assert.equal(calls.length, 2);
  const tokenRequest = JSON.parse(calls[0].init.body);
  assert.deepEqual(tokenRequest.repositories, ["haewon-archive"]);
  assert.deepEqual(tokenRequest.permissions, { actions: "write" });
  assert.match(calls[0].init.headers.Authorization, /^Bearer /);
  assert.equal(calls[1].url, "https://api.github.com/repos/UForPel/haewon-archive/actions/workflows/cloudflare-dispatch-dry-run.yml/dispatches");
  assert.equal(calls[1].init.headers.Authorization, "Bearer installation-token");
  assert.deepEqual(JSON.parse(calls[1].init.body), {
    ref: "main",
    inputs: { mode: "dry-run", scheduled_at: "2026-11-25T11:17:00.000Z", cron: "17 11,23 * * *" }
  });
  assert.deepEqual(result, {
    status: "dispatched-dry-run",
    repository: "UForPel/haewon-archive",
    workflow: "cloudflare-dispatch-dry-run.yml",
    scheduledAt: "2026-11-25T11:17:00.000Z",
    workflowRunId: 42
  });
});

test("missing credentials fail before making a network request", async () => {
  let called = false;
  await assert.rejects(
    dispatchDryRun({ env: {}, fetchImpl: async () => { called = true; } }),
    /Missing required Worker secret/
  );
  assert.equal(called, false);
});

test("failed token exchange does not dispatch a workflow", async () => {
  const { pem } = await makeKeys();
  let calls = 0;
  await assert.rejects(
    dispatchDryRun({ env: envFor(pem), fetchImpl: async () => { calls++; return new Response("denied", { status: 403 }); }, cryptoImpl: webcrypto }),
    /token exchange failed \(HTTP 403\)/
  );
  assert.equal(calls, 1);
});
