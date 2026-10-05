const fs = require("fs");
const path = require("path");

const openNextDir = path.join(process.cwd(), ".open-next");
const workerSrc = path.join(openNextDir, "worker.js");
const workerDest = path.join(openNextDir, "_worker.js");
const assetsDir = path.join(openNextDir, "assets");
const routesDest = path.join(openNextDir, "_routes.json");

// 1. Copy worker.js to _worker.js in .open-next and wrap with error logging
if (fs.existsSync(workerSrc)) {
  let content = fs.readFileSync(workerSrc, "utf8");

  // Inject node:module polyfill at top of _worker.js
  const topPolyfill = `
import * as _cf_mod from "node:module";
if (!_cf_mod.prototype) {
  try { _cf_mod.prototype = {}; } catch (_) {}
}
if (_cf_mod.prototype && !_cf_mod.prototype.require) {
  _cf_mod.prototype.require = function(r) { return typeof require === "function" ? require(r) : {}; };
}
`;

  const debugWrapper = `
const defaultWorker = {
`;
  content = topPolyfill + content.replace("export default {", debugWrapper);

  const errorInterceptor = `
export default {
  async fetch(request, env, ctx) {
    const errorLogs = [];
    const origErr = console.error;
    const origWarn = console.warn;
    console.error = (...args) => {
      errorLogs.push("[ERROR] " + args.map(a => (a && a.stack) ? a.stack : (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      origErr(...args);
    };
    console.warn = (...args) => {
      errorLogs.push("[WARN] " + args.map(a => (a && a.stack) ? a.stack : (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      origWarn(...args);
    };
    try {
      const res = await defaultWorker.fetch(request, env, ctx);
      if (res.status >= 500) {
        return new Response("=== CLOUDFLARE PAGES 500 ERROR DETAILS ===\\n\\n" + (errorLogs.join("\\n\\n") || "No console.error captured from Next.js server function. Response status: " + res.status), {
          status: res.status,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      return res;
    } catch (fatal) {
      return new Response("=== CLOUDFLARE PAGES UNCAUGHT EXCEPTION ===\\n" + (fatal?.stack || fatal?.message || String(fatal)) + "\\n\\n=== LOGS ===\\n" + errorLogs.join("\\n\\n"), {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    } finally {
      console.error = origErr;
      console.warn = origWarn;
    }
  }
};
`;

  content += errorInterceptor;
  fs.writeFileSync(workerDest, content, "utf8");
  console.log("✓ Created .open-next/_worker.js with error logging wrapper");
} else {
  console.warn("⚠ .open-next/worker.js not found!");
}

// 2. Patch handler.mjs to prevent "Cannot read properties of undefined (reading 'require')" on Cloudflare Pages
const handlerPath = path.join(openNextDir, "server-functions", "default", "handler.mjs");
if (fs.existsSync(handlerPath)) {
  let handlerCode = fs.readFileSync(handlerPath, "utf8");
  const targetPattern = 'mod3=require("module"),originalRequire=mod3.prototype.require,resolveFilename3=mod3._resolveFilename';
  const replacement = 'mod3=require("module"),_dummy=(mod3.prototype=mod3.prototype||{}),originalRequire=(mod3.prototype.require=mod3.prototype.require||function(r){return typeof require==="function"?require(r):{}}),resolveFilename3=(mod3._resolveFilename=mod3._resolveFilename||function(r){return r})';
  if (handlerCode.includes(targetPattern)) {
    handlerCode = handlerCode.replace(targetPattern, replacement);
    fs.writeFileSync(handlerPath, handlerCode, "utf8");
    console.log("✓ Patched handler.mjs module.prototype for Cloudflare Pages");
  } else {
    console.warn("⚠ Target pattern in handler.mjs not found, skipping patch");
  }
}

// 3. Patch require-hook.js in server-functions node_modules if present
const requireHookPath = path.join(openNextDir, "server-functions", "default", "node_modules", "next", "dist", "server", "require-hook.js");
if (fs.existsSync(requireHookPath)) {
  let hookCode = fs.readFileSync(requireHookPath, "utf8");
  if (hookCode.includes("const originalRequire = mod.prototype.require;")) {
    hookCode = hookCode.replace(
      "const originalRequire = mod.prototype.require;",
      "if (!mod.prototype) mod.prototype = {};\nconst originalRequire = mod.prototype.require || function(r){ return typeof require === 'function' ? require(r) : {}; };"
    );
    fs.writeFileSync(requireHookPath, hookCode, "utf8");
    console.log("✓ Patched require-hook.js for Cloudflare Pages");
  }
}

// 4. Copy static assets from .open-next/assets to .open-next root so Cloudflare Pages serves them
if (fs.existsSync(assetsDir)) {
  const items = fs.readdirSync(assetsDir);
  for (const item of items) {
    if (item === "_worker.js") continue;
    const srcPath = path.join(assetsDir, item);
    const destPath = path.join(openNextDir, item);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
  console.log("✓ Synced static assets from .open-next/assets to .open-next root");
}

// 5. Generate _routes.json to route dynamic paths to _worker.js and static files to CDN
const routes = {
  version: 1,
  include: ["/*"],
  exclude: ["/_next/static/*", "/logo*.png", "/favicon.ico", "/robots.txt"],
};

fs.writeFileSync(routesDest, JSON.stringify(routes, null, 2));
console.log("✓ Generated .open-next/_routes.json");

