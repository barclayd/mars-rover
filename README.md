# Mars Rover Simulation

This project simulates the control of Mars Rovers based on NASA specifications. It allows you to navigate rovers on a plateau on Mars, providing a simple interface to move and rotate the rovers.

[![CI](https://github.com/barclayd/mars-rover/actions/workflows/ci.yaml/badge.svg)](https://github.com/barclayd/mars-rover/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)


## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Production Mode](#production-mode)
  - [Development Mode](#development-mode)
  - [Input File Format](#input-file-format)
- [Configuration](#configuration)
  - [Command Line Arguments](#command-line-arguments)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Testing](#testing)
  - [Linting](#linting)
- [Docker Support](#docker-support)
- [CI/CD and Infrastructure](#cicd-and-infrastructure)
  - [Pipeline Overview](#pipeline-overview)
  - [Infrastructure as Code](#infrastructure-as-code)
  - [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)


## Prerequisites

- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime (setup instructions [here](https://bun.sh/docs/installation))

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/barclayd/mars-rover.git
   cd mars-rover
   ```

2. Install dependencies:
   ```sh
   bun install
   ```

## Usage

To run the Mars Rover simulation in production mode:

```sh
bun start
```

This will output the final positions of the rovers to the file specified in the `DEFAULT_OUTPUT_FILE_PATH` environment variable, upon success.

The `DEFAULT_OUTPUT_FILE_PATH` is deleted if it exists before the application starts to ensure an accurate output for every run.

### Development Mode

To run the Mars Rover simulation in development mode:

```sh
bun dev
```

This will output a representation of the plateau to the console:


| (0,5) | (1,5) | (2,5) | (3,5) | (4,5) | (5,5) |
|-------|-------|-------|-------|-------|-------|
| (0,4) | (1,4) | (2,4) | (3,4) | (4,4) | (5,4) |
| (0,3) |   N   | (2,3) | (3,3) | (4,3) | (5,3) |
| (0,2) | (1,2) | (2,2) | (3,2) | (4,2) | (5,2) |
| (0,1) | (1,1) | (2,1) | (3,1) | (4,1) |   E   |
| (0,0) | (1,0) | (2,0) | (3,0) | (4,0) | (5,0) |

This can be used to visualize the plateau and the rovers' positions and for debugging purposes.

### Input File Format

The input file should follow this format:

```
5 5                 # Plateau size (width height)
1 2 N               # Rover 1 initial position (x y direction)
LMLMLMLMM          # Rover 1 movement instructions
3 3 E               # Rover 2 initial position
MMRMMRMRRM         # Rover 2 movement instructions
```

Valid directions are: N (North), E (East), S (South), W (West)
Valid instructions are: L (turn left), R (turn right), M (move forward)

## Configuration

### Command line arguments

The application accepts the following command line arguments:

- `filePath`: The path to the input file
- `isDev`: A boolean flag to indicate if the application is running in development mode


### Environment variables

The application uses the following environment variables:

- `OUTPUT_FILE_PATH`: The path to the output file
- `DEFAULT_INPUT_FILE_PATH`: The path to the default input file

## Development

### Testing

This project uses [Bun's built-in test runner](https://bun.sh/docs/cli/test) for unit and integration testing.

To run all tests:

```sh
bun test
```

### Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Biome is a fast, modern linter and formatter for JavaScript and TypeScript projects.

To run the linter:

```sh
bun lint
```

## Docker Support

This project includes Docker support for containerized deployment. The provided Dockerfile uses the official Bun Docker image as a base.

### Building the Docker Image

To build the Docker image locally:

```sh
docker build -t mars-rover .
```

## CI/CD and Infrastructure

This project uses GitHub Actions for continuous integration and deployment, along with Terraform for infrastructure as code. The pipeline automatically builds, tests, and deploys the application to Google Cloud Run.

### CI/CD Pipeline

The CI/CD workflow consists of the following stages:

1. **Build & Test**
   - Runs on every push and pull request
   - Installs dependencies
   - Runs linting checks
   - Executes test suite

2. **Deploy**
   - Triggers on merges to main branch
   - Authenticates with Google Cloud
   - Builds and pushes container to Artifact Registry
   - Deploys to Cloud Run

The workflow is defined in `.github/workflows/ci.yaml`.

### Automated Deployment Process

The project includes an automated deployment process configured in `deploy/main.tf`. A Cloud Build trigger is set up to automatically run whenever code is pushed to the main branch. Specifically:

1. The GitHub trigger monitors the main branch for any pushes
2. When code is pushed, it automatically triggers Cloud Build using the `cloudbuild.yaml` configuration
3. Cloud Build executes the following steps:
   - Builds a new Docker container from the latest code
   - Pushes the container to Artifact Registry
   - Updates the Cloud Run service with the new container
4. The Cloud Run service is then automatically updated to run the latest version of the code

This creates a seamless deployment pipeline where code changes pushed to main are automatically built, tested, and deployed without manual intervention. The Cloud Run service URL remains constant while the underlying container is updated.

### Infrastructure as Code

The infrastructure is managed using Terraform, with configurations stored in the `terraform/` directory:

- `terraform/main.tf`: Core infrastructure components
- `terraform/variables.tf`: Variable definitions
- `terraform/outputs.tf`: Output configurations
- `terraform/providers.tf`: Provider configurations

Key infrastructure components include:

- Google Cloud Run service
- Artifact Registry repository
- IAM roles and permissions
- Cloud Build triggers

### Setup Requirements

To work with the infrastructure:

1. Install Terraform
2. Configure Google Cloud credentials:
   ```sh
   gcloud auth application-default login
   ```
3. Initialize Terraform:
   ```sh
   cd terraform
   terraform init
   ```

### Deployment

The deployment process is automated through GitHub Actions, but can also be performed manually:

1. Build and tag the Docker image:
   ```sh
   docker build -t gcr.io/[PROJECT_ID]/mars-rover .
   ```

2. Push to Artifact Registry:
   ```sh
   docker push gcr.io/[PROJECT_ID]/mars-rover
   ```

3. Deploy to Cloud Run:
   ```sh
   gcloud run deploy mars-rover \
     --image gcr.io/[PROJECT_ID]/mars-rover \
     --platform managed \
     --region [REGION]
   ```

### Live Demo

The application is currently deployed and accessible at [https://mars-rover-282376634786.europe-west1.run.app/](https://mars-rover-282376634786.europe-west1.run.app/).

### Future Enhancements

The following improvements are planned for future releases:

- Integration with Google Cloud Storage (GCS) to persist rover movement outputs and enable historical tracking
- Enhanced file input capabilities allowing users to:
  - Upload custom input files through a web interface
  - Select from a library of predefined rover movement patterns
  - Save and share rover movement configurations


### Environment Configuration

The following environment variables are required for CI/CD:

- `GCP_PROJECT_ID`: Google Cloud project ID
- `GCP_SA_KEY`: Service account key for GCP authentication
- `TF_VAR_project_id`: Project ID for Terraform
- `DOCKER_USERNAME`: Docker registry username
- `DOCKER_PASSWORD`: Docker registry password

These should be configured as GitHub repository secrets.


## Project Structure

The project is organized as follows:

- `src/`: Contains the main source code
  - `index.ts`: Entry point of the application
  - `plateau.ts`: Defines the plateau and related functions
  - `rover.ts`: Implements rover movement and placement logic
  - `utils.ts`: Utility functions for file reading and parsing
  - `helpers/`: Helper functions for output formatting
  - `schemas/`: Zod schemas for input validation
  - `types/`: TypeScript type definitions
- `test/`: Contains test files
  - `manual/`: Manual test data
  - `integration/`: Integration tests for the application
- `biome.json`: Configuration file for Biome (linter and formatter)
- `package.json`: Project metadata and dependencies
- `tsconfig.json`: TypeScript configuration
- `LICENSE`: MIT License file

This structure separates concerns, making the codebase modular and easy to navigate. The `src` directory contains the core logic, while `test` houses both manual test data and automated unit tests.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Run tests to ensure everything works (`bun test`)
5. Run the linter (`bun lint`)
6. Commit your changes (`git commit -am 'Add new feature'`)
7. Push to the branch (`git push origin feature/improvement`)
8. Create a Pull Request

Please make sure your PR:
- Includes tests for new functionality
- Passes all existing tests
- Follows the project's code style (using Biome)
- Includes appropriate documentation updates

### Development Setup

1. Install [Bun](https://bun.sh/) if you haven't already
2. Clone your fork of the repository
3. Install dependencies:
   ```sh
   bun install
   ```
5. Start developing!

For major changes, please open an issue first to discuss what you would like to change.
