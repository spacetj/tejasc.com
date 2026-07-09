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

const listBuiltHtmlFiles = dir => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listBuiltHtmlFiles(filePath);
      }
      return entry.isFile() && entry.name.endsWith(".html") ? [filePath] : [];
    });
};

const listBuiltFiles = dir => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const filePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listBuiltFiles(filePath);
      }
      return entry.isFile() ? [filePath] : [];
    });
};

const parseHtml = html => cheerio.load(html);
const macOSChromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let puppeteerModule;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const smokeViewports = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 }
];

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

const captureRuntimeErrors = (page, label) => {
  const runtimeErrors = [];

  page.on("pageerror", error => {
    runtimeErrors.push(`${label} pageerror: ${error.message}`);
  });
  page.on("console", message => {
    if (message.type() === "error") {
      runtimeErrors.push(`${label} console: ${message.text()}`);
    }
  });

  return runtimeErrors;
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

const builtSmokeRoutes = () => {
  const routes = [
    "/",
    "/contact/",
    "/resume/",
    "/search/",
    ...buildMarkdownIndex(pagesDir).map(page => page.slug),
    ...buildMarkdownIndex(postsDir).map(post => post.slug)
  ];

  return Array.from(new Set(routes));
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

  test("service worker retires stale offline app-shell caches", () => {
    const swPath = path.join(publicDir, "sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const sw = fs.readFileSync(swPath, "utf8");
    expect(sw).toContain("registration.unregister");
    expect(sw).toContain("caches.delete");
    expect(sw).not.toContain("precacheManifest");
    expect(sw).not.toContain("offline-plugin-app-shell-fallback");
    expect(fs.existsSync(path.join(publicDir, "offline-plugin-app-shell-fallback"))).toBe(false);
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
      const runtimeErrors = captureRuntimeErrors(page, "home desktop");

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

  test("talks page renders a visible content panel after hydration", async () => {
    const server = await servePublic();
    const address = server.address();
    const port = typeof address === "object" ? address.port : 9000;
    let browser;

    try {
      const puppeteer = await loadPuppeteer();
      browser = await puppeteer.launch(puppeteerLaunchOptions());
      const page = await browser.newPage();
      const runtimeErrors = captureRuntimeErrors(page, "talks desktop");

      await page.setViewport({ width: 1280, height: 720 });
      const response = await page.goto(`http://127.0.0.1:${port}/talks/`, {
        waitUntil: "networkidle2",
        timeout: 60000
      });

      expect(response && response.status()).toBeLessThan(400);
      await page.waitForFunction(
        () => document.body.innerText.includes("KubeSummit Sydney 2019"),
        { timeout: 10000 }
      );

      const layoutState = await page.evaluate(() => {
        const main = document.querySelector("main");
        const article = document.querySelector("article");
        const mainRect = main && main.getBoundingClientRect();
        const articleRect = article && article.getBoundingClientRect();

        return {
          mainHeight: mainRect ? mainRect.height : 0,
          mainLeft: mainRect ? mainRect.left : 0,
          articleHeight: articleRect ? articleRect.height : 0,
          articleLeft: articleRect ? articleRect.left : 0,
          articleWidth: articleRect ? articleRect.width : 0
        };
      });

      expect(layoutState.mainHeight).toBeGreaterThan(600);
      expect(layoutState.mainLeft).toBeGreaterThan(250);
      expect(layoutState.articleHeight).toBeGreaterThan(600);
      expect(layoutState.articleLeft).toBeGreaterThan(300);
      expect(layoutState.articleWidth).toBeGreaterThan(300);
      expect(runtimeErrors).toEqual([]);
    } finally {
      if (browser) {
        await browser.close();
      }
      server.close();
    }
  });

  test("built routes hydrate without browser runtime errors on desktop and mobile", async () => {
    const server = await servePublic();
    const address = server.address();
    const port = typeof address === "object" ? address.port : 9000;
    let browser;
    const failures = [];

    try {
      const puppeteer = await loadPuppeteer();
      browser = await puppeteer.launch(puppeteerLaunchOptions());

      for (const route of builtSmokeRoutes()) {
        for (const viewport of smokeViewports) {
          const page = await browser.newPage();
          const label = `${route} ${viewport.name}`;
          const runtimeErrors = captureRuntimeErrors(page, label);

          try {
            await page.setViewport({ width: viewport.width, height: viewport.height });
            const response = await page.goto(`http://127.0.0.1:${port}${route}`, {
              waitUntil: "networkidle2",
              timeout: 60000
            });

            if (!response || response.status() >= 400) {
              failures.push(`${label} returned ${response ? response.status() : "no response"}`);
              continue;
            }

            await page.waitForFunction(
              () => document.querySelector("#___gatsby")?.innerText.trim().length > 20,
              { timeout: 10000 }
            );
            await wait(500);

            const state = await page.evaluate(() => {
              const root = document.querySelector("#___gatsby");
              return {
                bodyTextLength: document.body.innerText.replace(/\s+/g, " ").trim().length,
                rootChildCount: root ? root.children.length : 0
              };
            });

            if (state.rootChildCount < 1) {
              failures.push(`${label} rendered an empty Gatsby root`);
            }
            if (state.bodyTextLength < 20) {
              failures.push(`${label} rendered too little body text`);
            }
            failures.push(...runtimeErrors);
          } catch (error) {
            failures.push(`${label} failed: ${error.message}`);
            failures.push(...runtimeErrors);
          } finally {
            await page.close();
          }
        }
      }

      expect(failures).toEqual([]);
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

describe("Contact page", () => {
  test("uses a static contact card instead of an unsupported hosted form", () => {
    const html = readPage("/contact/");
    const $ = parseHtml(html);
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    expect(bodyText).toContain("Start with email");
    expect(bodyText).toContain("tejas@logit.social");
    expect(bodyText).not.toContain("Coming Soon");
    expect($("form").length).toBe(0);
    expect($("[data-netlify]").length).toBe(0);
    expect($("a[href^='mailto:tejas@logit.social']").length).toBeGreaterThan(0);
    expect($("a[href*='github.com/spacetj']").length).toBe(0);
    expect($("a[href*='linkedin.com/in/tejasc']").length).toBeGreaterThan(0);
  });
});

describe("Profile content", () => {
  test("about page shows current Logit Social profile details without GitHub profile link", () => {
    const html = readPage("/about/");
    const $ = parseHtml(html);
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    expect(bodyText).toContain("tejas@logit.social");
    expect(bodyText).toContain("Sydney, NSW");
    expect(bodyText).toContain("Founder of Logit Social");
    expect(bodyText).not.toContain("contact@tejasc.com");
    expect(bodyText).not.toContain("Melbourne, Victoria, Australia");
    expect(bodyText).not.toContain("Lead Cloud Engineer");
    expect($("a[href*='github.com/spacetj']").length).toBe(0);
  });
});

describe("Accessibility attributes", () => {
  test("built images either have meaningful alt text or are explicitly decorative", () => {
    const offenders = [];

    listBuiltHtmlFiles(publicDir).forEach(filePath => {
      const $ = parseHtml(fs.readFileSync(filePath, "utf8"));
      $("img").each((index, element) => {
        const image = $(element);
        const alt = image.attr("alt");
        const isDecorative =
          alt === "" &&
          (image.attr("aria-hidden") === "true" ||
            ["presentation", "none"].includes(image.attr("role")));

        if (typeof alt === "undefined") {
          offenders.push(`${path.relative(publicDir, filePath)} img ${index} is missing alt`);
        } else if (alt.trim() === "" && !isDecorative) {
          offenders.push(
            `${path.relative(publicDir, filePath)} img ${index} has empty alt without decorative intent`
          );
        }
      });
    });

    expect(offenders).toEqual([]);
  });

  test("embedded frames have accessible titles", () => {
    const offenders = [];

    listBuiltHtmlFiles(publicDir).forEach(filePath => {
      const $ = parseHtml(fs.readFileSync(filePath, "utf8"));
      $("iframe").each((index, element) => {
        const title = ($(element).attr("title") || "").trim();
        if (!title) {
          offenders.push(`${path.relative(publicDir, filePath)} iframe ${index} is missing title`);
        }
      });
    });

    expect(offenders).toEqual([]);
  });

  test("icon-only links and buttons expose accessible names", () => {
    const offenders = [];

    listBuiltHtmlFiles(publicDir).forEach(filePath => {
      const $ = parseHtml(fs.readFileSync(filePath, "utf8"));
      $("a, button").each((index, element) => {
        const control = $(element);
        const hasIcon = control.find("svg").length > 0;
        const visibleText = control.text().replace(/\s+/g, " ").trim();
        const hasNamedImage = control.find("img").toArray().some(img => {
          const alt = ($(img).attr("alt") || "").trim();
          return alt.length > 0;
        });
        const hasAccessibleName =
          Boolean((control.attr("aria-label") || "").trim()) ||
          Boolean((control.attr("aria-labelledby") || "").trim());

        if (hasIcon && !visibleText && !hasNamedImage && !hasAccessibleName) {
          offenders.push(
            `${path.relative(publicDir, filePath)} ${element.tagName} ${index} has only an icon`
          );
        }
      });
    });

    expect(offenders).toEqual([]);
  });
});

describe("Deployment guardrails", () => {
  test("production build output excludes source maps", () => {
    const builtFiles = listBuiltFiles(publicDir);
    const sourceMaps = builtFiles
      .filter(filePath => filePath.endsWith(".map"))
      .map(filePath => path.relative(publicDir, filePath));
    const sourceMapReferences = builtFiles
      .filter(filePath => /\.(css|js)$/.test(filePath))
      .flatMap(filePath => {
        const contents = fs.readFileSync(filePath, "utf8");
        return contents.includes("sourceMappingURL")
          ? [path.relative(publicDir, filePath)]
          : [];
      });

    expect(sourceMaps).toEqual([]);
    expect(sourceMapReferences).toEqual([]);
  });

  test("build and deploy paths clean stale production artifacts", () => {
    const runner = fs.readFileSync(path.join(projectRoot, "scripts/run-gatsby.js"), "utf8");
    const deployScript = fs.readFileSync(path.join(projectRoot, "scripts/deploy-gcs.sh"), "utf8");
    const workflow = fs.readFileSync(path.join(projectRoot, ".github/workflows/workflow.yaml"), "utf8");

    expect(runner).toContain("fs.rmSync(publicDir");
    expect(runner).toContain("pruneProductionArtifacts");
    expect(deployScript).toContain('find ./public -type f -name "*.map"');
    expect(deployScript).toContain('${BUCKET_NAME}/**/*.map');
    expect(deployScript).toContain("sort -u");
    expect(deployScript).toContain('gcloud storage rm "${object}"');
    expect(deployScript).toMatch(/gcloud storage rsync \. "\$\{BUCKET_NAME\}"/);
    expect(deployScript).toContain("--delete-unmatched-destination-objects");
    expect(deployScript).toContain('--exclude=".*\\\\.map$"');
    expect(deployScript).toContain('find . -mindepth 2 -maxdepth 2 -type f -name "index.html"');
    expect(deployScript).toContain('object_name="${object_name%/index.html}"');
    expect(deployScript).not.toContain("${BUCKET_NAME}/talks");
    expect(deployScript).toContain('${BUCKET_NAME}/**/*.html');
    expect(workflow).toContain('SKIP_BUILD: "1"');
    expect(workflow).toContain("./scripts/deploy-gcs.sh");
    expect(workflow).not.toContain("gsutil -m rsync");
  });

  test("CI runs format and lint checks before build", () => {
    const workflow = fs.readFileSync(path.join(projectRoot, ".github/workflows/workflow.yaml"), "utf8");
    const formatIndex = workflow.indexOf("npm run format-output");
    const lintIndex = workflow.indexOf("npm run lint-errors");
    const buildIndex = workflow.indexOf("npm run build");

    expect(formatIndex).toBeGreaterThan(-1);
    expect(lintIndex).toBeGreaterThan(-1);
    expect(buildIndex).toBeGreaterThan(-1);
    expect(formatIndex).toBeLessThan(buildIndex);
    expect(lintIndex).toBeLessThan(buildIndex);
  });

  test("static serving metadata points at production URLs", () => {
    const robots = fs.readFileSync(path.join(projectRoot, "static/robots.txt"), "utf8");

    expect(robots).toContain("Sitemap: https://tejasc.com/sitemap.xml");
    expect(robots).not.toContain("gatsby-starter-personal-blog");
  });

  test("Terraform uses explicit providers and protects the website bucket", () => {
    const providerConfig = fs.readFileSync(path.join(projectRoot, "infra/__provider.tf"), "utf8");
    const bucketConfig = fs.readFileSync(
      path.join(projectRoot, "infra/modules/static_website/bucket.tf"),
      "utf8"
    );

    expect(providerConfig).toContain("required_providers");
    expect(providerConfig).toContain('source  = "cloudflare/cloudflare"');
    expect(providerConfig).toContain('source  = "hashicorp/google"');
    expect(providerConfig).not.toMatch(/provider "cloudflare" \{[^}]*version/s);
    expect(bucketConfig).toContain("force_destroy               = false");
    expect(bucketConfig).toContain("uniform_bucket_level_access = true");
    expect(bucketConfig).toContain("prevent_destroy = true");
    expect(bucketConfig).not.toContain("bucket_policy_only");
  });
});

describe("Featured sections", () => {
  test("projects page highlights Logit Social as the current focused project", () => {
    const html = readPage("/projects/");
    const $ = parseHtml(html);
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    expect($(".project-focus--logit").length).toBe(1);
    expect(bodyText).toContain("Current focus");
    expect(bodyText).toContain("Logit Social");
    expect(bodyText).toContain("private journaling");
    expect(bodyText).toContain("trusted Circles");
    expect($("a[href='https://logit.social']").length).toBe(1);
  });

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
