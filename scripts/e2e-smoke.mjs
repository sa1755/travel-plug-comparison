import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = Number(process.env.TRAVELPLUG_E2E_PORT ?? 3210);
const origin = `http://${host}:${port}`;
let serverOutput = "";

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", host, "--port", String(port)],
  { env: { ...process.env, NODE_ENV: "production" }, stdio: ["ignore", "pipe", "pipe"] },
);

server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`TravelPlug did not start.\n${serverOutput}`);
};

const expectRoute = async ({ path, status = 200, includes, contentType }) => {
  const response = await fetch(`${origin}${path}`);
  const body = await response.text();
  const searchableBody = body.replace(/<!--.*?-->/gs, "");
  if (response.status !== status) {
    throw new Error(`${path}: expected ${status}, received ${response.status}`);
  }
  if (contentType && !response.headers.get("content-type")?.includes(contentType)) {
    throw new Error(`${path}: expected content type ${contentType}`);
  }
  for (const text of includes ?? []) {
    if (!searchableBody.includes(text)) {
      throw new Error(`${path}: missing ${JSON.stringify(text)}`);
    }
  }
  return body;
};

const stopServer = async () => {
  if (server.exitCode !== null) return;
  await new Promise((resolve) => {
    const forceStop = setTimeout(() => server.kill("SIGKILL"), 2_000);
    server.once("exit", () => {
      clearTimeout(forceStop);
      resolve();
    });
    server.kill("SIGTERM");
  });
};

try {
  await waitForServer();
  await expectRoute({ path: "/", includes: ["Does your charger work abroad? Check before you fly.", 'rel="canonical"', "GitHub"] });
  await expectRoute({ path: "/country/japan", includes: ["Power sockets in Japan", "/country/japan"] });
  await expectRoute({ path: "/plug/type-g", includes: ["Type G", "/plug/type-g"] });
  await expectRoute({ path: "/compare/united-kingdom/japan", includes: ["A voltage converter may be required", "Smartwatch", "/compare/united-kingdom/japan"] });
  await expectRoute({ path: "/device-checker", includes: ["Will your device work when you travel", "/device-checker"] });
  await expectRoute({ path: "/about", includes: ["Travel power guidance without the electrical jargon", "View TravelPlug on GitHub"] });
  await expectRoute({ path: "/privacy", includes: ["Simple analytics, minimal data", "Do Not Track"] });
  const sitemap = await expectRoute({ path: "/sitemap.xml", contentType: "application/xml" });
  const urlCount = (sitemap.match(/<url>/g) ?? []).length;
  if (urlCount !== 265) throw new Error(`/sitemap.xml: expected 265 URLs, received ${urlCount}`);
  await expectRoute({ path: "/robots.txt", includes: ["Sitemap:"] });
  await expectRoute({ path: "/manifest.webmanifest", includes: ["TravelPlug"] });
  await expectRoute({ path: "/opengraph-image", contentType: "image/png" });
  await expectRoute({ path: "/country/atlantis", status: 404, includes: ["Guide not found"] });
  console.log("HTTP smoke tests passed (12 routes, 265 sitemap URLs). ");
} finally {
  await stopServer();
}
