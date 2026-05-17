const fs = require("fs");
const http = require("http");
const path = require("path");
const cheerio = require("cheerio");
const { execSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const postsDir = path.join(projectRoot, "content/posts");
const pagesDir = path.join(projectRoot, "content/pages");
const siteUrl = "https://tejasc.com";
const genericDescription = "Tejas C: Talks, Adventures, Blogs.";

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
const macOSChromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let puppeteerModule;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const canonicalPath = slug => {
  const pathWithSlash = slug.startsWith("/") ? slug : `/${slug}`;
  return pathWithSlash === "/" ? "/" : pathWithSlash.replace(/\/+$/, "");
};

const canonicalUrl = slug => `${siteUrl}${canonicalPath(slug)}`;

const metaContent = ($, selector) => $(selector).attr("content") || "";

const expectSeoMetadata = ($, slug, options = {}) => {
  const description = metaContent($, "meta[name='description']");
  const ogUrl = metaContent($, "meta[property='og:url']");
  const ogImage = metaContent($, "meta[property='og:image']");
  const twitterImage = metaContent($, "meta[name='twitter:image']");

  expect($("title").text()).not.toContain("undefined");
  expect(description).not.toContain("undefined");
  expect(ogUrl).toBe(canonicalUrl(slug));
  expect(ogImage).toMatch(/^https:\/\/tejasc\.com\//);
  expect(twitterImage).toBe(ogImage);

  if (!options.allowGenericDescription) {
    expect(description).not.toBe(genericDescription);
    expect(description.length).toBeGreaterThan(20);
  }
};

const loadPuppeteer = async () => {
  if (!puppeteerModule) {
    const imported = await import("puppeteer");
    puppeteerModule = imported.default || imported;
  }

  return puppeteerModule;
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon"
};

const servePublic = () =>
  new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const safePath = decodeURIComponent(req.url.split("?")[0]);
      const requestedPath = safePath === "/" ? "/index.html" : safePath;
      const filePath = path.join(publicDir, normalizeSlug(requestedPath));

      if (!filePath.startsWith(publicDir)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      let target = filePath;
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        target = path.join(target, "index.html");
      }

      if (!fs.existsSync(target)) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      const ext = path.extname(target);
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      fs.createReadStream(target).pipe(res);
    });

    server.listen(0, "127.0.0.1", () => resolve(server));
  });

const puppeteerLaunchOptions = () => {
  const options = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };

  if (process.platform === "darwin" && process.arch === "arm64" && fs.existsSync(macOSChromePath)) {
    options.executablePath = macOSChromePath;
  }

  return options;
};

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

  test("home page includes canonical SEO metadata", () => {
    const html = readPage("/");
    const $ = parseHtml(html);

    expectSeoMetadata($, "/", { allowGenericDescription: true });
    expect($("title").text()).toContain("Tejas C");
  });

  test("home page hydrates without clearing rendered content", async () => {
    const server = await servePublic();
    const address = server.address();
    const port = typeof address === "object" ? address.port : 9000;
    let browser;

    try {
      const puppeteer = await loadPuppeteer();
      browser = await puppeteer.launch(puppeteerLaunchOptions());
      const page = await browser.newPage();
      const runtimeErrors = [];

      page.on("pageerror", error => {
        if (
          /element type is invalid|minified react error #130|invariant=130/i.test(error.message)
        ) {
          runtimeErrors.push(error.message);
        }
      });
      page.on("console", message => {
        const text = message.text();
        if (
          message.type() === "error" &&
          /element type is invalid|minified react error #130|invariant=130/i.test(text)
        ) {
          runtimeErrors.push(text);
        }
      });

      await page.setViewport({ width: 1280, height: 720 });
      const response = await page.goto(`http://127.0.0.1:${port}/`, {
        waitUntil: "networkidle2",
        timeout: 60000
      });

      expect(response && response.status()).toBeLessThan(400);
      await page.waitForFunction(
        () => document.querySelector("#___gatsby")?.innerText.trim().length > 20,
        { timeout: 10000 }
      );
      await wait(1000);

      const hydratedState = await page.evaluate(() => {
        const root = document.querySelector("#___gatsby");
        return {
          bodyText: document.body.innerText.replace(/\s+/g, " ").trim(),
          rootChildCount: root ? root.children.length : 0
        };
      });

      expect(runtimeErrors).toEqual([]);
      expect(hydratedState.rootChildCount).toBeGreaterThan(0);
      expect(hydratedState.bodyText.toLowerCase()).toContain("stability and reliability");
      ["projects", "talks", "blog"].forEach(label => {
        expect(hydratedState.bodyText.toLowerCase()).toContain(label);
      });
      expect(hydratedState.bodyText.toLowerCase()).not.toContain("success");
    } finally {
      if (browser) {
        await browser.close();
      }
      server.close();
    }
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

    test(`page ${page.slug} has page-specific SEO metadata`, () => {
      const html = readPage(page.slug);
      const $ = parseHtml(html);

      expectSeoMetadata($, page.slug);
      if (page.title) {
        expect($("title").text().toLowerCase()).toContain(page.title.toLowerCase());
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

    test(`post ${post.slug} has page-specific SEO metadata`, () => {
      const html = readPage(post.slug);
      const $ = parseHtml(html);

      expectSeoMetadata($, post.slug);
      if (post.title) {
        expect($("title").text().toLowerCase()).toContain(post.title.toLowerCase());
      }
    });
  });

  test("sitemap lists every post", () => {
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    posts.forEach(post => {
      const normalizedSlug = post.slug.endsWith("/")
        ? post.slug.slice(0, -1)
        : post.slug;
      const matches = [post.slug, normalizedSlug].some(variant =>
        sitemap.includes(variant)
      );
      expect(matches).toBe(true);
    });
  });
});

describe("Static page SEO", () => {
  [
    {
      slug: "/contact/",
      title: "$ tejasc contact"
    },
    {
      slug: "/resume/",
      title: "$ tejasc portfolio --display=changelog"
    },
    {
      slug: "/search/",
      title: "Search"
    }
  ].forEach(page => {
    test(`${page.slug} has canonical SEO metadata`, () => {
      const html = readPage(page.slug);
      const $ = parseHtml(html);

      expectSeoMetadata($, page.slug);
      expect($("title").text().toLowerCase()).toContain(page.title.toLowerCase());
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
    expect(body).toContain("blog");
  });
});
