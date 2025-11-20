import React from "react";
import { Provider } from "react-redux";
import { JssProvider } from "react-jss";

import createStore from "./src/state/store";
import getPageContext from "./src/getPageContext";
import Layout from "./src/layouts";

const store = createStore();

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>;
};

export const wrapPageElement = ({ element, props }) => {
  const muiPageContext = getPageContext();

  return (
    <JssProvider
      registry={muiPageContext.sheetsRegistry}
      generateClassName={muiPageContext.generateClassName}
    >
      <Layout {...props} muiPageContext={muiPageContext}>
        {element}
      </Layout>
    </JssProvider>
  );
};
