# Website 

## Prerequisites

Use Node.js 22 (see `.nvmrc`) to match the build toolchain. If you use `nvm`, run `nvm use` to switch automatically.

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

### Terraform upgrade notes

The Terraform Cloud state for `infra/` was originally created with Terraform
0.12. Before applying changes with Terraform 1.x you **must** migrate the
provider addresses in the remote state. Run the helper script once with a
Terraform CLI that is authenticated against Terraform Cloud:

```bash
scripts/terraform/migrate-providers.sh
```

This script executes `terraform state replace-provider` for Cloudflare, Google,
and Google Beta so the state stops referring to the legacy provider namespace.
You can then re-run `terraform init`/`terraform plan` in Terraform Cloud using
Terraform 1.14.x (or newer).

### Authenticating the CLI with Terraform Cloud

Local `terraform init`/`plan` against the Terraform Cloud backend requires a
user API token. Create one via **Terraform Cloud → User Settings → Tokens**, then
export it and run the helper script once:

```bash
export TF_CLOUD_TOKEN=your-tfc-token
scripts/terraform/configure-cloud.sh
```

This writes `~/.terraform.d/credentials.tfrc.json` so subsequent CLI commands
automatically authenticate against `app.terraform.io`.

## Contributing

- Create your feature branch (git checkout -b feature/fooBar)
- Commit your changes (git commit -am 'Add some fooBar')
- Push to the branch (git push origin feature/fooBar)
- Create a new Pull Request
