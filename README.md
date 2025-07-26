# HireUp - Job Application Automation

HireUp is a Next.js application designed to streamline and automate the job application process. It uses AI to generate personalized sentences for cover letters and emails, helping you apply for jobs more efficiently.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your system. You can download Node.js from [https://nodejs.org/](https://nodejs.org/).

### Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory in your terminal.
3.  Install the required dependencies using npm:

    ```bash
    npm install
    ```

## Running the Development Servers

This application uses Next.js for the frontend and Genkit for the AI functionalities. You'll need to run two separate development servers.

1.  **Run the Next.js development server:**
    Open a terminal and run the following command to start the Next.js app.

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

2.  **Run the Genkit development server:**
    Open a second terminal and run the following command to start the Genkit development flow server. This handles the AI-powered features.

    ```bash
    npm run genkit:dev
    ```
    Alternatively, you can run it in watch mode, so it automatically restarts on file changes:
    ```bash
    npm run genkit:watch
    ```

## Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`: Runs the Next.js app in development mode with Turbopack.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors without emitting files.
-   `npm run genkit:dev`: Starts the Genkit flow server for development.
-   `npm run genkit:watch`: Starts the Genkit flow server in watch mode.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized build of your application in the `.next` folder.

To run the production build locally, use:

```bash
npm run start
```
