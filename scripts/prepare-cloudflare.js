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

// 2. Neutralize require_require_hook in handler.mjs (eliminate node require-hook in workerd)
const handlerPath = path.join(openNextDir, "server-functions", "default", "handler.mjs");
if (fs.existsSync(handlerPath)) {
  let handlerCode = fs.readFileSync(handlerPath, "utf8");
  const startStr = "var require_require_hook=";
  const endStr = "var require_setup_node_env_external=";
  const start = handlerCode.indexOf(startStr);
  const end = handlerCode.indexOf(endStr);
  if (start !== -1 && end !== -1 && end > start) {
    const dummyHook = 'var require_require_hook=__commonJS({".open-next/server-functions/default/node_modules/next/dist/server/require-hook.js"(exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.addHookAliases=function(){};exports.defaultOverrides={};exports.hookPropertyMap=new Map();}});';
    handlerCode = handlerCode.slice(0, start) + dummyHook + handlerCode.slice(end);
    fs.writeFileSync(handlerPath, handlerCode, "utf8");
    console.log("✓ Neutralized require_require_hook in handler.mjs");
  } else {
    console.warn("⚠ require_require_hook bounds not found in handler.mjs");
  }
}

// 3. Overwrite require-hook.js on the filesystem with safe dummy no-op
const requireHookPath = path.join(openNextDir, "server-functions", "default", "node_modules", "next", "dist", "server", "require-hook.js");
if (fs.existsSync(requireHookPath)) {
  const dummyFile = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHookAliases = function() {};
exports.defaultOverrides = {};
exports.hookPropertyMap = new Map();
module.exports = {
  addHookAliases: function() {},
  defaultOverrides: {},
  hookPropertyMap: new Map()
};
`;
  fs.writeFileSync(requireHookPath, dummyFile, "utf8");
  console.log("✓ Overwrote require-hook.js with no-op for Cloudflare Pages");
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

