# Website

## Prerequisites

Use Node.js 22 (see `.nvmrc`) to match the build toolchain. If you use `nvm`, run:

```text
nvm use
```

Install dependencies with the npm version bundled with Node 22:

```text
npm install
```

## Getting started

```text
npm run develop
```

to hot-serve your website on http://localhost:8000 or

```text
npm run build
```

to create static site ready to host (/public).

## Overview

The site is created by the PersonalBlog Gatsby template. For more information checkout the [docs](https://www.gatsbyjs.com/starters/greglobinski/gatsby-starter-personal-blog).

```sh
├── content             ## Blogs / pages / site metadata
├── infra               ## Terraform code for cloudflare and gcs
├── scripts             ## Bash scripts
├── src                 ## JS source files
├── static              ## Images
```

- The static content is served through a GCS bucket
- Uses cloudflare as WAF and for defining DNS records
- Requests are proxied through Cloudflare through to `storage.googleapis.com`

## Contributing

- Create your feature branch (git checkout -b feature/fooBar)
- Commit your changes (git commit -am 'Add some fooBar')
- Push to the branch (git push origin feature/fooBar)
- Create a new Pull Request
