/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from "jss";

import theme from "./styles/theme";

function createStableGenerateId() {
  let ruleCounter = 0;

  return (rule, sheet) => {
    ruleCounter += 1;

    const jssId =
      sheet && sheet.options && sheet.options.jss && sheet.options.jss.id != null
        ? String(sheet.options.jss.id)
        : "0";

    return `jss-${jssId}-${ruleCounter}`;
  };
}

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // Keep production SSR and client hydration class names stable across Gatsby bundles.
    generateId: createStableGenerateId()
  };
}

export default function getPageContext() {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return createPageContext();
  }

  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
