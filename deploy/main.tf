terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  project = "mars-rover-439913"
  region  = "europe-west2"
}

# Enable required APIs
resource "google_project_service" "cloud_run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_build_api" {
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

# Cloud Build trigger
resource "google_cloudbuild_trigger" "build_trigger" {
  name = "mars-rover-github-trigger"
  filename = "cloudbuild.yaml"
  
  github {
    owner = "barclayd"
    name  = "mars-rover"
    push {
      branch = "^main$"
    }
  }

  depends_on = [google_project_service.cloud_build_api]
}

# Cloud Run service
resource "google_cloud_run_service" "mars_rover" {
  name     = "mars-rover"
  location = "europe-west2"

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/mars-rover:latest"
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }

  depends_on = [google_project_service.cloud_run_api]
}

# IAM policy to make the service public
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.mars_rover.name
  location = google_cloud_run_service.mars_rover.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

