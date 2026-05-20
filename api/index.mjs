import { fileURLToPath } from "node:url";
import path from "node:path";

let serverEntry;

async function getServerEntry() {
  if (!serverEntry) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    serverEntry = await import(path.join(__dirname, "..", "dist", "server", "index.js"));
  }
  return serverEntry;
}

function nodeHeadersToHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

function toWebRequest(req) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url, `https://${host}`);
  const headers = nodeHeadersToHeaders(req.headers);
  const body = req.method === "GET" || req.method === "HEAD" ? null : req;
  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });
}

export default async function handler(req, res) {
  try {
    const server = await getServerEntry();
    const response = await server.default.fetch(toWebRequest(req));

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}
