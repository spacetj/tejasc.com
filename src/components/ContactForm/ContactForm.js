import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { navigate } from "gatsby";

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const styles = theme => ({
  submit: {
    margin: "3em 0"
    //width: "100%"
  },
  multilineInput: {
    lineHeight: 1.4,
    fontSize: "1.2em"
  },
  singleLineInput: {
    lineHeight: 1.4,
    fontSize: "1.2em",
    [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {
      width: "47%",
      marginLeft: "3%",
      "&:first-child": {
        marginRight: "3%",
        marginLeft: 0
      }
    }
  },
  submitError: {
    background: "red",
    color: "white"
  }
});

class ContactForm extends React.Component {
  state = {
    name: "",
    email: "",
    message: "",
    submitError: ""
  };

  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  };

  handleNetworkError = () => {
    this.setState({ submitError: "There was a network error." });
  };

  handleSubmit = e => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "contact",
        name: this.state.name,
        email: this.state.email,
        message: this.state.message
      })
    })
      .then(() => {
        console.log("Form submission success");
        navigate("/success");
      })
      .catch(error => {
        console.error("Form submission error:", error);
        this.handleNetworkError();
      });

  };

  render() {
    const { classes } = this.props;
    const { email, name, message, submitError } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        name="contact"
        method="post"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />
        {submitError && <p className={classes.submitError}>{submitError}</p>}
        <TextField
          id="name"
          name="name"
          label="Name"
          value={name}
          onChange={this.handleChange}
          required
          fullWidth
          margin="normal"
          className={classes.singleLineInput}
        />
        <TextField
          id="email"
          name="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={this.handleChange}
          required
          fullWidth
          margin="normal"
          className={classes.singleLineInput}
        />
        <TextField
          id="message"
          name="message"
          label="Message"
          value={message}
          onChange={this.handleChange}
          required
          multiline
          fullWidth
          margin="normal"
          className={classes.multilineInput}
        />
        <input name="bot-field" style={{ display: "none" }} />
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          className={classes.submit}
        >
          Send
        </Button>
      </form>
    );
  }
}

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ContactForm);
