import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Resume from "../components/Resume";

const ResumePage = props => {
  // const {
  //   data: {
  //     site: {
  //       siteMetadata: { facebook }
  //     }
  //   }
  // } = props;


  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <Resume />
          </Article>
        )}
      </ThemeContext.Consumer>

      {/* <Seo facebook={facebook} /> */}
    </React.Fragment>
  );
};

ResumePage.propTypes = {
  data: PropTypes.object.isRequired
};

export default ResumePage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query ResumePage {
    site {
      siteMetadata {
        facebook {
          appId
        }
      }
    }
  }
`;
