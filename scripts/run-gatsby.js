#!/usr/bin/env node

const path = require("path");

const polyfillPath = path.join(__dirname, "globalthis-polyfill.js");
const requireFlag = `--require "${polyfillPath}"`;
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes(polyfillPath)) {
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} ${requireFlag}`
    : requireFlag;
}

require(polyfillPath);
require("gatsby/dist/bin/gatsby");
