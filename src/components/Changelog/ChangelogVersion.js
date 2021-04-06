import React from "react";
import PropTypes from "prop-types";

import FeatureItem from "./FeatureItem.js";

const ChangelogVersion = ({ version, date, work, education, portfolio }) => {
  const slug = version.replaceAll(".", "");
  return (
    <div id={`v${slug}`} className="changelog-item js-changelog-item">
      <header className="changelog-header">
        <h3 className="changelog-version">
          <a href={`#v${slug}`}>{version}</a>
        </h3>
        <p className="changelog-date">{date}</p>
      </header>
      <div className="changelog-update-descriptions">
        {education &&
          education.length > 0 &&
          education.map(item => <FeatureItem type={2} description={item} />)}
        {portfolio &&
          portfolio.length > 0 &&
          portfolio.map(item => <FeatureItem type={3} description={item} />)}
        {work &&
          work.length > 0 &&
          work.map(item => <FeatureItem type={1} description={item} />)}
      </div>
      <div className="changelog-link" />
    </div>
  );
};

ChangelogVersion.propTypes = {
  version: PropTypes.string,
  date: PropTypes.string,
  work: PropTypes.array,
  education: PropTypes.array,
  portfolio: PropTypes.array
};

export default ChangelogVersion;