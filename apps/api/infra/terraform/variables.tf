variable "digitalocean_token" {
  type        = string
  description = "digital Ocean api token"
}

variable "ssh_fingerprint" {
  type        = string
  description = "Fingerprint of the SSH key uploaded to DigitalOcean"
}

variable "ssh_ip" {
  type        = string
  description = "Your local public IP address"
}
