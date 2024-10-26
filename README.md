# Mars Rover Simulation

This project simulates the control of Mars Rovers based on NASA specifications. It allows you to navigate rovers on a plateau on Mars, providing a simple interface to move and rotate the rovers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime (requires Node.js v18.17.1 or higher)

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

To run the Mars Rover simulation:

```sh
bun start
```

This will output a representation of the plateau to the console:


| (0,5) | (1,5) | (2,5) | (3,5) | (4,5) | (5,5) |
| (0,4) | (1,4) | (2,4) | (3,4) | (4,4) | (5,4) |
| (0,3) |   N   | (2,3) | (3,3) | (4,3) | (5,3) |
| (0,2) | (1,2) | (2,2) | (3,2) | (4,2) | (5,2) |
| (0,1) | (1,1) | (2,1) | (3,1) | (4,1) |   E   |
| (0,0) | (1,0) | (2,0) | (3,0) | (4,0) | (5,0) |

This can be used to visualize the plateau and the rovers' positions and for debugging purposes.

## Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Biome is a fast, modern linter and formatter for JavaScript and TypeScript projects.

To run the linter:

```sh
bun lint
```

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

