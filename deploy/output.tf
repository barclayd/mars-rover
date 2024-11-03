output "cloud_build_url" {
  description = "URL to view Cloud Build history"
  value       = "https://console.cloud.google.com/cloud-build/builds;region=global?project=${var.project_id}"
}

output "cloud_run_url" {
  description = "URL to view Cloud Run history"
  value       = "https://console.cloud.google.com/run/detail/${var.project_id}/services/mars-rover?project=${var.project_id}"
}

output "cloud_run_service_url" {
  description = "URL to view Cloud Run service"
  value       = "https://mars-rover.${var.region}.run.app"
}
