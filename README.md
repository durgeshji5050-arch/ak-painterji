# AK Painters Professional — School ID Card Production v5

## What changed
- Redesigned Admin + School dashboards with a professional sidebar/topbar/card UI.
- School dashboard now has Single Student, Excel Bulk Upload and PDF Student List import workflows.
- Excel `.xlsx/.xls` is read in the browser with SheetJS CDN; CSV is also supported.
- Text-based PDF student lists can be imported in the browser with PDF.js CDN.
- Bulk records are stored against the logged-in school only.
- Admin ID Card Production screen lists all school records and supports approve/mark printed.
- Only `ADMIN` can open the final print/PDF page. School users have no print endpoint.
- Final card print page is sized to 56mm × 85.8mm and uses the browser Print / Save as PDF flow.

## Suggested Excel columns
`Student Name | Father Name | Class | Section | Roll No | Date of Birth`

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `AUTH_SECRET`.
2. `npm install`
3. `npx prisma db push`
4. `npm run db:seed`
5. `npm run dev` for local development, or `npm run build && npm run start` for a production test.

## Public/Vercel deployment
1. Push this project to a private GitHub repository.
2. Import the repository into Vercel as a Next.js project.
3. Add `DATABASE_URL` and a strong `AUTH_SECRET` under Vercel Environment Variables.
4. Deploy.
5. After the first deployment, initialize the production PostgreSQL database from a secure environment with `npx prisma db push` (or use Prisma Migrate when migrations are introduced).
6. Run the seed only for a controlled test/staging database. Do not use demo credentials in production.

The application is already configured for a public responsive website and server-backed web app; no existing menu or workflow has been removed.

The Excel/PDF browser import screens require the user's browser to be able to reach the SheetJS/PDF.js CDN URLs used by the import screen.
