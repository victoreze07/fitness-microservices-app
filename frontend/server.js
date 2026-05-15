import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 3000);
const publicDir = fileURLToPath(new URL("./public/", import.meta.url));

const serviceRoutes = {
  "/api/workouts": process.env.WORKOUT_SERVICE_URL || "http://localhost:4001",
  "/api/nutrition": process.env.NUTRITION_SERVICE_URL || "http://localhost:4002",
  "/api/progress": process.env.PROGRESS_SERVICE_URL || "http://localhost:4003"
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function proxyRequest(req, res, route, targetBaseUrl) {
  const targetUrl = new URL(req.url.replace(route, ""), targetBaseUrl);
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { Accept: "application/json" }
  });

  const body = await response.text();
  res.writeHead(response.status, {
    "Content-Type": response.headers.get("content-type") || "application/json; charset=utf-8"
  });
  res.end(body);
}

async function serveStatic(req, res) {
  const requestedPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const pageRoutes = {
    "/": "/index.html",
    "/workouts": "/workouts.html",
    "/nutrition": "/nutrition.html",
    "/progress": "/progress.html"
  };
  const filePath = pageRoutes[requestedPath] || requestedPath;
  const safePath = normalize(filePath).replace(/^[/\\]+/, "").replace(/^(\.\.[/\\])+/, "");
  const absolutePath = join(publicDir, safePath);

  if (relative(publicDir, absolutePath).startsWith("..")) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  const data = await readFile(absolutePath);

  res.writeHead(200, {
    "Content-Type": contentTypes[extname(absolutePath)] || "application/octet-stream"
  });
  res.end(data);
}

const server = createServer(async (req, res) => {
  try {
    if (req.url === "/health") {
      sendJson(res, 200, { status: "ok", service: "frontend" });
      return;
    }

    const route = Object.keys(serviceRoutes).find((prefix) => req.url.startsWith(prefix));
    if (route) {
      await proxyRequest(req, res, route, serviceRoutes[route]);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    sendJson(res, 502, {
      error: "Service unavailable",
      detail: error.message
    });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`fitness frontend listening on ${port}`);
});
