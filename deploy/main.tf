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
  location      = "europe-west2"
  repository_id = "mars-rover"
  format        = "DOCKER"
  description   = "Docker repository for Mars Rover"
  depends_on    = [google_project_service.artifact_registry_api]
}

# Cloud Build Trigger
resource "google_cloudbuild_trigger" "filename-trigger" {
  name        = "Github"
  location    = "europe-west2"

  github {
    owner = "barclayd"
    name  = "mars-rover"
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
  name     = "mars-rover"
  location = "europe-west2"

  template {
    spec {
      containers {
        image = "europe-west2-docker.pkg.dev/mars-rover-439913/mars-rover/mars-rover:latest"
        ports {
          container_port = 3000
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