# GITEGO Faycal – Personal Portfolio

A personal portfolio website with an admin dashboard, so every section of the site can be edited without touching code.

| Folder      | Stack                                                        | Port |
| ----------- | ------------------------------------------------------------ | ---- |
| `frontend/` | React 18, Vite, Tailwind CSS v4, React Router                | 5173 |
| `backend/`  | Node.js, Express, JWT auth, Multer uploads                   | 5000 |

## Features

- Public site: hero, about, skills, experience, education & certifications, projects, contact form.
- Admin dashboard at `/admin`: edit every section, reorder items, upload photo / project images / CV (PDF), read contact messages, change password.
- Storage adapts to where it runs:
  - **Local development**: JSON files in `backend/data/` and files in `backend/uploads/`.
  - **Vercel**: content in Upstash Redis, uploads in Vercel Blob (both free tiers from the Vercel marketplace).

## Run locally

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

## Deploy to Vercel

You will create **two Vercel projects** from the same GitHub repository: one for the backend, one for the frontend.

### Step 0 – Push the code to GitHub

```bash
git add .
git commit -m "Portfolio website with admin dashboard"
git push
```

### Step 1 – Deploy the backend

1. In Vercel click **Add New → Project**, import this repository.
2. Set **Root Directory** to `backend`. Leave Framework Preset as "Other". Name the project e.g. `portfolio-api`.
3. Under **Environment Variables** add:

   | Name                    | Value                                                      |
   | ----------------------- | ---------------------------------------------------------- |
   | `JWT_SECRET`            | a long random string (e.g. run `openssl rand -hex 32`)     |
   | `ADMIN_USERNAME`        | your admin username                                        |
   | `ADMIN_PASSWORD`        | your admin password (only used to create the account once) |
   | `CLIENT_ORIGIN`         | `https://placeholder.vercel.app` (you will update this in step 3) |
   | `ALLOW_VERCEL_PREVIEWS` | `true`                                                     |

4. Click **Deploy** (the first deploy will fail health checks until storage is added, that is fine).
5. Open the project → **Storage** tab → **Create Database**:
   - **Upstash → Redis** (free plan) → Connect to the project. Vercel adds the connection variables automatically; the backend accepts either `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, so no renaming is needed.
   - **Blob** (free plan) → choose **Public** access (this cannot be changed later; a private store will not work because images must be viewable by URL) → create it → in the store's **Projects** tab click **Connect to Project** and pick the backend project. This adds `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID`.
6. Go to **Deployments** → latest deployment → **Redeploy** so the new variables are picked up.
7. Open `https://<your-backend>.vercel.app/api/health`. You should see `{"ok":true,"storage":"vercel"}`.

On first request the content from `backend/data/portfolio.json` is copied into Redis, so your site is already filled in.
Images that ship with the repo (`backend/uploads/`) are served by the backend; anything you upload from the dashboard goes to Vercel Blob.

### Step 2 – Deploy the frontend

1. **Add New → Project**, import the same repository again.
2. Set **Root Directory** to `frontend`. Framework Preset: **Vite**. Name it e.g. `gitego-faycal`.
3. Open `frontend/vercel.json` and replace `my-portifolio-nine-red.vercel.app` with your backend URL. This makes the website proxy `/api` and `/uploads` to the backend, so no `VITE_API_URL` variable is needed and there are no cross-origin requests.
   (Alternatively set the environment variable `VITE_API_URL` = `https://<your-backend>.vercel.app`; the website then calls the backend directly.)
4. **Deploy**.

### Step 3 – Allow the frontend to call the backend

1. In the **backend** project → Settings → Environment Variables, set `CLIENT_ORIGIN` to your frontend URL, e.g. `https://gitego-faycal.vercel.app`. Add your custom domain here too, comma separated, if you connect one.
2. Redeploy the backend.
3. Open your frontend URL and `/admin/login`. Log in, change the password under **Settings**, and you are live.

### Notes

- Uploads are limited to 4 MB per file on Vercel.
- To reset the admin password on Vercel, delete the key `portfolio:auth` in the Upstash console and redeploy; the account is recreated from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Every push to `main` redeploys both projects automatically.

## API overview

| Method | Endpoint                   | Auth | Description                           |
| ------ | -------------------------- | ---- | ------------------------------------- |
| GET    | `/api/health`              | no   | Health check + active storage         |
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
