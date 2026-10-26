# GITEGO Faycal – Personal Portfolio

A personal portfolio website with an admin dashboard, so every section of the site can be edited without touching code.

| Folder      | Stack                                   | Port |
| ----------- | --------------------------------------- | ---- |
| `frontend/` | React 18, Vite, Tailwind CSS v4, React Router | 5173 |
| `backend/`  | Node.js, Express, JWT auth, Multer uploads, JSON file storage | 5000 |

## Features

- Public site: hero, about, skills, experience, education & certifications, projects, contact form.
- Admin dashboard at `/admin`: edit every section, reorder items, upload photo / project images / CV (PDF), read contact messages, change password.
- Content is stored in `backend/data/portfolio.json`; messages in `backend/data/messages.json`; uploads in `backend/uploads/`.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env     # then edit .env (admin password + JWT secret)
npm install
npm run dev              # http://localhost:5000
```

On first start the admin account is created from `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`.
After that the (hashed) password lives in `data/auth.json` and can be changed from the dashboard.
To reset it, delete `data/auth.json` and restart the server.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

In development Vite proxies `/api` and `/uploads` to the backend, so no extra config is needed.

### 3. Log in

Open <http://localhost:5173/admin/login> and sign in with the credentials from `backend/.env`.

## API overview

| Method | Endpoint                   | Auth | Description                           |
| ------ | -------------------------- | ---- | ------------------------------------- |
| GET    | `/api/portfolio`           | no   | All portfolio content                 |
| GET    | `/api/portfolio/:section`  | no   | One section                           |
| PUT    | `/api/portfolio/:section`  | yes  | Replace one section                   |
| POST   | `/api/auth/login`          | no   | Returns a JWT                         |
| GET    | `/api/auth/me`             | yes  | Current admin                         |
| PUT    | `/api/auth/password`       | yes  | Change password                       |
| POST   | `/api/upload`              | yes  | Upload image / PDF (`file` field)     |
| POST   | `/api/messages`            | no   | Contact form submission               |
| GET    | `/api/messages`            | yes  | Inbox                                 |
| PATCH  | `/api/messages/:id`        | yes  | Mark read / unread                    |
| DELETE | `/api/messages/:id`        | yes  | Delete a message                      |

Sections: `profile`, `about`, `skills`, `experience`, `education`, `certifications`, `projects`, `settings`.

## Deploying

1. **Backend** – deploy the `backend/` folder to any Node host (Render, Railway, a VPS…). Set the env vars from `.env.example`, and set `CLIENT_ORIGIN` to your frontend URL. Make sure `data/` and `uploads/` are on persistent storage.
2. **Frontend** – create `frontend/.env` with `VITE_API_URL=https://your-backend-url`, run `npm run build`, and host the `dist/` folder on Vercel, Netlify, GitHub Pages, etc. Configure the host to serve `index.html` for all routes (SPA fallback) so `/admin` works on refresh.
