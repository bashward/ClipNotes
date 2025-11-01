# ClipNotes

Turn long YouTube videos into concise notes, highlights, and cheat sheets.

This repository is organized as a monorepo with a **frontend** web app and a **backend** API service.

## Repository Structure

```
ClipNotes/
├─ frontend/
│  ├─ public/
│  │  ├─ herodemo.png
│  │  ├─ icon.png
│  │  ├─ light.svg
│  │  └─ night.svg
│  └─ src/
│     ├─ app/
│     │  ├─ home/
│     │  │  ├─ CreateVideo.jsx
│     │  │  ├─ VideoCard.jsx
│     │  │  └─ VideoList.jsx
│     │  ├─ login/
│     │  │  └─ page.jsx
│     │  ├─ video/
│     │  │  └─ [videoId]/           # dynamic route for a specific video
│     │  ├─ globals.css
│     │  ├─ layout.js
│     │  └─ page.js                  # landing page
│     ├─ components/
│     │  ├─ theme/
│     │  │  ├─ ThemeProvider.jsx
│     │  │  └─ ThemeToggle.jsx
│     │  ├─ ui/
│     │  │  ├─ button.jsx
│     │  │  ├─ dialog.jsx
│     │  │  ├─ input.jsx
│     │  │  ├─ label.jsx
│     │  │  └─ spinner.jsx
│     │  ├─ Footer.jsx
│     │  ├─ Hero.jsx
│     │  ├─ Navbar.jsx
│     │  └─ Protected.jsx
│     ├─ context/
│     │  └─ authProvider.jsx
│     └─ lib/
│        ├─ firebase-init.js
│        ├─ useFirebaseAuth.js
│        └─ utils.js
│  ├─ components.json
│  ├─ eslint.config.mjs
│  ├─ jsconfig.json
│  ├─ next.config.mjs
│  ├─ package.json
│  ├─ postcss.config.js
│  └─ tailwind.config.js
│
├─ backend/
│  ├─ db/
│  │  ├─ operations.js
│  │  └─ schema-zod.js
│  ├─ lib/
│  │  ├─ getHighlightsAndCheatsheet.js
│  │  ├─ getMetadata.js
│  │  └─ getTranscript.js
│  ├─ modules/
│  ├─ plugins/
│  │  └─ mongo-init.js
│  ├─ routes.js
│  ├─ index.js                      # server entry
│  ├─ package.json
│  └─ package-lock.json
│
└─ README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start on the port configured by Next.js (commonly [http://localhost:3000](http://localhost:3000)).

### Backend

```bash
cd backend
npm install
node index.js
```

The API will start on the port configured in `index.js`.

> Note: Environment variables are intentionally not documented here. Add them yourself as needed.

## Backend API

All routes use a Firebase token pre-handler. Send an `Authorization: Bearer <ID_TOKEN>` header with each request.

Current routes (from `backend/routes.js`):

| Method | Path         | Description                                                                                                                    |
| -----: | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
|    GET | `/list`      | Returns the authenticated user’s saved video list.                                                                             |
|   POST | `/get_data`  | Processes a YouTube URL: fetches metadata + transcript, generates outputs, stores them, and adds the entry to the user’s list. |
|   POST | `/get_video` | Returns full video data for a given video identifier.                                                                          |
|   POST | `/add_name`  | Saves/updates the user’s display name.                                                                                         |

Request/response bodies map directly to the code in `routes.js`, `db/operations.js`, and the helper modules under `lib/`.

## Development Notes

* **Data flow:** the backend composes `getMetadata`, `getTranscript`, and `getHighlightsAndCheatsheet` to build the final stored document. Storage and lookups go through `db/operations.js`.
* **Frontend integration:** the UI calls these endpoints from the pages and components under `src/app/**` and `src/lib/**`.
* **Auth:** the frontend uses Firebase (see `src/lib/firebase-init.js` and `src/context/authProvider.jsx`). Backend verifies the Firebase token in a Fastify pre-handler.

## Contributing

1. Open an issue describing the change or fix.
2. Submit a focused PR with clear commit messages and any relevant notes.
3. Keep the README and in-code comments accurate if you touch public interfaces.

## License

MIT (unless otherwise stated in individual files).
