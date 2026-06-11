# DevNexus — Project Overview

> Living documentation for developers and automated systems. Last updated: June 2026.

**DevNexus** is a personal project-management web app. Authenticated users can manage projects, todos, standalone notes, and a Trello-style kanban board. The backend is entirely **Supabase** (auth + PostgreSQL); there is no custom Node server. The only server-side code is a **Netlify serverless function** for sending email via Gmail.

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19 + TypeScript |
| Build tool | Vite 7 |
| Routing | React Router v7 |
| Server state | TanStack React Query v5 |
| Backend / DB | Supabase (Auth + Postgres) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Icons | Lucide React |
| Deployment | Netlify (static SPA + serverless functions) |
| Email | Nodemailer via Netlify function |

---

## High-Level Architecture

```
Browser (React SPA)
  ├── App.tsx
  ├── AuthProvider
  ├── React Query hooks
  └── Pages & Components
        │
        ├──► Supabase (Auth API + PostgreSQL)
        │
        └──► Netlify send-email function ──► Gmail SMTP

Netlify hosts:
  ├── dist/ (built SPA)
  └── netlify/functions/send-email.ts
```

**Data flow:**

1. `main.tsx` mounts the React app into `#root`.
2. `App.tsx` wraps everything in providers (React Query, auth, dark mode, router).
3. Pages call hooks from `src/api/querysApi.tsx` and `src/api/mutationsApi.tsx`.
4. Those hooks talk directly to Supabase via `src/supabase/supabaseClient.ts`.
5. Email is the exception: `EmailSender` POSTs to `/v1/functions/send-email`, which runs on Netlify and uses Gmail credentials from environment variables.

---

## Directory Structure

```
project-management-app/
├── index.html              # SPA entry HTML
├── vite.config.ts          # Vite + Tailwind + @ alias
├── netlify.toml            # Netlify build & dev config
├── netlify/functions/      # Serverless functions
│   └── send-email.ts
├── public/                 # Static assets + SPA redirects
│   └── _redirects          # SPA fallback (/* → /index.html 200)
└── src/
    ├── main.tsx            # React bootstrap
    ├── App.tsx             # Routes + global providers
    ├── api/                # React Query hooks (data layer)
    │   ├── querysApi.tsx   # useQuery hooks
    │   └── mutationsApi.tsx # useMutation hooks
    ├── supabase/           # Supabase client
    │   └── supabaseClient.ts
    ├── context/            # Auth + dark mode
    │   ├── AuthProvider.tsx
    │   └── DarkModeContext.tsx
    ├── services/           # Auth helpers, route guards, email reset
    │   ├── authService.ts
    │   ├── PrivateRoute.tsx
    │   ├── GuestRoute.tsx
    │   └── sendPasswordResetEmail.ts
    ├── pages/              # Route-level screens
    │   ├── Home.tsx
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── ForgotPassword.tsx
    │   ├── ResetPassword.tsx
    │   ├── Notes.tsx
    │   └── TrelloDashboard.tsx
    ├── components/         # Reusable UI + feature components
    │   ├── ui/             # shadcn/ui primitives
    │   ├── ProjectDetail.tsx
    │   ├── ProjectList.tsx
    │   ├── CreateProject.tsx
    │   ├── TodoList.tsx
    │   ├── SendMail.tsx
    │   └── EmailSender.tsx
    ├── layout/             # Dashboard shell (header + outlet)
    │   └── DashboardLayout.tsx
    ├── hooks/              # Custom hooks (toast)
    ├── types/              # TypeScript interfaces
    └── utils/              # Small helpers (dates, truncate, note types)
```

---

## Application Bootstrap & Providers

**Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`

`App.tsx` layers providers in this order:

1. **QueryClientProvider** — caches and syncs server data
2. **Toaster / Sonner** — two toast systems (Radix toast + Sonner)
3. **Router** — client-side routing
4. **AuthProvider** — current Supabase user + loading state
5. **DarkModeProvider** — `dark` class on `<html>`, persisted in `localStorage`

---

## Routing & Access Control

| Route | Guard | Purpose |
|-------|-------|---------|
| `/` | Private | Project list (home) |
| `/project/:id` | Private | Single project + todos + inline notes |
| `/notes` | Private | Standalone notes CRUD |
| `/trello` | Private | Kanban-style boards |
| `/login` | Guest | Login (redirect if already logged in) |
| `/register` | Guest | Registration |
| `/forgot-password` | Guest | Request password reset email |
| `/reset-password` | None | Password reset after Supabase email link |
| `*` | None | 404 placeholder |

**Route guards:**

- **PrivateRoute** (`src/services/PrivateRoute.tsx`) — shows loading spinner, redirects to `/login` if no user.
- **GuestRoute** (`src/services/GuestRoute.tsx`) — redirects authenticated users away from auth pages.
- **DashboardLayout** (`src/layout/DashboardLayout.tsx`) — sticky header (brand, dark mode, Trello/Notes nav, logout) + `<Outlet />` for child routes.

---

## Authentication

Supabase handles all auth. The client is configured in `src/supabase/supabaseClient.ts` with session persistence and auto token refresh.

**Environment variables (frontend):**

- `VITE_PROJECT_URL` — Supabase project URL
- `VITE_SUPERBASE_API_KEY` — Supabase anon key

**AuthProvider** (`src/context/AuthProvider.tsx`) on mount:

1. Calls `supabase.auth.getUser()` to restore session
2. Subscribes to `onAuthStateChange` for login/logout updates
3. Exposes `{ user, loading }` via `useAuth()`

**authService.ts** wraps:

- `signUp`, `signIn`, `signOut`, `getCurrentUser`

**Password reset** uses Supabase's built-in email flow (`src/services/sendPasswordResetEmail.ts`), redirecting to `https://trackproject-management.netlify.app/reset-password`.

---

## Features

### 1. Projects (main feature)

- **Home** (`/`) — lists user projects via `useProjects(userId)`, create via `CreateProject`, list via `ProjectList`.
- **ProjectDetail** (`/project/:id`) — full project view:
  - Edit title, description, tags, status
  - **Todos** with priority and completion
  - **Progress bar** auto-calculated when todos change (completed / total × 100)
  - Inline **notes** field stored on the `projects` row

**Supabase table:** `projects`

| Column | Type / notes |
|--------|----------------|
| `id` | string (UUID) |
| `user_id` | string — owner |
| `title` | string |
| `description` | string |
| `tags` | string[] |
| `notes` | string — inline project notes |
| `progress` | number (0–100) |
| `created_at` | timestamp |
| `estimation_date` | optional date |
| `status` | `pending` \| `in_progress` \| `finished` |

### 2. Todos (per project)

- Managed inside `ProjectDetail` via `TodoList`
- Linked by `project_id` and `user_id`
- Mutations in `mutationsApi.tsx` recalculate and update parent project `progress`

**Supabase table:** `todos`

| Column | Type / notes |
|--------|----------------|
| `id` | string |
| `title` | string |
| `priority` | `high` \| `medium` \| `low` |
| `completed` | boolean |
| `project_id` | string — FK to projects |
| `user_id` | string |
| `created_at` | timestamp |

### 3. Standalone Notes

- **Notes page** (`/notes`) — separate from project inline notes
- CRUD with modals (`NoteModal`, `NoteViewModal`, `DeleteConfirmModal`)
- Types defined in `src/utils/notesStorage.ts`

**Supabase table:** `notes`

| Column | Type / notes |
|--------|----------------|
| `id` | string |
| `user_id` | string |
| `title` | string |
| `content` | string |
| `created_at` | timestamp |
| `updated_at` | timestamp |

### 4. Trello-style Kanban

- **TrelloDashboard** (`/trello`) — projects → boards → tasks with drag-and-drop
- On create, a project gets 3 default boards: **"To Do"**, **"In Progress"**, **"Done"**
- `querysApi.tsx` assembles nested structure client-side via `assembleTrelloProjects()`

**Supabase tables:**

| Table | Purpose |
|-------|---------|
| `trello_projects` | Top-level kanban projects |
| `boards` | Columns per project (`position` for ordering) |
| `tasks` | Cards per board (`board_id`, `position`) |

### 5. Email (admin-only in UI)

- `SendMail` button in `DashboardLayout` only shows for hardcoded `MAIN_USER_ID`
- Opens dialog with `EmailSender`, which POSTs to Netlify function
- Function: `netlify/functions/send-email.ts`
- Uses Gmail via `GMAIL_USER` and `GMAIL_APP_PASSWORD` env vars on Netlify
- Custom path: `/v1/functions/send-email` (proxied in dev via `vite.config.ts`)

---

## Data Layer Pattern

The app uses **React Query hooks** instead of scattering Supabase calls in components.

| File | Role |
|------|------|
| `src/api/querysApi.tsx` | `useQuery` hooks: `useProjects`, `useGetProject`, `useTodos`, `useNotes`, `useTrelloProjects` |
| `src/api/mutationsApi.tsx` | `useMutation` hooks for all create/update/delete operations |

Each mutation invalidates relevant query keys on success so lists stay in sync.

