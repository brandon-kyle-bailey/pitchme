terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_droplet" "pitch_me" {
  name     = "pitch-me-api"
  region   = "nyc1"
  size     = "s-1vcpu-2gb"
  image    = "ubuntu-24-04-x64"
  ssh_keys = [var.ssh_fingerprint]
  tags     = ["api", "docker"]

  user_data = <<-EOF
    #cloud-config
    runcmd:
      - apt update && apt install -y ca-certificates curl gnupg lsb-release
      - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      - echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
      - apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      - usermod -aG docker ubuntu
      - systemctl enable docker
      - systemctl start docker
  EOF
}

resource "digitalocean_firewall" "api_fw" {
  name        = "api-firewall"
  droplet_ids = [digitalocean_droplet.pitch_me.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = [var.ssh_ip]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0"]
  }
}
