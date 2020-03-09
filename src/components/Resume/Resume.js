import React, { Component } from "react";
import Typewriter from "typewriter-effect";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

class Resume extends Component {
  render() {
    if (this.props.data) {
      var eduNodeCount = 0;
      var workNodeCount = 0;

      var education = this.props.data.education.map(function(education) {
        return (
          <TreeItem nodeId={eduNodeCount++} label={education.degree}>
            <TreeItem nodeId={eduNodeCount++} label={education.school} />
            <TreeItem nodeId={eduNodeCount++} label={education.graduated} />
            <TreeItem nodeId={eduNodeCount++} label={education.description} />
          </TreeItem>
        );
      });

      var work = this.props.data.work.map(function(work) {
        return (
          <TreeItem nodeId={workNodeCount++} label={work.company}>
            <TreeItem nodeId={workNodeCount++} label={work.title} />
            <TreeItem nodeId={workNodeCount++} label={work.start + " - " + work.end} />
            <TreeItem nodeId={workNodeCount++} label={work.description} />
          </TreeItem>
        );
      });
    }

    return (
      <section id="resume">
        <div className="row">
          <h2 style={{paddingTop:"50px"}}>
            <Typewriter
              onInit={typewriter => {
                typewriter
                  .pauseFor(2000)
                  .typeString(" > tejasc education --help")
                  .start();
              }}
            />
          </h2>
          <TreeView
            className="treeview"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {education}
          </TreeView>
        </div>
        <div className="row" style={{paddingTop:"50px"}}>
          <h2>
            <Typewriter
              onInit={typewriter => {
                typewriter
                  .pauseFor(6000)
                  .typeString("> tejasc work --help")
                  .start();
              }}
            />
          </h2>
          <TreeView
            className="treeview"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {work}
          </TreeView>
        </div>
      </section>
    );
  }
}

export default Resume;
