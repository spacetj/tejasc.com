import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as JssThemeProvider } from "react-jss";
import getPageContext from "./getPageContext";

function withRoot(Component) {
  class WithRoot extends React.Component {
    constructor(props) {
      super(props);

      this.muiPageContext = this.props.muiPageContext || getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#server-side-jss");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      // ThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <ThemeProvider theme={this.muiPageContext.theme}>
          <JssThemeProvider theme={this.muiPageContext.theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...this.props} />
          </JssThemeProvider>
        </ThemeProvider>
      );
    }
  }

  WithRoot.propTypes = {
    muiPageContext: PropTypes.object,
  };

  return WithRoot;
}

export default withRoot;
