import http from "node:http";
import https from "node:https";
import { lookup as dnsLookup } from "node:dns";
import type { LookupAddress, LookupOptions } from "node:dns";
import { BlockList, isIP } from "node:net";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_RESPONSE_BYTES = 512_000;
const MAX_REDIRECTS = 3;

const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google.com",
  "kubernetes.default",
  "kubernetes.default.svc",
  "kubernetes.default.svc.cluster.local",
]);

const BLOCKED_HOST_SUFFIXES = [".local", ".internal", ".localhost", ".lan"];

const blockedAddresses = new BlockList();
blockedAddresses.addSubnet("0.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("10.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("100.64.0.0", 10, "ipv4");
blockedAddresses.addSubnet("127.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("169.254.0.0", 16, "ipv4");
blockedAddresses.addSubnet("172.16.0.0", 12, "ipv4");
blockedAddresses.addSubnet("192.0.0.0", 24, "ipv4");
blockedAddresses.addSubnet("192.0.2.0", 24, "ipv4");
blockedAddresses.addSubnet("192.168.0.0", 16, "ipv4");
blockedAddresses.addSubnet("198.18.0.0", 15, "ipv4");
blockedAddresses.addSubnet("198.51.100.0", 24, "ipv4");
blockedAddresses.addSubnet("203.0.113.0", 24, "ipv4");
blockedAddresses.addSubnet("224.0.0.0", 4, "ipv4");
blockedAddresses.addSubnet("240.0.0.0", 4, "ipv4");
blockedAddresses.addAddress("::", "ipv6");
blockedAddresses.addAddress("::1", "ipv6");
blockedAddresses.addSubnet("100::", 64, "ipv6");
blockedAddresses.addSubnet("2001:db8::", 32, "ipv6");
blockedAddresses.addSubnet("fc00::", 7, "ipv6");
blockedAddresses.addSubnet("fe80::", 10, "ipv6");
blockedAddresses.addSubnet("ff00::", 8, "ipv6");

function hostnameOf(url: URL) {
  return url.hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
}

function isBlockedAddress(address: string) {
  const version = isIP(address);
  if (version === 4) return blockedAddresses.check(address, "ipv4");
  if (version === 6) return blockedAddresses.check(address, "ipv6");
  return true;
}

function headerValue(value: string | string[] | undefined) {
  if (!value) return "";
  return Array.isArray(value) ? value[0] ?? "" : value;
}

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | LookupAddress[],
  family?: number,
) => void;

function failClosedLookup(hostname: string, options: LookupOptions | LookupCallback, callback?: LookupCallback) {
  const cb = typeof options === "function" ? options : callback;
  const opts = typeof options === "function" ? {} : options;
  if (!cb) return;

  dnsLookup(hostname, { all: true, verbatim: true }, (error, addresses) => {
    if (error) {
      cb(error, "", 4);
      return;
    }
    if (!addresses.length || addresses.some((item) => isBlockedAddress(item.address))) {
      const blocked = new Error("PRIVATE_URL") as NodeJS.ErrnoException;
      blocked.code = "PRIVATE_URL";
      cb(blocked, "", 4);
      return;
    }
    if (opts.all) {
      cb(null, addresses);
      return;
    }
    const chosen = addresses[0]!;
    cb(null, chosen.address, chosen.family);
  });
}

export async function assertPublicHttpUrl(raw: string, base?: string) {
  let url: URL;
  try {
    url = base ? new URL(raw, base) : new URL(raw);
  } catch {
    throw new Error("INVALID_URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("INVALID_URL");
  }
  if (url.username || url.password) {
    throw new Error("INVALID_URL");
  }

  const hostname = hostnameOf(url);
  if (!hostname) throw new Error("INVALID_URL");
  if (BLOCKED_HOSTS.has(hostname) || BLOCKED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    throw new Error("PRIVATE_URL");
  }

  await new Promise<void>((resolve, reject) => {
    failClosedLookup(hostname, {}, (error) => {
      if (error?.code === "PRIVATE_URL" || error?.message === "PRIVATE_URL") {
        reject(new Error("PRIVATE_URL"));
        return;
      }
      if (error) {
        reject(new Error("FETCH_FAILED"));
        return;
      }
      resolve();
    });
  });

  return url;
}

type HopResponse = {
  status: number;
  location: string;
  contentType: string;
  body: string;
};

function requestHop(url: URL, signal: AbortSignal) {
  const client = url.protocol === "https:" ? https : http;

  return new Promise<HopResponse>((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "GET",
        agent: false,
        signal,
        lookup: failClosedLookup as typeof dnsLookup,
        headers: {
          Accept: "text/html,application/xhtml+xml,text/plain",
          "User-Agent": "GrokBotDirectory/0.1 (+https://github.com/kwakseongjae/awesome-grok-bot)",
          Connection: "close",
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const location = headerValue(response.headers.location);
        const contentType = headerValue(response.headers["content-type"]);

        if (REDIRECT_STATUS.has(status)) {
          response.resume();
          resolve({ status, location, contentType, body: "" });
          return;
        }

        const declared = Number(response.headers["content-length"]);
        if (Number.isFinite(declared) && declared > MAX_RESPONSE_BYTES) {
          req.destroy();
          response.destroy();
          reject(new Error("FETCH_FAILED"));
          return;
        }

        const chunks: Buffer[] = [];
        let received = 0;
        response.on("data", (chunk: Buffer) => {
          received += chunk.length;
          if (received > MAX_RESPONSE_BYTES) {
            const overflow = received - MAX_RESPONSE_BYTES;
            chunks.push(chunk.subarray(0, Math.max(0, chunk.length - overflow)));
            response.destroy();
            return;
          }
          chunks.push(chunk);
        });
        response.on("end", () => {
          resolve({
            status,
            location,
            contentType,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
        response.on("error", () => reject(new Error("FETCH_FAILED")));
      },
    );

    req.on("error", (error) => {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "PRIVATE_URL" || error.message === "PRIVATE_URL") {
        reject(new Error("PRIVATE_URL"));
        return;
      }
      reject(new Error("FETCH_FAILED"));
    });
    req.end();
  });
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function extractPublicPage(rawUrl: string) {
  let url = await assertPublicHttpUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      const response = await requestHop(url, controller.signal);

      if (REDIRECT_STATUS.has(response.status)) {
        if (hop === MAX_REDIRECTS || !response.location) throw new Error("FETCH_FAILED");
        url = await assertPublicHttpUrl(response.location, url.toString());
        continue;
      }

      if (response.status < 200 || response.status >= 300) throw new Error("FETCH_FAILED");

      const contentType = response.contentType;
      if (contentType && !contentType.includes("html") && !contentType.includes("text/plain")) {
        throw new Error("UNSUPPORTED_TYPE");
      }

      const html = response.body;
      const titleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = decodeEntities(stripTags(titleMatch?.[1] || "").trim()).slice(0, 200);
      const text = stripTags(html).replace(/\s+/g, " ").trim().slice(0, 4000);

      return {
        url: url.toString(),
        title: title || hostnameOf(url),
        text,
      };
    }

    throw new Error("FETCH_FAILED");
  } finally {
    clearTimeout(timer);
  }
}
