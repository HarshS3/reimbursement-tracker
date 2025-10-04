# Claimdoo — Expense & Claims Management

Claimdoo is a full-stack expense and claims management application. This repository includes two main parts:

- `Backend/` — Node.js + Express API built to work with PostgreSQL using plain SQL migrations and a connection pool.
- `Frontend/` — Vite + React frontend application that consumes the backend API.

This README walks through repository layout, local setup, migrations, running the app, troubleshooting, and next steps for contributors.

## Table of contents

- Project structure
- Requirements
- Backend
  - Environment variables
  - Install dependencies
  - Running migrations
  - Start server
- Frontend
  - Environment variables
  - Install dependencies
  - Start dev server
- Running the full stack (dev)
- Testing & health checks
- Deployment notes
- Contributing
- License

---

## Project structure

Top-level layout:

```
.
├─ .env                 # Optional project-wide environment file
├─ Backend/
│  ├─ migrations/       # Ordered SQL migration files (000_..., 001_..., ...)
│  └─ src/
│     ├─ app.js         # Express app configuration
│     ├─ server.js      # Entrypoint
│     ├─ config/env.js  # Environment helpers
│     ├─ db/
│     │  ├─ pool.js     # Postgres connection pool
│     │  └─ transaction.js
│     ├─ controllers/
│     ├─ services/
│     ├─ routes/
│     ├─ middlewares/
│     └─ scripts/
│        └─ runMigrations.js
└─ Frontend/
   ├─ index.html
   ├─ package.json
   └─ src/
      ├─ api/client.js  # Axios/fetch client configured to talk to backend
      ├─ pages/
      ├─ components/
      └─ contexts/
```

The backend is organized in a familiar Express MVC-style layout with migration SQL files to provision the database schema.

---

## Requirements

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (local or hosted) — the migrations are written for Postgres
- Optional: Docker (for running Postgres locally)

---

## Backend

The backend lives in `Backend/` and expects a Postgres database. It uses a connection pool (`src/db/pool.js`) and includes migration SQL files in `Backend/migrations/`.

### Environment variables (Backend)

Create a `Backend/.env` or set environment variables in your shell. Important variables:

```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://<user>:<password>@<host>:5432/<db_name>
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

Notes:
- `DATABASE_URL` is used by `src/db/pool.js` to connect to Postgres. Adjust host, port, user, and password accordingly.

### Install dependencies

```powershell
cd Backend
npm install
```

### Run migrations

There are SQL migration files in `Backend/migrations/`. You can run them manually with `psql` or use the provided Node.js runner.

Programmatic runner (recommended for convenience in dev):

```powershell
cd Backend
node src/scripts/runMigrations.js
```

This script executes the migration SQL files (in order) against the `DATABASE_URL` configured in your environment.

### Start the backend

```powershell
cd Backend
npm run start
# or for development with auto-reload (if dev script exists)
npm run dev
```

The API base path is `/api`. Check `src/routes/index.js` to view all registered routes.

---

## Frontend

The frontend is a Vite + React app located in `Frontend/`. It communicates with the backend API via `src/api/client.js`.

### Environment variables (Frontend)

Create `Frontend/.env` (Vite loads variables prefixed with `VITE_`):

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Make sure the `VITE_API_BASE_URL` matches your backend URL.

### Install dependencies and start

```powershell
cd Frontend
npm install
npm run dev
```

The frontend dev server will usually run on `http://localhost:5173`.

---

## Running the full stack (dev)

Quick example using Docker to run Postgres:

```powershell
# Run Postgres container for development
docker run -e POSTGRES_PASSWORD=example -e POSTGRES_DB=claimdoo_dev -p 5432:5432 -d postgres:15

# In Backend/ set DATABASE_URL to postgres://postgres:example@localhost:5432/claimdoo_dev
# Run migrations
cd Backend
node src/scripts/runMigrations.js
# Start backend
npm run start

# In a new terminal start frontend
cd Frontend
npm run dev
```

Visit the frontend at `http://localhost:5173` and interact with the UI. The UI will call backend endpoints using `VITE_API_BASE_URL`.

---

## Health checks & testing

- The backend exposes health/diagnostic endpoints (look for `/api/health` or similar in `src/routes`).
- Use Postman or curl to test endpoints and JWT-protected routes. Example login request:

```powershell
curl -X POST "http://localhost:4000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"demo@example.com","password":"password"}'
```