**Example flow on Home:**

```
useAuth() → user.id
  → useProjects(user.id)
    → supabase.from("projects").select("*").eq("user_id", userId)
      → cached in React Query under ["projects", userId]
```

**Query keys in use:**

| Key | Data |
|-----|------|
| `["projects", userId]` | User's project list |
| `["projects", projectId]` | Single project |
| `["todos", projectId, userId]` | Todos for a project |
| `["notes", userId]` | User's standalone notes |
| `["trello_projects", userId]` | Assembled Trello data |

---

## UI & Styling

- **shadcn/ui** components in `src/components/ui/` (Button, Card, Dialog, Input, etc.)
- Configured via `components.json` with `@/` path aliases
- **Tailwind v4** via `@tailwindcss/vite` plugin
- **Dark mode** toggles `dark` class on `<html>`; components use Tailwind `dark:` variants
- **Lucide** icons throughout
- App title / brand: **DevNexus**

---

## Build & Deployment

### Scripts (`package.json`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server on port **8080** |
| `npm run build` | `tsc -b && vite build` → `dist/` |
| `npm run preview` | Preview production build on port 5173 |
| `npm run lint` | ESLint |

### Local development

```bash
npm install
npm run dev          # Vite on port 8080

# OR with Netlify functions (email):
netlify dev          # Proxies Vite (8080) + functions (8888)
```

`vite.config.ts` proxies `/v1/functions` → `localhost:8888` so the email function works locally with Netlify Dev.

### Production (Netlify)

**`netlify.toml`:**

- Build: `npm run build`
- Publish: `dist/`
- Functions: `netlify/functions/`
- Dev: Vite on 8080, Netlify on 8888

**SPA routing:** `public/_redirects` sends all paths to `index.html` (200 rewrite).

**Deployed URL:** `https://trackproject-management.netlify.app`

---

## Environment Variables

No `.env` file is committed (gitignored). Required variables:

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_PROJECT_URL` | Frontend (Vite) | Supabase project URL |
| `VITE_SUPERBASE_API_KEY` | Frontend (Vite) | Supabase anon key |
| `GMAIL_USER` | Netlify function | Gmail account |
| `GMAIL_APP_PASSWORD` | Netlify function | Gmail app password |

---

## TypeScript Types

Defined in `src/types/index.ts`:

- `Project`, `Todo`, `Note` (via `notesStorage.ts`)
- `ProjectStatus`, `PriorityLevel`
- Trello: `ProjectStruct`, `Board`, `Task`, `TrelloProjectRow`, `TrelloBoardRow`, `TrelloTaskRow`
- Update inputs: `UpdateProjectInput`, `UpdateTodoInput`, `UpdateNoteInput`, `UpdateTrelloProjectInput`

---

## Notable Design Choices

1. **No custom backend** — Supabase is the API; React Query is the client cache layer.
2. **Two "notes" concepts** — project-level notes (string on `projects`) vs standalone notes (`notes` table).
3. **Two project systems** — classic projects (`projects` + `todos`) vs Trello projects (`trello_projects` + `boards` + `tasks`).
4. **Email is isolated** — only server-side code; UI restricted to one hardcoded admin user ID in `DashboardLayout`.
5. **README.md** contains Supabase CRUD code snippets; this file is the architecture reference.

---

## Setup Checklist

1. Create a Supabase project with tables listed above (and RLS policies scoped per `user_id`).
2. Add `VITE_PROJECT_URL` and `VITE_SUPERBASE_API_KEY` to a local `.env`.
3. Run `npm install` then `npm run dev` (or `netlify dev` for email testing).
4. For email in production, set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in the Netlify dashboard.
5. Configure Supabase auth redirect URLs to include `/reset-password` on your deployed domain.

---

## Connection Map (Summary)

```
index.html
  └── main.tsx
        └── App.tsx
              ├── QueryClientProvider
              ├── AuthProvider ──────────► supabaseClient
              ├── DarkModeProvider
              └── Router
                    ├── GuestRoute → Login / Register / ForgotPassword
                    ├── ResetPassword
                    └── PrivateRoute
                          └── DashboardLayout
                                ├── Home ──────────► querysApi / mutationsApi ──► Supabase (projects)
                                ├── ProjectDetail ─► querysApi / mutationsApi ──► Supabase (projects, todos)
                                ├── Notes ─────────► querysApi / mutationsApi ──► Supabase (notes)
                                └── TrelloDashboard ► querysApi / mutationsApi ──► Supabase (trello_*)
                                └── SendMail (admin) ► EmailSender ──► Netlify function ──► Gmail
```
