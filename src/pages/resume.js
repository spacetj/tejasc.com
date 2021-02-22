import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";


import Main from "../components/Main";
import Article from "../components/Main/Article";
import PageHeader from "../components/Page/PageHeader";
import Content from "../components/Main/Content";
import Resume from "../components/Resume";

const styles = theme => ({});

const ResumeContent = () => {
  return (
    <Main>
      <Article>
        <PageHeader title="$ tejasc portfolio --display=changelog" />
        <Content>
            <Resume></Resume>
        </Content>
      </Article>
    </Main>
  );
};

ResumeContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ResumeContent);
