terraform {
  backend "gcs" {
    bucket = "mars-rover-439913-tfstate"
    prefix = "env/prod"
  }
}