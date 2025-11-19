const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const { execSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const postsDir = path.join(projectRoot, "content/posts");
const pagesDir = path.join(projectRoot, "content/pages");

const normalizeSlug = slug => slug.replace(/^\//, "");

const deriveSlug = (baseDir, filePath) => {
  const relative = path.relative(baseDir, filePath).replace(/\\/g, "/");
  let slug = `/${relative.replace(/index\.md$/, "")}`;
  if (!slug.endsWith("/")) {
    slug += "/";
  }
  const separatorIndex = slug.indexOf("--");
  const shortSlugStart = separatorIndex > -1 ? separatorIndex + 2 : 0;
  const prefix = separatorIndex > -1 ? "/" : "";
  return `${prefix}${slug.substring(shortSlugStart)}`;
};

const extractTitle = filePath => {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return match ? match[1].trim() : null;
};

const buildMarkdownIndex = baseDir => {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(baseDir, entry.name, "index.md"))
    .filter(fs.existsSync)
    .map(filePath => ({
      filePath,
      slug: deriveSlug(baseDir, filePath),
      title: extractTitle(filePath)
    }));
};

const parseHtml = html => cheerio.load(html);

const readPage = (slug, filename = "index.html") => {
  const filePath = path.join(publicDir, normalizeSlug(slug), filename);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, "utf8");
  expect(content.trim().length).toBeGreaterThan(0);
  return content;
};

const expectLinkForSlug = ($, slug) => {
  const linkCount = $(`a[href='${slug}']`).length + $(`a[href='${slug.replace(/\/$/, "")}']`).length;
  expect(linkCount).toBeGreaterThan(0);
};

beforeAll(() => {
  execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });
});

describe("Gatsby build output", () => {
  test("home page renders meaningful content", () => {
    const html = readPage("/");
    const $ = parseHtml(html);
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    expect(bodyText.length).toBeGreaterThan(200);
    expect(bodyText.toLowerCase()).toContain("tejas");
    expect($("title").text().toLowerCase()).toContain("tejas");
  });

  test("home page build does not include obvious errors", () => {
    const html = readPage("/");
    expect(html.toLowerCase()).not.toContain("not found");
    expect(html.length).toBeGreaterThan(1000);
  });
});

describe("Markdown-driven pages", () => {
  const pageEntries = buildMarkdownIndex(pagesDir);

  test("all markdown pages were built", () => {
    expect(pageEntries.length).toBeGreaterThan(0);
  });

  pageEntries.forEach(page => {
    test(`page ${page.slug} has visible content`, () => {
      const html = readPage(page.slug);
      const $ = parseHtml(html);
      const text = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      expect(text.length).toBeGreaterThan(50);
      if (page.title) {
        expect(text.toLowerCase()).toContain(page.title.toLowerCase());
      }
    });
  });
});

describe("Blog posts", () => {
  const posts = buildMarkdownIndex(postsDir);

  test("all posts were built", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  posts.forEach(post => {
    test(`post ${post.slug} includes its title and body content`, () => {
      const html = readPage(post.slug);
      const $ = parseHtml(html);
      const bodyText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      expect(bodyText.length).toBeGreaterThan(200);
      if (post.title) {
        expect(bodyText.toLowerCase()).toContain(post.title.toLowerCase());
      }
    });
  });

  test("sitemap lists every post", () => {
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    posts.forEach(post => {
      expect(sitemap).toContain(post.slug);
    });
  });
});

describe("Featured sections", () => {
  test("projects page lists multiple repositories", () => {
    const html = readPage("/projects/");
    const $ = parseHtml(html);
    const githubLinks = $("a[href*='github.com']");
    expect(githubLinks.length).toBeGreaterThan(2);
  });

  test("talks page includes embedded videos", () => {
    const html = readPage("/talks/");
    const $ = parseHtml(html);
    expect($("iframe").length).toBeGreaterThan(0);
  });

  test("navigation text highlights key sections", () => {
    const html = readPage("/");
    const body = html.toLowerCase();
    ["projects", "talks", "blog"].forEach(label => {
      expect(body).toContain(label);
    });
  });
});
