# Jim Steel Garage Services – website

A rebuild of jimsteelgarages.co.uk.

| Part | Stack | Path |
|------|-------|------|
| Frontend | Next.js 16 (App Router, Cache Components), TypeScript, Tailwind v4 | `frontend/` |
| API & admin | Django 6, Django REST Framework, SQLite (swap for Postgres in prod) | `backend/` |

All content (business details, services, prices, page text, offers, videos) lives in Django and is
editable at `/admin`. Contact, estimate and call-back forms are saved as **Enquiries** in the admin
and emailed to the garage.

## Run locally

```bash
# 1. API (http://localhost:8000)
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_content        # loads all text/images from the old site
.venv/bin/python manage.py createsuperuser     # for /admin
.venv/bin/python manage.py runserver

# 2. Frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

`seed_content --reset` reloads the original content (it wipes content tables, not enquiries).

## API

| Endpoint | |
|---|---|
| `GET /api/site/` | Business details, hours, links, accreditations |
| `GET /api/services/` · `/api/services/<slug>/` | Services with sections and price packages |
| `GET /api/pages/<slug>/` | `home`, `about`, `cookie-policy` |
| `GET /api/promotions/` | Homepage offers |
| `GET /api/videos/?placement=home` | YouTube videos |
| `POST /api/enquiries/` | `kind`: `contact` / `quote` / `callback` (rate-limited, honeypot) |

## How content updates reach the site

Pages are prerendered and cached for an hour. When `NEXT_REVALIDATE_URL` and `REVALIDATE_SECRET`
are set in the backend env (same secret in the frontend), saving anything in the admin calls
`POST /api/revalidate` on the frontend so changes appear immediately.

## Third-party integrations kept from the old site

- **Online booking** – TechMan (`https://jimsteel.wsptm.com`) embedded on `/book`.
- **Service history** – TechMan portal, linked from `/service-history`.
- Old Joomla URLs (`/site/index.php/...`) 308-redirect to the new pages.

## Tests

```bash
cd backend && .venv/bin/python manage.py test
cd frontend && npm run lint && npm run build
```
