if (typeof globalThis === "undefined") {
  Object.defineProperty(global, "globalThis", {
    value: global,
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

if (typeof global !== "undefined") {
  // Some Gatsby internals evaluate code within isolated VM contexts.
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
}
