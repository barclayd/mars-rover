variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west1"
}

variable "docker_repository_id" {
  description = "Docker Repository ID"
  type        = string
}

variable "github_owner" {
  description = "GitHub Owner"
  type        = string
}

variable "github_repository" {
  description = "GitHub Repository"
  type        = string
}

variable "port" {
  description = "Port"
  type        = number
  default     = 3000
}
