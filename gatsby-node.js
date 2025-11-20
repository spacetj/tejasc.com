const path = require("path");
const fs = require("fs");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    if (fileNode && fileNode.sourceInstanceName) {
      createNodeField({
        node,
        name: "collection",
        value: fileNode.sourceInstanceName
      });
    }

    const slug = createFilePath({ node, getNode, basePath: "pages" });
    const separatorIndex = ~slug.indexOf("--") ? slug.indexOf("--") : 0;
    const shortSlugStart = separatorIndex ? separatorIndex + 2 : 0;

    createNodeField({
      node,
      name: "slug",
      value: `${separatorIndex ? "/" : ""}${slug.substring(shortSlugStart)}`
    });

    let prefixValue = separatorIndex ? slug.substring(1, separatorIndex) : "";
    if (!prefixValue && fileNode) {
      const normalizedDir = (fileNode.relativeDirectory || "").replace(/\\/g, "/");
      if (fileNode.sourceInstanceName === "posts") {
        const match = normalizedDir.match(/(\d{4}-\d{2}-\d{2})--/);
        if (match) {
          prefixValue = match[1];
        }
      } else if (fileNode.sourceInstanceName === "pages") {
        const match = normalizedDir.match(/(\d+)--/);
        if (match) {
          prefixValue = match[1];
        }
      }
    }

    createNodeField({
      node,
      name: "prefix",
      value: prefixValue
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve("./src/templates/PostTemplate.js");
  const pageTemplate = path.resolve("./src/templates/PageTemplate.js");

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { fields: { collection: { in: ["posts", "pages"] } } }
        limit: 1000
      ) {
        edges {
          node {
            id
            fields {
              slug
              collection
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
    const isPost = edge.node.fields.collection === "posts";

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
        ),
        assert$: path.resolve(__dirname, "src/polyfills/assert.js")
      }
    }
  });
};

exports.onPostBuild = async () => {
  const publicDir = path.join(__dirname, "public");
  const modernSitemap = path.join(publicDir, "sitemap-0.xml");
  const legacySitemap = path.join(publicDir, "sitemap.xml");

  if (fs.existsSync(modernSitemap)) {
    fs.copyFileSync(modernSitemap, legacySitemap);
  }
};
