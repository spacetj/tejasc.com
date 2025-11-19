#!/usr/bin/env node

if (typeof globalThis === "undefined") {
  Object.defineProperty(global, "globalThis", {
    value: global,
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

const vm = require("vm");
const originalRunInNewContext = vm.runInNewContext;
vm.runInNewContext = function runInNewContext(code, context = {}, options) {
  if (context && typeof context === "object" && !context.globalThis) {
    Object.defineProperty(context, "globalThis", {
      value: context,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }
  return originalRunInNewContext.call(vm, code, context, options);
};

require("gatsby/dist/bin/gatsby");
