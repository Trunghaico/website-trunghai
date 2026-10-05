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
const originalRequire = mod && mod.prototype ? mod.prototype.require : undefined;
const resolveFilename = mod && mod._resolveFilename ? mod._resolveFilename : undefined;
let resolve = process.env.NEXT_MINIMAL ? (typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__.resolve : require.resolve) : require.resolve;
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
if (mod && mod.prototype && originalRequire) {
    mod.prototype.require = function(request) {
        if (hookPropertyMap.has(request)) {
            return originalRequire.call(this, hookPropertyMap.get(request));
        }
        return originalRequire.call(this, request);
    };
}
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
if (process.env.NEXT_RUNTIME !== 'edge') {
  try { require('next/dist/server/node-environment'); } catch (_) {}
  try { require('next/dist/server/require-hook'); } catch (_) {}
  try { require('next/dist/server/node-polyfill-crypto'); } catch (_) {}
}
`;
        fs.writeFileSync(fullPath, safeEnv, "utf8");
        console.log("✓ Patched setup-node-env:", fullPath);
      }
    }
  }
}

// 1. Patch inside node_modules/next
const nextDir = path.join(process.cwd(), "node_modules", "next");
if (fs.existsSync(nextDir)) {
  walkAndPatch(nextDir);
}

// 2. Patch OpenNext require-hook plugin filter to catch all require-hook occurrences
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
