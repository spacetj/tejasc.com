resource "google_storage_bucket" "website" {
  name          = var.domain
  location      = var.location
  force_destroy = true
  storage_class = var.class

  bucket_policy_only = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  logging {
    log_bucket = "management-tejasc"
    log_object_prefix =  "log/tejasc-"
  }
}

resource "google_storage_bucket_iam_member" "read_only" {
  bucket = google_storage_bucket.website.name
  role = "roles/storage.objectViewer"
  member = "allUsers"
}
