## 2024-03-09 - @neondatabase/serverless Parameterized Queries Change
**Vulnerability:** The codebase is using `sql(query, params)` with `@neondatabase/serverless` which is no longer supported and throws a runtime error.
**Learning:** In newer versions of `@neondatabase/serverless`, calling `sql(query, params)` throws a TypeError: `This function can now be called only as a tagged-template function: sql\`SELECT \${value}\`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).`
**Prevention:** Always use `sql\`SELECT * FROM table WHERE col = \${val}\`` or `sql(query, params)` -> `sql(query, params)` is wrong, must use tagged templates or if dynamically building, `sql(query, params)` doesn't exist, we must use tagged templates `sql\`SELECT * FROM prospects WHERE status = \${status} ORDER BY overall_score DESC\``.

## 2024-05-21 - [API Route Missing Input Validation]
**Vulnerability:** The API route `PUT /api/prospects/[id]/status` accepted arbitrary string inputs for the `status` enum field without validation.
**Learning:** Always use `zod` schema parsing for incoming request bodies to enforce strict enum adherence before executing database updates.
**Prevention:** Centralize enum schemas and consistently apply validation middlewares or parser checks at the boundaries of all API handlers.
