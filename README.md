# crud-docker

A small Node.js (Express) CRUD app that stores notes in PostgreSQL, with a simple web page.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Status and app version |
| GET | `/api/notes` | List all notes |
| GET | `/api/notes/:id` | Get one note |
| POST | `/api/notes` | Create a note: `{"text": "hello"}` |
| PUT | `/api/notes/:id` | Update a note: `{"text": "changed"}` |
| DELETE | `/api/notes/:id` | Delete a note |

The web page at `/` lets you add, edit and delete notes.

## Configuration

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgres://user:pass@db:5432/mydb` |
| `APP_VERSION` | Optional version label shown by `/health` |

The app listens on port 3000 and creates the `notes` table on startup.
