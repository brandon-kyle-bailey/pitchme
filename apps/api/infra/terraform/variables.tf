variable "digitalocean_token" {
  type      = string
  sensitive = true
}

variable "ssh_fingerprint" {
  type = string
}

variable "ssh_ip" {
  type = string
}
