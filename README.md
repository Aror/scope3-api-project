# Scope3 Take Home Assessment

### Implementation Highlights

Here is a summary of the work done for this assessment, ready for review:

- **Full Feature Set**: Implemented `/emissions/day`, `/emissions/week`, and `/emissions/month` with complete aggregation logic (high, low, average, total).
- **Performance**: Utilized `Promise.all` to fetch data in parallel for the week (7 calls) and month (~30 calls) endpoints, ensuring responses stay well under the 30s timeout.
- **Robust Validation**:
  - Implemented strictly typed Zod schemas.
  - Added specific validators to prevent future dates (returning 422) and ensure correct date formats.
- **Architecture**:
  - Refactored the monolithic router into modular files (`day.ts`, `week.ts`, `month.ts`).
  - Created a shared `formatter.ts` service to standardize response shapes across endpoints.
- **CI/CD**: API tests run automatically on every Pull Request using GitHub Actions.
- **Testing**: Added unit tests for all routes covering success paths, edge cases (future dates), and malformed inputs.

### Set Up

This project uses Bun, to install it, run:

```bash
curl -fsSL https://bun.com/install | bash # for macOS, Linux, and WSL
```

Install dependencies with:

```bash
bun install
```

Set up your environment variables:

```bash
cp .env.example .env
```

Then edit `.env` and add your Scope3 API key:

```
SCOPE3_API_KEY=your_actual_api_key
```

Run the project with:

```bash
bun run dev
```

This will start a watcher that will automatically rebuild the project when changes are made. Bun should automatically source the environment variables from `.env` on startup.

You can test everything is working by running the following CURL command:

```bash
curl http://localhost:3000/emissions/day?domain=yahoo.com&date=2025-08-04
```

You should see this as the response:

```
{"totalEmissions":0.276799780070073,"domain":"yahoo.com","date":"2025-08-04"}
```

Please read the [Assessment](./ASSESSMENT.md) file for further instructions.
