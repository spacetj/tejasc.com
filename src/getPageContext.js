/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from "jss";
import { createGenerateId } from "react-jss";

import theme from "./styles/theme";

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateId: createGenerateId()
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
