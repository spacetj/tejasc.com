locals {
  mx_records = [
    "gmr-smtp-in.l.google.com",
    "alt1.gmr-smtp-in.l.google.com",
    "alt2.gmr-smtp-in.l.google.com",
    "alt3.gmr-smtp-in.l.google.com",
    "alt4.gmr-smtp-in.l.google.com",
  ]
}

variable domain {
  type = string
}

variable cname {
  type = string
}

variable location {
  type = string
}

variable class {
  type = string
}
