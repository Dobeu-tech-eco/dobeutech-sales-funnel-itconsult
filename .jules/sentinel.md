## 2024-03-09 - @neondatabase/serverless Parameterized Queries Change
**Vulnerability:** The codebase is using `sql(query, params)` with `@neondatabase/serverless` which is no longer supported and throws a runtime error.
**Learning:** In newer versions of `@neondatabase/serverless`, calling `sql(query, params)` throws a TypeError: `This function can now be called only as a tagged-template function: sql\`SELECT \${value}\`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).`
**Prevention:** Always use `sql\`SELECT * FROM table WHERE col = \${val}\`` or `sql(query, params)` -> `sql(query, params)` is wrong, must use tagged templates or if dynamically building, `sql(query, params)` doesn't exist, we must use tagged templates `sql\`SELECT * FROM prospects WHERE status = \${status} ORDER BY overall_score DESC\``.

## 2025-05-22 - Pagination Missing on Database Endpoint
**Vulnerability:** The GET endpoint at `/api/surveys` (implemented in `src/app/api/surveys/route.ts`) was returning all survey responses without a limit. This exposes the backend to unbounded memory consumption and potential Denial of Service (DoS) attacks as data grows.
**Learning:** Next.js APIs fetching list resources need to manually enforce limits/offsets from query params to cap memory bounds safely, even if client apps don't currently support pagination. We also observed the need for `!isNaN` fallback handling after parsing query params using `parseInt`.
**Prevention:** Always ensure that `SELECT *` operations returning an unbounded set include a `LIMIT` clause with a strict maximum cap. Validate query parameters properly, handling `NaN` parsing effectively.
