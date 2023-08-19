# ts-node-api

**Description:** A basic Node.js API built using TypeScript. This project includes TypeScript support, unit tests, pre-commit and pre-push hooks, linting, style checks, and more.

## Getting Started

To get started with the `ts-node-api` project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install project dependencies using Yarn.

   ```shell
   yarn install
   ```


## Scripts

1. **yarn check:lint**
   - Runs ESLint to lint TypeScript and JavaScript files.
   - The `--fix` flag attempts to automatically fix linting issues.

2. **yarn check:prettier**
   - Uses Prettier to check code formatting within the `src` directory.
   - Ensures files adhere to defined Prettier rules.

3. **yarn test:unit**
   - Runs unit tests using the `vitest` test runner.
   - Tests are located in the `src` directory.

4. **yarn check:all**
   - Groups linting, formatting checks, and unit tests.
   - Runs ESLint, Prettier, and `vitest` for comprehensive checks.

5. **yarn check:syntax**
   - Runs linting and code formatting checks.
   - Excludes running unit tests.

6. **yarn test:e2e**
   - Runs end-to-end (E2E) tests using the `vitest` test runner.
   - Tests are located in the `tests` directory.

7. **yarn dev**
    - Uses `nodemon` to monitor changes to `index.ts`.
    - Automatically restarts the server during development.

8. **yarn prod**
    - Compiles TypeScript code using the TypeScript compiler (`tsc`).
    - Runs the compiled `index.js` in the `dist` directory using Node.js.

These scripts contribute to maintaining code quality, automated testing, and facilitating development and production workflows in the `ts-node-api` project.
