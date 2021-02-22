import React, { Component } from "react";

import ReactChangelog from "../Changelog";



class Example extends Component {
  render() {
    return <ReactChangelog endpoint="/resume.json" />;
  }
}

export default Example;
