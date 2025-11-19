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

  const ensureGlobalThis = context => {
    if (context && typeof context === "object" && !context.globalThis) {
      Object.defineProperty(context, "globalThis", {
        value: context,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
    return context;
  };

  const originalRunInNewContext = vm.runInNewContext;
  vm.runInNewContext = function runInNewContext(code, context = {}, options) {
    return originalRunInNewContext.call(vm, code, ensureGlobalThis(context), options);
  };

  const originalRunInContext = vm.runInContext;
  vm.runInContext = function runInContext(code, contextifiedSandbox, options) {
    ensureGlobalThis(contextifiedSandbox);
    return originalRunInContext.call(vm, code, contextifiedSandbox, options);
  };

  const Script = vm.Script;
  const originalScriptRunInNewContext = Script.prototype.runInNewContext;
  Script.prototype.runInNewContext = function(context = {}, options) {
    return originalScriptRunInNewContext.call(this, ensureGlobalThis(context), options);
  };

  const originalScriptRunInContext = Script.prototype.runInContext;
  Script.prototype.runInContext = function(contextifiedSandbox, options) {
    ensureGlobalThis(contextifiedSandbox);
    return originalScriptRunInContext.call(this, contextifiedSandbox, options);
  };
}
