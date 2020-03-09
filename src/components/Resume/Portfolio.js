import React, { Component } from "react";
import Typewriter from "typewriter-effect";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

class Portfolio extends Component {

  render() {
    var portfolioCount = 0;

    function groupByCategory(arr) {
      var obj = {};
      for (var x = 0; x < arr.length; x++) {
        if (obj[arr[x].category]) {
          obj[arr[x].category] = obj[arr[x].category] + arr[x];
        } else {
          obj[arr[x].category] = [arr[x]];
        }
      }
      return obj;
    }

    if (this.props.data) {

      var projects = this.props.data.projects.map(function(project) {
        return (
          <TreeItem nodeId={portfolioCount++} label={project.title}>
            <TreeItem nodeId={portfolioCount++} label={project.category} />
            <TreeItem nodeId={portfolioCount++} label={project.url} />
            <TreeItem nodeId={portfolioCount++} label={project.description} />
          </TreeItem>
        );
      });
    }

    return (
      <section id="portfolio">
        <div className="row">
          <h2 style={{paddingTop:"50px"}}>
            <Typewriter
              onInit={typewriter => {
                typewriter
                  .pauseFor(9000)
                  .typeString(" > tejasc portfolio --help")
                  .start();
              }}
            />
          </h2>
          <TreeView
            className="treeview"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {projects}
          </TreeView>
        </div>
      </section>
    );
  }
}

export default Portfolio;
