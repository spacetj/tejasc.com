import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";

import config from "../../../content/meta/config";

const mailSubject = encodeURIComponent("Hello from tejasc.com");
const mailtoHref = `mailto:${config.contactEmail}?subject=${mailSubject}`;
const socialLabels = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter"
};

const styles = theme => ({
  card: {
    border: `1px solid ${theme.base.colors.lines}`,
    borderLeft: `5px solid ${theme.base.colors.accent}`,
    color: theme.main.colors.content,
    margin: "0 0 2.5rem",
    padding: "1.5rem",
    [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {
      padding: "2rem"
    }
  },
  eyebrow: {
    color: theme.base.colors.accent,
    fontSize: ".85em",
    fontWeight: 600,
    letterSpacing: ".08em",
    margin: "0 0 .75rem",
    textTransform: "uppercase"
  },
  title: {
    color: theme.main.colors.title,
    fontSize: "1.55em",
    fontWeight: 600,
    lineHeight: 1.2,
    margin: "0 0 1rem"
  },
  body: {
    fontSize: "1.05em",
    lineHeight: 1.65,
    margin: "0 0 1.5rem"
  },
  primaryLink: {
    background: theme.base.colors.accent,
    color: theme.base.colors.background,
    display: "inline-block",
    fontWeight: 600,
    margin: "0 0 1.75rem",
    padding: ".85rem 1rem",
    textDecoration: "none",
    transition: "background .2s ease, color .2s ease",
    "&:hover": {
      background: theme.base.colors.linkHover,
      color: theme.base.colors.background,
      textDecoration: "none"
    }
  },
  detailList: {
    display: "grid",
    gap: "1.25rem",
    margin: 0,
    [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {
      gridTemplateColumns: "1fr 1fr"
    }
  },
  detailGroup: {
    margin: 0
  },
  detailTitle: {
    color: theme.main.colors.title,
    fontSize: ".85em",
    fontWeight: 600,
    letterSpacing: ".04em",
    margin: "0 0 .4rem",
    textTransform: "uppercase"
  },
  detailValue: {
    lineHeight: 1.55,
    margin: 0
  },
  socialList: {
    display: "flex",
    flexWrap: "wrap",
    gap: ".5rem .8rem",
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  socialLink: {
    color: theme.base.colors.link,
    fontWeight: 600,
    textDecoration: "none",
    "&:hover": {
      color: theme.base.colors.linkHover,
      textDecoration: "underline"
    }
  }
});

const ContactCard = props => {
  const { classes } = props;

  return (
    <section className={classes.card} aria-labelledby="contact-card-title">
      <p className={classes.eyebrow}>Direct contact</p>
      <h2 className={classes.title} id="contact-card-title">
        Start with email
      </h2>
      <p className={classes.body}>
        For cloud engineering, Kubernetes, Terraform, platform reliability, talks,
        or technical reviews, send a short note and the most useful context.
      </p>
      <a className={classes.primaryLink} href={mailtoHref}>
        Email {config.contactEmail}
      </a>
      <dl className={classes.detailList}>
        <div className={classes.detailGroup}>
          <dt className={classes.detailTitle}>Best for</dt>
          <dd className={classes.detailValue}>
            Platform engineering work, cloud-native delivery, production readiness,
            and speaking opportunities.
          </dd>
        </div>
        <div className={classes.detailGroup}>
          <dt className={classes.detailTitle}>Elsewhere</dt>
          <dd className={classes.detailValue}>
            <ul className={classes.socialList}>
              {config.authorSocialLinks.map(item => (
                <li key={item.name}>
                  <a
                    className={classes.socialLink}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialLabels[item.name] || item.name}
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </section>
  );
};

ContactCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(ContactCard);
