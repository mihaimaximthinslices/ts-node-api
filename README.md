# ts-node-api

**Description:** A basic Node.js API built using TypeScript. This project includes TypeScript support, unit tests, pre-commit and pre-push hooks, linting, style checks, and more.

## Scripts

1. **check:lint**
   - Runs ESLint to lint TypeScript and JavaScript files.
   - The `--fix` flag attempts to automatically fix linting issues.

2. **check:prettier**
   - Uses Prettier to check code formatting within the `src` directory.
   - Ensures files adhere to defined Prettier rules.

3. **test:unit**
   - Runs unit tests using the `vitest` test runner.
   - Tests are located in the `src` directory.

4. **check:all**
   - Groups linting, formatting checks, and unit tests.
   - Runs ESLint, Prettier, and `vitest` for comprehensive checks.

5. **check:syntax**
   - Runs linting and code formatting checks.
   - Excludes running unit tests.

6. **test:e2e**
   - Runs end-to-end (E2E) tests using the `vitest` test runner.
   - Tests are located in the `tests` directory.

7. **dev**
    - Uses `nodemon` to monitor changes to `index.ts`.
    - Automatically restarts the server during development.

8. **prod**:
    - Compiles TypeScript code using the TypeScript compiler (`tsc`).
    - Runs the compiled `index.js` in the `dist` directory using Node.js.

These scripts contribute to maintaining code quality, automated testing, and facilitating development and production workflows in the `ts-node-api` project.
