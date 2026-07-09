terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 2.0"
    }

    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
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

provider "cloudflare" {}

provider "google" {
  project = "sandbox-project-tc"
  region  = "australia-southeast1"
}
