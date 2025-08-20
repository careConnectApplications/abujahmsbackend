# hmsbackend

This project is a Hospital Management System backend built with Node.js, Express, and TypeScript. It uses MongoDB as the database.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/careConnectApplications/abujahmsbackend.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd abujahmsbackend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Usage

### Development

To run the application in a development environment with auto-reloading, use the following command:

```bash
npm run teststart
```

Alternatively, you can use:

```bash
npm run testenv
```

### Production

To build and run the application in a production environment, use the following commands:

```bash
npm run build
npm start
```

## Scripts

-   `teststart`: Starts the application in development mode using `ts-node-dev` with auto-reloading.
-   `testenv`: Starts the application in development mode using `nodemon` and `ts-node`.
-   `start`: Starts the application in production mode from the `build` directory.
-   `build`: Compiles the TypeScript code to JavaScript and outputs it to the `build` directory.

## Dependencies

-   `axios`: Promise based HTTP client for the browser and node.js
-   `bcryptjs`: Library to help you hash passwords
-   `convert-excel-to-json`: A module to convert Excel files to JSON.
-   `cors`: Node.js CORS middleware
-   `date-fns`: Modern JavaScript date utility library
-   `dotenv`: Loads environment variables from .env file
-   `express`: Fast, unopinionated, minimalist web framework for node.
-   `express-fileupload`: Simple express file upload middleware.
-   `http-status`: Utility to interact with HTTP status codes
-   `joi`: Object schema description language and validator for JavaScript objects.
-   `jsonwebtoken`: JSON Web Token implementation for node.js
-   `moment`: A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
-   `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
-   `morgan`: HTTP request logger middleware for node.js
-   `node-cron`: A simple cron-like job scheduler for Node.js.
-   `nodemailer`: Send e-mails with Node.JS – easy as cake!
-   `uuid`: For the creation of RFC4122 UUIDs
-   `winston`: A logger for just about everything.

## Dev Dependencies

-   `@types/axios`: TypeScript definitions for axios
-   `@types/bcryptjs`: TypeScript definitions for bcryptjs
-   `@types/convert-excel-to-json`: TypeScript definitions for convert-excel-to-json
-   `@types/cors`: TypeScript definitions for cors
-   `@types/dotenv`: TypeScript definitions for dotenv
-   `@types/express`: TypeScript definitions for Express
-   `@types/express-fileupload`: TypeScript definitions for express-fileupload
-   `@types/joi`: TypeScript definitions for joi
-   `@types/jsonwebtoken`: TypeScript definitions for jsonwebtoken
-   `@types/mongoose`: TypeScript definitions for mongoose
-   `@types/morgan`: TypeScript definitions for morgan
-   `@types/node`: TypeScript definitions for Node.js
-   `@types/node-cron`: TypeScript definitions for node-cron
-   `@types/nodemailer`: TypeScript definitions for nodemailer
-   `@types/uuid`: TypeScript definitions for uuid
-   `nodemon`: Monitor for any changes in your node.js application and automatically restart the server - perfect for development
-   `ts-node`: TypeScript execution and REPL for node.js, with source map support
-   `ts-node-dev`: Compiles your TS app and restarts when files are modified.
-   `typescript`: A typed superset of JavaScript that compiles to plain JavaScript.
