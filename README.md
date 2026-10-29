# myapp-api

A minimal Node.js (Express) REST API that stores notes in PostgreSQL.

- `GET /health` – status and version
- `GET /notes` – list notes
- `POST /notes` – add a note: `{"text": "hello"}`

Config: `DATABASE_URL` (PostgreSQL connection string), `APP_VERSION` (optional). Listens on port 3000.
