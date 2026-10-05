const fs = require("fs");
const path = require("path");

const openNextDir = path.join(process.cwd(), ".open-next");
const workerSrc = path.join(openNextDir, "worker.js");
const workerDest = path.join(openNextDir, "_worker.js");
const assetsDir = path.join(openNextDir, "assets");
const routesDest = path.join(openNextDir, "_routes.json");

// Helper to recursively walk and patch
function walkAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndPatch(fullPath);
    } else {
      if (entry.name === "require-hook.js") {
        const dummyHook = `"use strict";
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
        fs.writeFileSync(fullPath, dummyHook, "utf8");
        console.log("✓ Patched require-hook in .open-next:", fullPath);
      } else if (entry.name === "setup-node-env.external.js") {
        const dummyEnv = `"use strict";
module.exports = {};
`;
        fs.writeFileSync(fullPath, dummyEnv, "utf8");
        console.log("✓ Patched setup-node-env in .open-next:", fullPath);
      }
    }
  }
}

// 1. Walk and patch any remaining require-hook in .open-next
walkAndPatch(openNextDir);

// 2. Patch handler.mjs
const handlerPath = path.join(openNextDir, "server-functions", "default", "handler.mjs");
if (fs.existsSync(handlerPath)) {
  let handlerCode = fs.readFileSync(handlerPath, "utf8");

  // Neutralize require_require_hook
  const hookPattern = /var require_require_hook\s*=\s*__commonJS\([^)]+\)\);/g;
  if (hookPattern.test(handlerCode)) {
    handlerCode = handlerCode.replace(hookPattern, 'var require_require_hook=()=>({addHookAliases(){},defaultOverrides:{},hookPropertyMap:new Map()});');
    console.log("✓ Neutralized require_require_hook in handler.mjs");
  }

  // Neutralize require_setup_node_env_external
  const setupEnvPattern = /var require_setup_node_env_external\s*=\s*__commonJS\([^)]+\)\);/g;
  if (setupEnvPattern.test(handlerCode)) {
    handlerCode = handlerCode.replace(setupEnvPattern, 'var require_setup_node_env_external=()=>{};');
    console.log("✓ Neutralized require_setup_node_env_external in handler.mjs");
  }

  // Add robust fallback for ComponentMod.handler in Next.js 16
  const safeCall = `const _h=(components.ComponentMod&&typeof components.ComponentMod.handler==="function"?components.ComponentMod.handler.bind(components.ComponentMod):null)||(components.routeModule&&typeof components.routeModule.handle==="function"?(q,s,x)=>components.routeModule.handle(q,s,x):null)||(components.ComponentMod&&components.ComponentMod.routeModule&&typeof components.ComponentMod.routeModule.handle==="function"?(q,s,x)=>components.ComponentMod.routeModule.handle(q,s,x):null)||(components.ComponentMod&&typeof components.ComponentMod.default==="function"?components.ComponentMod.default:null);return await (_h?_h(handlerReq,handlerRes,{waitUntil:this.getWaitUntil()}):null),null`;

  const handlerCallRegex = /(?:return\s+)?await\s+components\.ComponentMod\.handler\s*\(\s*handlerReq\s*,\s*handlerRes\s*,\s*\{\s*waitUntil:\s*this\.getWaitUntil\(\)\s*\}\s*\)(?:\s*,\s*null)?/g;
  if (handlerCallRegex.test(handlerCode)) {
    handlerCode = handlerCode.replace(handlerCallRegex, safeCall);
    console.log("✓ Added Next.js 16 ComponentMod fallback in handler.mjs");
  }

  fs.writeFileSync(handlerPath, handlerCode, "utf8");
}

// 3. Copy worker.js to _worker.js in .open-next and wrap with error logging
if (fs.existsSync(workerSrc)) {
  let content = fs.readFileSync(workerSrc, "utf8");

  // Inject node:module polyfill at top of _worker.js
  const topPolyfill = `
import * as _cf_mod from "node:module";
try {
  if (!_cf_mod.prototype) _cf_mod.prototype = {};
  if (!_cf_mod.prototype.require) {
    _cf_mod.prototype.require = function(r) { return typeof require === "function" ? require(r) : {}; };
  }
} catch (_) {}
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
        const text = await res.clone().text().catch(() => "");
        if (text.includes("=== CLOUDFLARE PAGES 500 ERROR DETAILS ===") || text.length > 50) {
          return res;
        }
        return new Response("=== CLOUDFLARE PAGES 500 ERROR DETAILS ===\\n\\n" + (errorLogs.join("\\n\\n") || ("Response body: " + text + "\\nStatus: " + res.status)), {
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
