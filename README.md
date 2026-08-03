# أمتي تقرأ | Ummah Reads

Foundation for a production-grade RTL reading competition platform.

## Included

- Next.js App Router scaffold
- Arabic-first, luxurious landing page and auth screens
- Role-based dashboard shells for Owner, Manager, and Supervisor
- Prisma schema for users, centers, students, and books
- Seed data with pending and approved supervisor flows
- Middleware-based route protection helpers

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies.
3. Run `prisma generate` and `prisma db seed`.
4. Start the app with `npm run dev`.

## Notes

- The Prisma schema is normalized for SQLite-first local development and maps cleanly to Supabase-style relational tables.
- Firebase compatibility is preserved at the domain-model level through the shared TypeScript types in `src/lib/types.ts`.