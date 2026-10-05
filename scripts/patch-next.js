const fs = require("fs");
const path = require("path");

function walkAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== ".git" && entry.name !== ".next") {
        walkAndPatch(fullPath);
      }
    } else {
      if (entry.name === "require-hook.js") {
        if (fullPath.includes("next-config-ts")) {
          const configHook = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module = require("module");
const path = require("path");
function requireFromString(code, filename, opts) {
  if (typeof filename === "object") { opts = filename; filename = undefined; }
  opts = opts || {};
  filename = filename || "";
  const paths = Module._nodeModulePaths(path.dirname(filename));
  const parent = module.parent;
  const m = new Module(filename, parent);
  m.filename = filename;
  m.paths = [...(opts.prependPaths || []), ...paths, ...(opts.appendPaths || [])];
  m._compile(code, filename);
  return m.exports;
}
exports.requireFromString = requireFromString;
exports.addHookAliases = function() {};
exports.defaultOverrides = {};
exports.hookPropertyMap = new Map();
module.exports = {
  requireFromString,
  addHookAliases: function() {},
  defaultOverrides: {},
  hookPropertyMap: new Map()
};
`;
          fs.writeFileSync(fullPath, configHook, "utf8");
          console.log("✓ Patched next-config-ts require-hook:", fullPath);
        } else {
          const safeServerHook = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const mod = require('module');
let resolve = require.resolve;
const hookPropertyMap = new Map();
const defaultOverrides = {};
try {
    Object.assign(defaultOverrides, {
        'styled-jsx': path.dirname(resolve('styled-jsx/package.json')),
        'styled-jsx/style': resolve('styled-jsx/style'),
        'styled-jsx/style.js': resolve('styled-jsx/style')
    });
} catch (_) {}
function addHookAliases(aliases = []) {
    for (const [key, value] of aliases){
        hookPropertyMap.set(key, value);
    }
}
try {
  if (mod && mod.prototype && typeof mod.prototype.require === 'function') {
      const originalRequire = mod.prototype.require;
      mod.prototype.require = function(request) {
          if (hookPropertyMap.has(request)) {
              return originalRequire.call(this, hookPropertyMap.get(request));
          }
          return originalRequire.call(this, request);
      };
  }
} catch (_) {}
exports.addHookAliases = addHookAliases;
exports.defaultOverrides = defaultOverrides;
exports.hookPropertyMap = hookPropertyMap;
module.exports = {
  addHookAliases,
  defaultOverrides,
  hookPropertyMap
};
`;
          fs.writeFileSync(fullPath, safeServerHook, "utf8");
          console.log("✓ Patched server require-hook:", fullPath);
        }
      } else if (entry.name === "setup-node-env.external.js") {
        const safeEnv = `"use strict";
module.exports = {};
`;
        fs.writeFileSync(fullPath, safeEnv, "utf8");
        console.log("✓ Patched setup-node-env:", fullPath);
      } else if (entry.name === "app-page.runtime.prod.js") {
        let content = fs.readFileSync(fullPath, "utf8");
        const setupEnvRequire = 'require("next/dist/build/adapter/setup-node-env.external.js")';
        if (content.includes(setupEnvRequire)) {
          content = content.replaceAll(setupEnvRequire, '({})');
          fs.writeFileSync(fullPath, content, "utf8");
          console.log("✓ Removed setup-node-env require from app-page.runtime.prod.js:", fullPath);
        }
      } else if (entry.name === "base-server.js") {
        let content = fs.readFileSync(fullPath, "utf8");
        const pattern = /await\s+components\.ComponentMod\.handler\s*\(\s*handlerReq\s*,\s*handlerRes\s*,\s*\{\s*waitUntil:\s*this\.getWaitUntil\(\)\s*\}\s*\);/g;
        if (pattern.test(content)) {
          const safeCode = `const _h = (components.ComponentMod && typeof components.ComponentMod.handler === "function" ? components.ComponentMod.handler.bind(components.ComponentMod) : null)
          || (components.routeModule && typeof components.routeModule.handle === "function" ? (q, s, x) => components.routeModule.handle(q, s, x) : null)
          || (components.ComponentMod && components.ComponentMod.routeModule && typeof components.ComponentMod.routeModule.handle === "function" ? (q, s, x) => components.ComponentMod.routeModule.handle(q, s, x) : null)
          || (components.ComponentMod && typeof components.ComponentMod.default === "function" ? components.ComponentMod.default : null);
        if (_h) {
          await _h(handlerReq, handlerRes, {
            waitUntil: this.getWaitUntil()
          });
        }`;
          content = content.replace(pattern, safeCode);
          fs.writeFileSync(fullPath, content, "utf8");
          console.log("✓ Patched base-server.js with ComponentMod fallback:", fullPath);
        }
      }
    }
  }
}

// 1. Patch inside node_modules/next
const nextDir = path.join(process.cwd(), "node_modules", "next");
if (fs.existsSync(nextDir)) {
  walkAndPatch(nextDir);
}

// 2. Patch inside .open-next if exists
const openNextDir = path.join(process.cwd(), ".open-next");
if (fs.existsSync(openNextDir)) {
  walkAndPatch(openNextDir);
}

// 3. Patch OpenNext require-hook plugin filter to catch all require-hook occurrences
const openNextPlugin = path.join(process.cwd(), "node_modules", "@opennextjs", "cloudflare", "dist", "cli", "build", "patches", "plugins", "require-hook.js");
if (fs.existsSync(openNextPlugin)) {
  const cleanPlugin = `import { join } from "node:path";
export function shimRequireHook(options) {
    const emptyShimPath = join(options.outputDir, "cloudflare-templates/shims/empty.js");
    return {
        name: "require-hook-shim",
        setup(build) {
            build.onResolve({ filter: /require-hook/ }, () => ({
                path: emptyShimPath,
            }));
        },
    };
}
`;
  fs.writeFileSync(openNextPlugin, cleanPlugin, "utf8");
  console.log("✓ Broadened OpenNext require-hook plugin filter to /require-hook/");
}

console.log("✓ patch-next completed successfully");
