import React from "react";
import PropTypes from "prop-types";

import ScrollToVersion from "./ScrollToVersion.js";

const ChangelogFilter = ({ versions, onChange }) => (
  <div className="ChangelogFilter">
    <div className="changelog-filters">
      <input type="text" className="changelog-input js-changelog-input" />
      <input
        id="changelog-filter-work"
        className="js-changelog-checkbox changelog-checkbox"
        type="checkbox"
        value="work"
        onChange={onChange}
      />
      <label
        className="changelog-checkbox-label"
        htmlFor="changelog-filter-work"
      >
        work
      </label>
      <input
        id="changelog-filter-education"
        className="js-changelog-checkbox changelog-checkbox"
        type="checkbox"
        value="education"
        onChange={onChange}
      />
      <label
        className="changelog-checkbox-label"
        htmlFor="changelog-filter-education"
      >
        education
      </label>
      <input
        id="changelog-filter-portfolio"
        className="js-changelog-checkbox changelog-checkbox"
        type="checkbox"
        value="portfolio"
        onChange={onChange}
      />
      <label
        className="changelog-checkbox-label"
        htmlFor="changelog-filter-portfolio"
      >
        portfolio
      </label>
      <ScrollToVersion versions={versions} />
    </div>
  </div>
);

ChangelogFilter.propTypes = {
  verions: PropTypes.array,
  onChange: PropTypes.func
};

export default ChangelogFilter;
