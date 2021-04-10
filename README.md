# Website 

## Prerequisites

If you do not have Gatsby Cli installed yet, do it first.

```text
npm install --global gatsby-cli
```

More information on [GatsbyJS.org](https://www.gatsbyjs.org/tutorial/part-one)

## Getting started

```text
gatsby develop
```

to hot-serve your website on http://localhost:8000 or

```text
gatsby build
```

to create static site ready to host (/public).

## Overview 

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
