import React from "react";
import PropTypes from "prop-types";

import ChangelogVersion from "./ChangelogVersion.js";

const ChangelogList = ({ list, filter }) => {
  // Will override filters if all of them are false
  const empty = !filter.work && !filter.education && !filter.portfolio;
  return (
    <div className="changelog-items">
      {list &&
        list.length > 0 &&
        list.map(({ version, date, work, education, portfolio }) => (
          <ChangelogVersion
            version={version}
            date={date}
            work={(empty || filter.work) && work}
            education={(empty || filter.education) && education}
            portfolio={(empty || filter.portfolio) && portfolio}
          />
        ))}
    </div>
  );
};

ChangelogList.propTypes = {
  list: PropTypes.array,
  filter: PropTypes.object
};

export default ChangelogList;