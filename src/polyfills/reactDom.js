import * as ReactDOM from "../../node_modules/react-dom/index.js";

export * from "../../node_modules/react-dom/index.js";

export function findDOMNode(instance) {
  if (!instance) {
    return null;
  }

  if (instance.nodeType) {
    return instance;
  }

  if (instance.current && instance.current.nodeType) {
    return instance.current;
  }

  return null;
}

export default ReactDOM;
