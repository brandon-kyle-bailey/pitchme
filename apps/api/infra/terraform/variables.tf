variable "digitalocean_token" {
  type        = string
  description = "DigitalOcean API token"
}

variable "ssh_fingerprint" {
  type        = string
  description = "Fingerprint of the SSH key uploaded to DigitalOcean"
}
