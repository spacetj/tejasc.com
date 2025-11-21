terraform {
  required_version = ">= 1.14.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 2.0"
    }
    google = {
      source  = "hashicorp/google"
      version = ">= 5.26.0, < 8.0.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 5.26.0, < 8.0.0"
    }
  }
}
