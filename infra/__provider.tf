# Configure the Cloudflare provider.
provider "cloudflare" {}

provider "google" {
  project = "sandbox-project-tc"
  region  = "australia-southeast1"
}

provider "google-beta" {
  project = "sandbox-project-tc"
  region  = "australia-southeast1"
}

terraform {
  required_version = ">= 0.13.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 2.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 3.90"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 3.90"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "tejasc"

    workspaces {
      name = "website"
    }
  }
}
