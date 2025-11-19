const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "pages" });
    const separatorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separatorIndex ? separatorIndex + 2 : 0;

    createNodeField({
      node,
      name: "slug",
      value: `${separatorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
    });

    createNodeField({
      node,
      name: "prefix",
      value: separatorIndex ? slug.substring(1, separatorIndex) : ""
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  const pageTemplate = path.resolve("./src/templates/PageTemplate.js");

  const result = await graphql(`
    {
      allMarkdownRemark(filter: { id: { regex: "//posts|pages//" } }, limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`, result.errors);
    return;
  }

  result.data.allMarkdownRemark.edges.forEach(edge => {
    const slug = edge.node.fields.slug;
    const isPost = /posts/.test(edge.node.id);

    createPage({
      path: slug,
      component: isPost ? postTemplate : pageTemplate,
      context: {
        slug
      }
    });
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@babel/runtime/helpers/builtin/interopRequireDefault$": path.resolve(
          __dirname,
          "src/polyfills/babelInteropRequireDefault.js"
        )
      }
    }
  });
};
