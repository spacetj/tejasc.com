import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";

import Main from "../components/Main";
import Article from "../components/Main/Article";
import PageHeader from "../components/Page/PageHeader";
import ContactCard from "../components/ContactForm";
import Seo from "../components/Seo";

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
        <ContactCard />
      </Article>
    </Main>
  );
};

Contact.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(Contact);