---

## Deployment notes

- Use CI/CD to run migrations before starting the backend service in production.
- Do not commit secrets — rely on environment variables or secret managers.
- Consider storing receipts in an object storage (S3, Azure Blob) and saving file URLs to the DB.

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Open an issue for non-trivial changes.
2. Create a feature branch and target it with a pull request.
3. For DB schema changes, add a migration SQL file in `Backend/migrations/` with a new incremental filename.

---

## Next steps / TODOs

- Add automated tests (unit + integration).
- Add CI pipeline to run migrations and tests.
- Add production-grade configuration for file storage and secrets management.

---

## License

This repository does not include a license. Add a LICENSE file to clarify usage terms.
# Expense Management System – Frontend Specification (Currently under Developement)
# Expense Management System – Backend Specification

## Overview

The Expense Management System helps companies manage employee expenses, reimbursement workflows, and configurable approval chains. It is built with Node.js, Express, and PostgreSQL. This document outlines the system specification and doubles as the project README for quick onboarding.

## Core Features

### Authentication & User Management

- **Signup**
  - Creates a new company record and an Admin user.
  - Sets the company base currency based on the selected country.
- **Roles**: Admin, Manager, Employee.
- **Admin Capabilities**
  - Create employees and managers.
  - Assign or change user roles.
  - Link employees to managers (`manager_id`).
  - Define approval rules and assign approvers.

### Expense Submission (Employee Role)

- Submit expenses with: Description, Date, Category, Paid By, Remarks, Amount, Currency, and associated approval rule.
- Attach receipt metadata (file URL + optional OCR text) for each expense line.
- Save as **Draft** or submit as **Waiting Approval**.
- View historical expenses (Approved / Rejected).
- Submit in any currency; final approval displays using the company’s base currency (conversion handled externally).

### Approval Workflow (Manager/Admin Role)

- Approval flow is driven by flexible rules:
  - **Sequential** – approvers act in a defined order.
  - **Percentage-based** – e.g., 60% of approvers must approve.
  - **Mandatory approver** – specific approvers (e.g., CFO) must approve.
  - **Hybrid** – combinations of the above models.
- Managers/Admins can view pending approvals assigned to them and approve or reject with comments.

### Expense Status Flow

- `Draft → Waiting Approval → Approved/Rejected`
- Status updates whenever approvers act and rule conditions are satisfied.
- Final status is stored directly on the `expenses` table.

### Role Permissions

| Role      | Capabilities |
|-----------|--------------|
| **Admin** | Create company (signup), manage users/roles, define approval rules, view all expenses, override approvals. |
| **Manager** | Approve or reject assigned expenses, view team expenses, escalate per rules. |
| **Employee** | Submit expenses, view personal expenses, track approval status. |

## Database Schema (PostgreSQL)

### Companies & Users
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Admin', 'Manager', 'Employee')) NOT NULL,
    manager_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Approval Rules
