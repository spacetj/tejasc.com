import React from "react";
import PropTypes from "prop-types";

const FeatureItem = ({ type, description }) => {
  let itemClass = "";
  switch (type) {
    case 1:
      itemClass = "work";
      break;
    case 2:
      itemClass = "education";
      break;
    case 3:
      itemClass = "portfolio";
      break;
  }

  return (
    <p
      className={`changelog-update-description changelog-${itemClass} js-changelog-update-description`}
      data-instafilta-category={itemClass}
      data-instafilta-hide="false"
    >
      <span className="changelog-type">{itemClass}</span>
      {description}
    </p>
  );
};

FeatureItem.propTypes = {
  type: PropTypes.number,
  description: PropTypes.string
};

export default FeatureItem;