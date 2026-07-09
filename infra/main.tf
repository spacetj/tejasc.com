module "tejasc" {
  source   = "./modules/static_website"
  domain   = "tejasc.com"
  cname    = "c.storage.googleapis.com"
  location = "australia-southeast1"
  class    = "STANDARD"
}
