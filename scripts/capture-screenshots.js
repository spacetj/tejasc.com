const http = require("http");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const artifactsDir = path.join(projectRoot, "artifacts", "screenshots");
const postsDir = path.join(projectRoot, "content", "posts");
const pagesDir = path.join(projectRoot, "content", "pages");

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
      slug: deriveSlug(baseDir, filePath)
    }));
};

const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
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

const servePublic = port =>
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

    server.listen(port, "0.0.0.0", () => resolve(server));
  });

const targetPages = () => {
  const pages = [
    { slug: "/", name: "home" },
    { slug: "/blog/", name: "blog" },
    { slug: "/projects/", name: "projects" },
    { slug: "/talks/", name: "talks" }
  ];

  const posts = buildMarkdownIndex(postsDir).slice(0, 3);
  posts.forEach((post, index) => {
    pages.push({ slug: post.slug, name: `post-${index + 1}` });
  });

  const contentPages = buildMarkdownIndex(pagesDir).slice(0, 2);
  contentPages.forEach((page, index) => {
    pages.push({ slug: page.slug, name: `page-${index + 1}` });
  });

  return pages;
};

const waitForContent = async page => {
  const bodyText = await page.$eval("body", node => node.innerText.trim());
  if (!bodyText || bodyText.length < 20) {
    throw new Error("Captured page appears to be empty");
  }
};

const captureScreenshots = async () => {
  ensureDir(artifactsDir);
  const port = 9000;
  const server = await servePublic(port);
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  try {
    const pages = targetPages();
    for (const entry of pages) {
      const page = await browser.newPage();
      const url = `http://localhost:${port}${entry.slug}`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      await waitForContent(page);
      const filePath = path.join(artifactsDir, `${entry.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      await page.close();
      // eslint-disable-next-line no-console
      console.log(`Captured ${entry.slug} -> ${filePath}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
};

captureScreenshots().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
