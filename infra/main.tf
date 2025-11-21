module "tejasc" {
  source   = "./modules/static_website"
  domain   = "tejasc.com"
  cname    = "c.storage.googleapis.com"
  location = "australia-southeast1"
  class    = "STANDARD"
}

resource "google_artifact_registry_repository" "docker" {
  project       = "sandbox-project-tc"
  location      = "australia-southeast1"
  repository_id = "docker"
  format        = "DOCKER"
  description   = "Container images for tejasc.com"
}
