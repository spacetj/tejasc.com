# Configure the Cloudflare provider.
provider "cloudflare" {
  version = "~> 2.0"
}

provider "google" {
  project     = "sandbox-project-tc"
  region      = "australia-southeast1"
}

terraform {
  required_version = ">= 0.12.24"

  backend "remote" {
    hostname      = "app.terraform.io"
    organization  = "tejasc"

    workspaces {
      name = "website"
    }
  }
}
