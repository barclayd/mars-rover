output "service_url" {
  value = google_cloud_run_service.mars_rover.status[0].url
}
