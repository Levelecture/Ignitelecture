# Contributing

## Setup

1. Fork and clone
2. `bun install`
3. Copy `.env.example` to `.env`, then open and fill it in
4. Apply migrations to your database: `bun run db:migrate`
5. Start `bun run dev:local`

## Commands

```bash
bun install

bun run dev:local # Bun hot reload at http://localhost:3001
bun run dev # wrangler dev (Cloudflare runtime)

bun run db:generate
bun run db:migrate
bun run db:studio
```

## Database Workflow

Migration-based. Never run `db:push`.

1. Edit `src/lib/database/schema.ts`.
2. `bun run db:generate` → creates `drizzle/NNNN_*.sql`.
3. Commit the SQL file **and** `drizzle/meta/` together with the schema change.
4. `bun run db:migrate` to apply.

Drizzle tracks applied migrations in `drizzle.__drizzle_migrations` and decides what to run from each migration's timestamp in `drizzle/meta/_journal.json` — so the committed `drizzle/` folder must stay in sync with the schema.

**If a feature is cancelled before it ships, delete its migration.** Remove the generated `drizzle/NNNN_*.sql`, its `drizzle/meta/NNNN_snapshot.json`, and its entry in `_journal.json`. Never commit a migration for a feature that doesn't exist. If it was already applied to your database, undo it manually (e.g. `DROP TABLE` / revert the column) instead of generating a new migration.

If you inherit a database that was built with `db:push` (tables exist but the tracker is empty), baseline it once before migrating: for every migration already reflected in the DB, insert a row into `drizzle.__drizzle_migrations` with the SHA-256 `hash` of the `.sql` file and the `when` value from `_journal.json`, then run `bun run db:migrate`.

## Structure

```
src/
  index.ts                  entrypoint — CORS, auth handler, mounts module routes, /docs
  auth.ts                   Better Auth config
  lib/
    env.ts                  Zod-validated environment variables (throws if missing)
    database/
      index.ts              Neon + Drizzle client
      schema.ts             all tables, relations, indexes, CHECK constraints
  middleware/
    auth.middleware.ts      validates the session, sets c.get('user')
  modules/
    courses/                /api/courses
    assignments/            /api/assignments
    charts/                 /api/charts      (read-only aggregates)
    admin/                  /api/admin      (admin-only)
  doc/                      API reference for each module (one file per resource)
```

Every module folder follows the same three-file split:

| File                       | Contents                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| `<resource>.controller.ts` | Hono routes, `authMiddleware`, HTTP status codes. No DB queries. |
| `<resource>.service.ts`    | Drizzle queries, always scoped by `userId`. No HTTP concerns.    |
| `<resource>.schema.ts`     | Zod schemas + inferred types.                                    |

Keep that boundary. If a controller starts importing Drizzle, the query belongs in the service.

## Adding an API Module

1. Create `src/modules/<resource>/` with the three files above.
2. Mount it in `src/index.ts`:
   ```ts
   import <resource> from './modules/<resource>/<resource>.controller'
   app.route('/api/<resource>', <resource>)
   ```
3. Add the matching file in `src/doc/`.
4. Generate IDs with CUID2 (`@paralleldrive/cuid2`), not UUID.

## Conventions

- **Errors**: return `{ "error": "..." }` with the correct status code (`401` no session, `403` forbidden, `404` missing, `409` duplicate).
- **Duplicates**: catch unique constraint violations and return `409`, not `500`.
- **DB table names**: singular (`course`, `assignment`), following the Better Auth tables. Folders, route paths, exports, and commit scopes use plural (`courses/`, `/api/courses`).
- **Constraints**: enum-like status fields are enforced by PostgreSQL CHECK constraints; mirror them with matching Zod enums.
<!--- **No lint/typecheck/test scripts** are configured. Run `bunx tsc --noEmit` manually before opening a PR.-->

## Commit

Use [Conventional Commits](https://www.conventionalcommits.org/)

Scope = the module/folder name (plural), e.g. `courses`, `assignments`, `auth`.

Write the subject in the imperative, lowercase, no trailing period. Describe what changed.
