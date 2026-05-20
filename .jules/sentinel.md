## 2024-03-09 - @neondatabase/serverless Parameterized Queries Change
**Vulnerability:** The codebase is using `sql(query, params)` with `@neondatabase/serverless` which is no longer supported and throws a runtime error.
**Learning:** In newer versions of `@neondatabase/serverless`, calling `sql(query, params)` throws a TypeError: `This function can now be called only as a tagged-template function: sql\`SELECT \${value}\`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).`
**Prevention:** Always use `sql\`SELECT * FROM table WHERE col = \${val}\`` or `sql(query, params)` -> `sql(query, params)` is wrong, must use tagged templates or if dynamically building, `sql(query, params)` doesn't exist, we must use tagged templates `sql\`SELECT * FROM prospects WHERE status = \${status} ORDER BY overall_score DESC\``.

## 2024-05-20 - Environment Enumeration in Health Check
**Vulnerability:** Public-facing health check endpoint (`/api/health`) revealed the presence or absence of specific sensitive environment variables (`COMPOSIO_API_KEY`, `ANTHROPIC_API_KEY`).
**Learning:** Exposing configuration status of internal services, especially regarding API keys, allows attackers to enumerate the environment and potentially discover attack vectors. Configuration status should be verified internally, not exposed to users.
**Prevention:** Health checks should abstract away internal configuration details and only return general service availability statuses, rather than binary indicators for specific sensitive variables.
