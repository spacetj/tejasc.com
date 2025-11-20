import React from "react";
import { Provider } from "react-redux";
import { JssProvider } from "react-jss";

import createStore from "./src/state/store";
import getPageContext from "./src/getPageContext";
import theme from "./src/styles/theme";
import Layout from "./src/layouts";

let muiPageContext;

export const wrapRootElement = ({ element }) => {
  const store = createStore();
  return <Provider store={store}>{element}</Provider>;
};

export const wrapPageElement = ({ element, props }) => {
  muiPageContext = getPageContext();

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

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  if (muiPageContext) {
    setHeadComponents([
      <style
        type="text/css"
        id="server-side-jss"
        key="server-side-jss"
        dangerouslySetInnerHTML={{ __html: muiPageContext.sheetsRegistry.toString() }}
      />
    ]);
    muiPageContext = null;
  }

  setPostBodyComponents([
    <script
      key={`webfontsloader-setup`}
      dangerouslySetInnerHTML={{
        __html: `
        WebFontConfig = {
          google: {
            families: ["${theme.base.fonts.styledFamily}:${theme.base.fonts.styledFonts}"]
          }
        };

        (function(d) {
            var wf = d.createElement('script'), s = d.scripts[0];
            wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
            wf.async = true;
            s.parentNode.insertBefore(wf, s);
        })(document);`
      }}
    />
  ]);
};
