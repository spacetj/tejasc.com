#!/usr/bin/env node

if (typeof globalThis === "undefined") {
  Object.defineProperty(global, "globalThis", {
    value: global,
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

require("gatsby/dist/bin/gatsby");
