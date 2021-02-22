import React, { Component } from "react";
import PropTypes from "prop-types";
import ChangelogList from "./ChangelogList.js";
import ChangelogFilter from "./ChangelogFilter.js";

export default class ChangelogContainer extends Component {
  static propTypes = {
    endpoint: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      list: [],
      versions: [],
      filter: {
        work: false,
        education: false,
        portfolio: false
      }
    };
  }

  componentWillMount() {
    const { endpoint } = this.props;
    // TODO: Add error handling and bad format
    fetch(endpoint)
      .then(response => response.json())
      .then(({ title, list }) => {
        const versions = list.map(({ version }) => {
          return {
            version,
            slug: version.replaceAll(".", "")
          };
        });
        this.setState({
          list,
          title,
          versions
        });
      });
  }

  onChange(e) {
    // TODO: Use spread operator to make the function pure
    const filter = this.state.filter;
    filter[e.target.value] = !filter[e.target.value];
    this.setState({
      filter
    });
  }

  render() {
    return (
      <div className="ChangelogContainer">
        <div className="row">
          <div className="col-md-12">
            <div className="changelog-wrapper js-changelog">
              <h1 className="changelog-title">{this.state.title}</h1>
              <ChangelogFilter
                versions={this.state.versions}
                onChange={this.onChange.bind(this)}
              />
              <ChangelogList
                list={this.state.list}
                filter={this.state.filter}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}