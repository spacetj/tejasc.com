module "tejasc" {
    source = "./modules/static_website"
    domain = "tejasc.com"
    cname = "c.storage.googleapis.com"
    location = "australia-southeast1"
    class = "STANDARD"
}

resource "google_project_service" "artifact_registry" {
    project = "sandbox-project-tc"
    service = "artifactregistry.googleapis.com"
}

resource "google_project_service" "secret_manager" {
    project = "sandbox-project-tc"
    service = "secretmanager.googleapis.com"
}

resource "google_project_service" "context_manager" {
    project = "sandbox-project-tc"
    service = "contextmanager.googleapis.com"
}

module "artifact_registry" {
    source = "git::https://github.com/GoogleCloudPlatform/terraform-google-artifact-registry.git?ref=v0.7.0"

    project_id    = "sandbox-project-tc"
    location      = "australia-southeast1"
    format        = "DOCKER"
    repository_id = "docker"

    depends_on = [
        google_project_service.artifact_registry,
        google_project_service.secret_manager,
        google_project_service.context_manager,
    ]
}
