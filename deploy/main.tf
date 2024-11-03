provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "cloud_build_api" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry_api" {
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

# Artifact Registry
resource "google_artifact_registry_repository" "docker_repo" {
  provider      = google
  location      = var.region
  repository_id = var.docker_repository_id
  format        = "DOCKER"
  description   = "Docker repository for Mars Rover"
  depends_on    = [google_project_service.artifact_registry_api]
}

# Cloud Build Trigger
resource "google_cloudbuild_trigger" "github-trigger" {
  name        = "Github"
  location    = var.region

  github {
    owner = var.github_owner
    name  = var.github_repository
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"

  service_account = "projects/${var.project_id}/serviceAccounts/282376634786-compute@developer.gserviceaccount.com"

  depends_on = [google_project_service.cloud_build_api]
}

# Cloud Run Service
resource "google_cloud_run_service" "cloud_run_service" {
  name     = var.github_repository
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.docker_repository_id}/${var.github_repository}:latest"
        ports {
          container_port = var.port
        }
      }
    }
  }

  depends_on = [
    google_artifact_registry_repository.docker_repo,
    google_project_service.cloud_run_api
  ]
}

# Allow unauthenticated access
resource "google_cloud_run_service_iam_member" "noauth" {
  location = google_cloud_run_service.cloud_run_service.location
  project  = var.project_id
  service  = google_cloud_run_service.cloud_run_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}