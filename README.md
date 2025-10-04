
# Claimdoo — Expense & Claims Management

Claimdoo is a full-stack expense and claims management application. This repository includes two main parts:

- `Backend/` — Node.js + Express API built to work with PostgreSQL using plain SQL migrations and a connection pool.  
- `Frontend/` — Vite + React frontend application that consumes the backend API.

---

## 📁 Table of Contents

- Project Structure  
- Requirements  
- Backend  
  - Environment Variables  
  - Install Dependencies  
  - Running Migrations  
  - Start Server  
- Frontend  
  - Environment Variables  
  - Install Dependencies  
  - Start Dev Server  
- Running the Full Stack (Dev)  
- Testing & Health Checks  
- Deployment Notes  
- Contributing  
- License  
- Team  

---

## 🧭 Project Structure

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

---

## ⚙️ Requirements

- Node.js (v18+ recommended)  
- npm or yarn  
- PostgreSQL (local or hosted)  
- Optional: Docker (for running Postgres locally)

---

## 🖥 Backend Specification

### Overview

The backend helps companies manage employee expenses, reimbursement workflows, and approval chains. It’s built using Node.js, Express, and PostgreSQL.

### Core Features

#### 🔐 Authentication & User Management
- Signup creates a **company record** and an **Admin user**.
- Roles: **Admin**, **Manager**, **Employee**.
- Admin can manage users, assign roles, and define approval rules.

#### 💸 Expense Submission (Employee)
- Submit expenses with details like description, date, category, remarks, amount, etc.
- Upload receipt metadata (file URL + OCR text).
- Save as **Draft** or submit as **Waiting Approval**.
- View historical expenses.

#### ✅ Approval Workflow (Manager/Admin)
- Supports multiple rule types:
  - Sequential approval
  - Percentage-based approval
  - Mandatory approvers
  - Hybrid rules
- Approvers can approve/reject with comments.

#### 🔁 Expense Status Flow
```
Draft → Waiting Approval → Approved / Rejected
```

#### 👥 Role Permissions

| Role | Capabilities |
|------|---------------|
| **Admin** | Manage users, roles, approval rules, and override approvals. |
| **Manager** | Approve/reject team expenses, escalate per rules. |
| **Employee** | Submit and view personal expenses. |

---

## 🗄 Database Schema (PostgreSQL)

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
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Sequential', 'Percentage', 'Mandatory', 'Hybrid')),
    config JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Quick Start (Development)

1. **Start Postgres** (local or Docker)
   ```bash
   docker run -e POSTGRES_PASSWORD=example -e POSTGRES_DB=claimdoo_dev -p 5432:5432 -d postgres:15
   ```

2. **Set environment variables**
   ```bash
   # Backend/.env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL=postgres://postgres:example@localhost:5432/claimdoo_dev
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   ```

3. **Run migrations**
   ```bash
   cd Backend
   node src/scripts/runMigrations.js
   ```

4. **Start backend**
   ```bash
   npm run start
   ```

5. **Frontend setup**
   ```bash
   cd ../Frontend
   npm install
   echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
   npm run dev
   ```

6. Visit:  
   - Frontend → http://localhost:5173  
   - Backend API → http://localhost:4000/api  

---

## 🧩 API Overview

All API routes are prefixed with \`/api\`.

**Auth**
- `POST /api/auth/signup` — create a company + admin user  
- `POST /api/auth/login` — login and get JWT  

**Users (Admin)**  
- `GET /api/users`  
- `POST /api/users`  
- `PATCH /api/users/:id`

**Approval Rules (Admin)**  
- `GET /api/rules`  
- `POST /api/rules`  
- `POST /api/rules/:id/approvers`

**Expenses (Employee)**  
- `POST /api/expenses`  
- `PATCH /api/expenses/:id`  
- `GET /api/expenses`

**Approvals (Manager/Admin)**  
- `GET /api/approvals`  
- `PATCH /api/approvals/:id`

---

## 🧪 Health Checks & Testing

- Backend exposes `/api/health`
- Example:
  ```bash
  curl -X POST "http://localhost:4000/api/auth/login" \\
       -H "Content-Type: application/json" \\
       -d '{"email":"demo@example.com","password":"password"}'
  ```

---

## 📦 Deployment Notes

- Run migrations before starting the app in production.  
- Use environment variables for secrets.  
- Use object storage (e.g., AWS S3) for receipts or large files.  

---

## 🤝 Contributing

1. Open an issue for non-trivial changes.  
2. Create a feature branch and submit a PR.  
3. For DB schema changes, add a new migration SQL file under \`Backend/migrations/\`.

---

## 🧑‍💻 Team

| Name | Email |
|------|--------|
| Parth Srivastava | 23bce216@nirmauni.ac.in |
| Harsh Shah | 23bce089@nirmauni.ac.in |
| Rudra Moradiya | 23bce187@nirmauni.ac.in |
| Advait Pandya | 23bce012@nirmauni.ac.in |

