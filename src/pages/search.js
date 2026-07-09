import React from "react";
import PropTypes from "prop-types";
require("core-js/es/array/find");

import Main from "../components/Main";
import Article from "../components/Main/Article";
import PageHeader from "../components/Page/PageHeader";
import Search from "../components/Search";
import Seo from "../components/Seo";

const SearchPage = (props) => {
  const { data } = props;

  return (
    <Main>
      <Seo
        title="Search"
        description="Search posts and pages on Tejas C's cloud engineering blog."
        path="/search"
      />
      <Article>
        <PageHeader title="Search by" algolia={true} />
        {/* <Search algolia={data.site.siteMetadata.algolia} /> */}
      </Article>
    </Main>
  );
};

SearchPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchPage;

//eslint-disable-next-line no-undef
