function assert(value, message) {
  if (!value) {
    throw new Error(message || "Assertion failed");
  }
}

assert.ok = assert;

module.exports = assert;
