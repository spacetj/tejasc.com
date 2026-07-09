import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import config from "../../../content/meta/config";

const siteRoot = `${config.siteUrl}${config.pathPrefix || ""}`.replace(/\/+$/, "");

const normalizePath = (value) => {
  if (!value) {
    return "/";
  }

  const path = String(value).startsWith("/") ? String(value) : `/${value}`;
  return path === "/" ? path : path.replace(/\/+$/, "");
};

const toAbsoluteUrl = (value) => {
  if (!value) {
    return `${siteRoot}/`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = String(value).startsWith("/") ? String(value) : `/${value}`;
  return `${siteRoot}${path}`;
};

const Seo = (props) => {
  const { data, facebook, image: imageOverride, path, title: titleOverride, type } = props;
  const frontmatter = (data || {}).frontmatter || {};
  const postTitle = titleOverride || frontmatter.title;
  const postDescription = props.description || frontmatter.description || (data || {}).excerpt;
  const postCover = frontmatter.cover;
  const postCoverImage = (((postCover || {}).childImageSharp || {}).resize || {}).src;
  const postSlug = path || ((data || {}).fields || {}).slug || "/";

  const title = postTitle ? `${postTitle} - ${config.shortSiteTitle}` : config.siteTitle;
  const description = postDescription ? postDescription : config.siteDescription;
  const image = toAbsoluteUrl(imageOverride || postCoverImage || config.siteImage);
  const url = toAbsoluteUrl(normalizePath(postSlug));
  const twitterCreator = config.authorTwitterAccount
    ? `@${config.authorTwitterAccount.replace(/^@/, "")}`
    : "";

  return (
    <Helmet
      htmlAttributes={{
        lang: config.siteLanguage,
        prefix: "og: http://ogp.me/ns#",
      }}
    >
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="fb:app_id" content={(facebook || {}).appId || ""} />
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

Seo.propTypes = {
  data: PropTypes.object,
  description: PropTypes.string,
  facebook: PropTypes.object,
  image: PropTypes.string,
  path: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
};

Seo.defaultProps = {
  data: null,
  description: "",
  facebook: {},
  image: "",
  path: "",
  title: "",
  type: "website",
};

export default Seo;
