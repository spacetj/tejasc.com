const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "Tejas C - Blog", // <title>
  shortSiteTitle: "tejasc --help", // <title> ending for posts and pages
  siteDescription: "Tejas C: Talks, Adventures, Blogs.",
  siteUrl: "https://tejasc.com",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "tejas c",
  authorTwitterAccount: "space_tj",
  // info
  infoTitle: "tejas c",
  infoTitleNote: "personal blog",
  // manifest.json
  manifestName: "Tejas C",
  manifestShortName: "PersonalBlog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "contact@tejasc.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/spacetj" },
    { name: "twitter", url: "https://twitter.com/space_tj" },
  ]
};
