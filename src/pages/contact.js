import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";
import Obfuscate from "react-obfuscate";

import Main from "../components/Main";
import Article from "../components/Main/Article";
import PageHeader from "../components/Page/PageHeader";
import Content from "../components/Main/Content";
import Form from "../components/ContactForm";
import Seo from "../components/Seo";
import config from "../../content/meta/config";

const styles = theme => ({});

const Contact = () => {
  return (
    <Main>
      <Seo
        title="$ tejasc contact"
        description="Get in touch with Tejas C about cloud engineering, Kubernetes, Terraform, and reliability."
        path="/contact"
      />
      <Article>
        <PageHeader title="$ tejasc contact" />
        <Content>
        Coming Soon to a webpage near you. In the meantime, get in touch at <Obfuscate email={config.contactEmail} />
        </Content>
        {/* <Form /> */}
      </Article>
    </Main>
  );
};

Contact.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(Contact);
