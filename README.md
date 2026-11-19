# My Ore launch page, on Payload

The My Ore landing page (Next.js) with a [Payload](https://payloadcms.com) CMS behind it.

- **Site:** `/`
- **CMS:** `/cms`
- **Waitlist signups:** stored in the CMS (Waitlist), exportable as CSV

## What the CMS controls

| Where in `/cms` | What it does |
| --- | --- |
| **Launch → Waitlist** | Every email that joined from the site. Search, add notes, delete, or click *Export all signups as CSV*. |
| **Content → Site content** | Hero text, waitlist form wording, FAQ, final call to action, page title, search description and share image. Saves go live straight away. |
| **Content → Media** | Uploaded images (for example the share image). |
| **Users** | CMS logins. |

The product demos and the other sections of the page are code, in `src/components/landing/`.

## Run it locally

```bash
cp .env.example .env        # then set PAYLOAD_SECRET (openssl rand -hex 32)
npm install --legacy-peer-deps
npm run dev                 # http://localhost:3000, CMS at /cms
```

The first time you open `/cms` it asks you to create the first admin user. The SQLite
database is created in `data/` automatically.

## Deploy with Docker

```bash
cp .env.example .env        # set SERVER_URL to your public https URL and a real PAYLOAD_SECRET
docker compose up -d --build
```

The site listens on port 3000. Put a reverse proxy in front for HTTPS, for example Caddy:

```
myore.example.com {
  reverse_proxy localhost:3000
}
```

Data lives in two Docker volumes: `myore-data` (the SQLite database, which holds the
waitlist) and `myore-media` (uploads). **Back these up.**
Database migrations run automatically when the server starts.

Visit `https://your-domain/cms` once to create the first admin user. Do that straight
after deploying, because whoever gets there first owns the CMS.

## Email (optional)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `EMAIL_FROM_ADDRESS` to enable:

- admin password reset emails
- a notification to `WAITLIST_NOTIFY_EMAIL` for each new signup

Without SMTP the server just logs these emails. The site never emails people who join the
waitlist: the page promises one email, at launch, which you send yourself from the CSV export.

## How the waitlist works

The form posts to `POST /api/waitlist/signup`. The waitlist collection itself is closed to
the public; that endpoint is the only way in. It validates the address, stores it
lower-cased, ignores duplicates without revealing that they exist, has a hidden spam trap,
and limits each IP address to 8 attempts a minute (it reads `X-Forwarded-For`, which Caddy
sets).

## Changing the database

This uses SQLite on a volume, which is plenty for a launch page. To move to Postgres, swap
`@payloadcms/db-sqlite` for `@payloadcms/db-postgres` in `src/payload.config.ts`, set
`DATABASE_URI` and regenerate the migration with `npm run migrate:create`.

## If you change the CMS fields

After editing a collection or global in `src/`, run:

```bash
npm run generate:types
npm run migrate:create       # commit the new file in src/migrations/
```