```sql
CREATE TABLE approval_rules (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    # Claimdoo — Expense & Claims Management

    Claimdoo is a full-stack expense and claims management application. This repository contains two main parts:

    - `Backend/` — Node.js + Express API, PostgreSQL-backed with ordered SQL migrations in `Backend/migrations/`.
    - `Frontend/` — Vite + React application that consumes the backend API.

    This README consolidates: project layout, database migrations, local setup, developer workflows, and a high-level API reference to help you get started.

    ---

    ## Quick start (dev)

    1. Start a Postgres instance (local or Docker).
    2. Configure `Backend/DATABASE_URL` environment variable.
    3. Run backend migrations and start the backend.
    4. Start the frontend dev server and open the UI in your browser.

    See the sections below for exact commands and notes.

    ---

    ## Project layout

    ```
    .
    ├─ .env                 # Optional project-wide environment file
    ├─ Backend/
    │  ├─ migrations/       # SQL migration files (000_..., 001_..., ...)
    │  └─ src/
    │     ├─ app.js
    │     ├─ server.js
    │     ├─ config/
    │     ├─ db/
    │     ├─ controllers/
    │     ├─ services/
    │     ├─ routes/
    │     ├─ middlewares/
    │     └─ scripts/runMigrations.js
    └─ Frontend/
       ├─ index.html
       ├─ package.json
       └─ src/
          ├─ api/client.js
          ├─ pages/
          ├─ components/
          └─ contexts/
    ```

    ---

    ## Prerequisites

    - Node.js (v18+ recommended)
    - npm or yarn
    - PostgreSQL (local or managed)
    - Optional: Docker (for Postgres in dev)

    ---

    ## Backend — setup & run

    1. Open a terminal and install dependencies:

    ```powershell
    cd Backend
    npm install
    ```

    2. Create a `.env` file for the backend (or export env vars). Required values:

    ```
    PORT=4000
    NODE_ENV=development
    DATABASE_URL=postgres://<user>:<password>@<host>:5432/<db_name>
    JWT_SECRET=your_jwt_secret_here
    JWT_EXPIRE=7d
    ```

    3. Run migrations (the repo includes migration SQL files in `Backend/migrations/`):

    ```powershell
    cd Backend
    node src/scripts/runMigrations.js
    ```

    The script executes SQL files against the `DATABASE_URL`. You may also run migrations manually with `psql`.

    4. Start the backend API:

    ```powershell
    cd Backend
    npm run start
    # or in development (if a dev script exists):
    npm run dev
    ```

    The API prefix is `/api`. Confirm the server is running with the health endpoint (if present), e.g. `http://localhost:4000/api/health`.

    ---

    ## Frontend — setup & run

    1. Install dependencies and start the dev server:

    ```powershell
    cd Frontend
    npm install
    npm run dev
    ```

    2. Environment variable (Vite): create `Frontend/.env` and set:

    ```
    VITE_API_BASE_URL=http://localhost:4000/api
    ```

    Open `http://localhost:5173` (default Vite port) and verify the app can communicate with the backend.

    ---

    ## Run with Docker (Postgres example)

    ```powershell
    docker run -e POSTGRES_PASSWORD=example -e POSTGRES_DB=claimdoo_dev -p 5432:5432 -d postgres:15

    # set DATABASE_URL to: postgres://postgres:example@localhost:5432/claimdoo_dev
    cd Backend
    node src/scripts/runMigrations.js
    npm run start

    cd ../Frontend
    npm run dev
    ```

    ---

    ## Database & migrations

    SQL migrations live in `Backend/migrations/`. The recommended workflow for schema changes:

    1. Add a new SQL file with an incremental prefix (e.g. `004_add_new_table.sql`).
    2. Commit the migration and update any corresponding server logic.
    3. Ensure migrations run as part of your CI/CD or release process.

    ---

    ## High-level API reference

    All API endpoints are prefixed with `/api` and protected endpoints require a `Bearer <token>` JWT header.

    Auth
    - `POST /api/auth/signup` — create a company and admin user
    - `POST /api/auth/login` — return JWT

    Users (admin)
    - `GET /api/users` — list users
    - `POST /api/users` — create user
    - `PATCH /api/users/:id` — update user

    Rules (admin)
    - `GET /api/rules` — list approval rules
    - `POST /api/rules` — create rule
    - `POST /api/rules/:id/approvers` — assign approvers

    Expenses (employee)
    - `POST /api/expenses` — create or submit expense
    - `PATCH /api/expenses/:id` — update draft
    - `GET /api/expenses` — list expenses

    Approvals (manager/admin)
    - `GET /api/approvals` — pending approvals
    - `PATCH /api/approvals/:id` — approve or reject

    Refer to the backend routes in `Backend/src/routes/` for exact definitions and input/output shapes.

    ---

    ## Health checks & testing

    - Use the backend health endpoint (if present) to confirm the server is running.
    - Use Postman or curl for API testing. Example login request:

    ```powershell
    curl -X POST "http://localhost:4000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"demo@example.com","password":"password"}'
    ```

    ---

    ## Deployment notes

    - Run database migrations during CI/CD or a pre-release step.
    - Keep secrets out of source control; use environment variables or secret stores.
    - For receipts and large files, use cloud object storage (S3/Azure Blob) and store URLs in the DB.

    ---

    ## Contributing

    - Open issues for proposed changes.
    - Create feature branches and include migration files for DB changes.

    ---

## 👥 Team

- **Parth Srivastava** - 23bce216@nirmauni.ac.in
- **Harsh Shah** - 23bce089@nirmauni.ac.in
- **Rudra Moradiya** - 23bce187@nirmauni.ac.in
- **Advait Pandya** - 23bce012@nirmauni.ac.in

---
