import React, { Component } from "react";
import Typewriter from "typewriter-effect";

class About extends Component {
  render() {

    function githubURL(social) {
      if (social.name == "github") {
        return true;
      }
      return false;
    }

    function linkedInURL(social) {
      if (social.name == "linkedin") {
        return true;
      }
      return false;
    }

    if (this.props.data) {
      var bio = this.props.data.bio;
      var city = this.props.data.address.city;
      var email = this.props.data.email;
      var github = this.props.data.social.filter(githubURL)[0].url;
      var linkedin = this.props.data.social.filter(linkedInURL)[0].url;
    }

    if (this.props.resume) {
      var currentWork = this.props.resume.work[0];
      var currentCompany = currentWork.company;
      var currentTitle = currentWork.title;
    }

    return (
      <section id="about">
        <div className="row">
          <h2 className="terminal-prompt">
            <Typewriter
              onInit={typewriter => {
                typewriter.typeString("> tejasc --help").start();
              }}
            />
          </h2>
          <p id="typewrite-here"></p>
          <p>{bio}</p>
          <p>Global Options</p>
          <table className="table">
            <tr>
              <th>--contact-email</th>
              <th>{email}</th>
            </tr>
            <tr>
              <th>--current-city</th>
              <th>{city}</th>
            </tr>
            <tr>
              <th>--current-title</th>
              <th>{currentTitle}</th>
            </tr>
            <tr>
              <th>--current-company</th>
              <th>{currentCompany}</th>
            </tr>
            <tr>
              <th>--github</th>
              <th>{github}</th>
            </tr>
            <tr>
              <th>--linked-in</th>
              <th>{linkedin}</th>
            </tr>
          </table>
        </div>
      </section>
    );
  }
}

export default About;
