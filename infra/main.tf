module "tejasc" {
  source   = "./modules/static_website"
  domain   = "tejasc.com"
  cname    = "c.storage.googleapis.com"
  location = "australia-southeast1"
  class    = "STANDARD"
}

module "artifact_registry" {
  source = "git::https://github.com/GoogleCloudPlatform/terraform-google-artifact-registry.git?ref=v0.7.0"

  project_id    = "sandbox-project-tc"
  location      = "australia-southeast1"
  format        = "DOCKER"
  repository_id = "docker"
}
