resource "cloudflare_zone" "zone" {
  zone = var.domain
}

# Add storage apis cname record
resource "cloudflare_record" "cname" {
  zone_id = cloudflare_zone.zone.id
  name    = var.domain
  value   = var.cname
  type    = "CNAME"
  proxied = true
}

# Add www redirect cname record
resource "cloudflare_record" "www-cname" {
  zone_id = cloudflare_zone.zone.id
  name    = format("www.%s", var.domain)
  value   = var.domain
  type    = "CNAME"
  proxied = true
}

# Add mx records
resource "cloudflare_record" "mx" {
  count   = length(local.mx_records)
  zone_id = cloudflare_zone.zone.id
  name    = "@"
  value   = local.mx_records[count.index]
  ttl     = 3600
  type    = "MX"
}

# Add google domain verification record
resource "cloudflare_record" "google-verification" {
  zone_id = cloudflare_zone.zone.id
  name    = var.domain
  value   = "google-site-verification=qgXW3lYLc78tX9gpGhAVHYYnpQE_zrL4OyZKMjaD_Ds"
  type    = "TXT"
  proxied = false
}

resource "cloudflare_zone_settings_override" "test" {
  zone_id = cloudflare_zone.zone.id
  settings {
    always_online            = "on"
    always_use_https         = "on"
    automatic_https_rewrites = "on"
    brotli                   = "on"
    browser_check            = "on"
    email_obfuscation        = "on"
    hotlink_protection       = "on"
    ip_geolocation           = "on"
    min_tls_version          = "1.2"
    opportunistic_encryption = "on"
    security_level           = "high"
    ssl                      = "full"

    challenge_ttl = 2700
    minify {
      css  = "on"
      js   = "on"
      html = "on"
    }
    security_header {
      enabled = true
    }
  }
}

# Add a page rule to the domain
resource "cloudflare_page_rule" "github-rewrite" {
  zone_id  = cloudflare_zone.zone.id
  target   = format("%s/code", var.domain)
  priority = 2

  actions {
    forwarding_url {
      url         = format("https://github.com/spacetj/%s", var.domain)
      status_code = "301"
    }
  }
}

# Add a page rule to the domain
resource "cloudflare_page_rule" "www-rewrite" {
  zone_id  = cloudflare_zone.zone.id
  target   = format("www.%s/*", var.domain)
  priority = 1

  actions {
    forwarding_url {
      url         = format("https://%s/$1", var.domain)
      status_code = "301"
    }
  }
}
