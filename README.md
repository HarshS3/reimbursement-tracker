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
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_manager_approver BOOLEAN DEFAULT FALSE,
    min_approval_percentage NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rule_approvers (
    id SERIAL PRIMARY KEY,
    rule_id INT REFERENCES approval_rules(id) ON DELETE CASCADE,
    approver_id INT REFERENCES users(id) ON DELETE CASCADE,
    sequence INT,
    is_mandatory BOOLEAN DEFAULT FALSE
);
```

### Expenses
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES users(id) ON DELETE CASCADE,
  rule_id INT REFERENCES approval_rules(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    expense_date DATE NOT NULL,
    paid_by VARCHAR(100),
    remarks TEXT,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Draft','Waiting Approval','Approved','Rejected')) DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Expense Approvals
```sql
CREATE TABLE expense_approvals (
    id SERIAL PRIMARY KEY,
    expense_id INT REFERENCES expenses(id) ON DELETE CASCADE,
    approver_id INT REFERENCES users(id) ON DELETE CASCADE,
  sequence INT,
  is_mandatory BOOLEAN DEFAULT FALSE,
    decision VARCHAR(20) CHECK (decision IN ('Approved','Rejected','Pending')) DEFAULT 'Pending',
    comments TEXT,
    decided_at TIMESTAMP
);
```

### Receipts (OCR Support)
```sql
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    expense_id INT REFERENCES expenses(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    ocr_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Surface (High-Level)

### Auth
- `POST /auth/signup` – Create a company and admin user.
- `POST /auth/login` – JWT-based login.
- `POST /auth/forgot-password` – Initiate password reset flow.

#### `POST /api/auth/signup`

Creates a new company and its first admin user. Both the company ID and user ID are generated automatically by the database.

**Request body**

```json
{
  "companyName": "Acme Corp",
  "baseCurrency": "USD",
  "country": "United States",
  "adminName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Sup3rSecret!"
}
```

**Response snapshot**

```json
{
  "success": true,
  "company": {
    "id": 1,
    "name": "Acme Corp",
    "baseCurrency": "USD",
    "country": "United States",
    "createdAt": "2025-10-04T12:00:00.000Z"
  },
  "user": {
    "id": 1,
    "companyId": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "Admin",
    "managerId": null,
    "createdAt": "2025-10-04T12:00:00.000Z"
  },
  "token": "<JWT>"
}
```

### Users (Admin only)
- `POST /users` – Create employees or managers.
- `PATCH /users/:id` – Update role or manager assignment.
- `GET /users` – List company users.

### Approval Rules (Admin only)
- `POST /rules` – Create approval rules.
- `POST /rules/:id/approvers` – Assign approvers to a rule.
- `GET /rules` – List rules.

### Expenses (Employee)
- `POST /expenses` – Submit new expense or save draft.
- `PATCH /expenses/:id` – Update draft expenses.
- `GET /expenses` – List employee expenses.

### Approvals (Manager/Admin)
- `GET /approvals` – View pending approvals for the logged-in user.
- `PATCH /approvals/:id` – Approve/reject with comments.

## API Reference

All endpoints are prefixed with `/api`. Authenticated routes expect a `Bearer <token>` header.

| Method & Path | Auth | Roles | Description |
|---------------|------|-------|-------------|
| `POST /api/auth/signup` | No | – | Create company + admin user, returns JWT. |
| `POST /api/auth/login` | No | – | Login and receive JWT. |
| `POST /api/auth/forgot-password` | No | – | Initiate reset flow (stub implementation). |
| `GET /api/users` | Yes | Admin | List company users. |
| `POST /api/users` | Yes | Admin | Create employee or manager. |
| `PATCH /api/users/:id` | Yes | Admin | Update role, name, or manager. |
| `GET /api/rules` | Yes | Admin | List approval rules with approvers. |
| `POST /api/rules` | Yes | Admin | Create approval rule. |
| `POST /api/rules/:id/approvers` | Yes | Admin | Replace approver assignments for a rule. |
| `GET /api/expenses` | Yes | Employee/Manager/Admin | List expenses visible to requester (own/team/company). |
| `POST /api/expenses` | Yes | Employee/Admin | Create new expense (draft or submit for approval). |
| `GET /api/expenses/:id` | Yes | Employee/Manager/Admin | Retrieve expense details with receipts and approval trail. |
| `PATCH /api/expenses/:id` | Yes | Employee/Admin | Update draft, receipts, or submit for approval. |
| `GET /api/approvals` | Yes | Manager/Admin | List pending approvals assigned to user. |
| `PATCH /api/approvals/:id` | Yes | Manager/Admin | Approve or reject an expense. |

## Workflow Example

1. **Signup** – Company "ABC Corp" (base currency USD) with Admin Mark.
2. **Admin adds roles** – Sarah (Manager), John (Employee, `manager_id = Sarah`).
3. **Rule definition** – "Misc Expenses" with approvers Sarah (sequence 1) and Mark (sequence 2).
4. **Expense submission** – John submits €200 marked `Waiting Approval`.
5. **Approval tasks** – Sarah and Mark receive pending approvals.
6. **Manager approval** – Sarah approves; expense remains `Waiting Approval` pending Mark.
7. **Final approval** – Mark approves; expense transitions to `Approved`.

## Tech Stack

- **Runtime:** Node.js (Express)
- **Database:** PostgreSQL
- **Auth:** JWT
- **External APIs:**
  - Country & currency lookup – `https://restcountries.com/v3.1/all?fields=name,currencies`
  - FX conversion – `https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}`

## Project Structure

```
├── migrations/
│   ├── 000_create_database.sql
│   └── 001_init_schema.sql
├── src/
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   ├── db/
│   │   └── pool.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── routes/
│   │   └── index.js
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── package.json
```

## Getting Started

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP port for the API server. | `4000` |
| `NODE_ENV` | Node environment string. | `development` |
| `DATABASE_URL` | PostgreSQL connection string. Required for DB access. | _(empty)_ |
| `JWT_SECRET` | Secret used to sign JWT access tokens. | _(none)_ |

### Setup Steps

1. **Install dependencies**
  ```bash
  npm install
  ```
2. **Configure environment**
  - Copy `.env.example` to `.env` and fill in values (database URL & JWT secret are required for full functionality).
3. **Provision database**
  ```bash
  psql -h <host> -U <username> -f migrations/000_create_database.sql
  psql -d ClaimDoo -f migrations/001_init_schema.sql
  psql -d ClaimDoo -f migrations/002_add_company_country.sql
  ```
  4. **Ensure PostgreSQL is running** – start your database server locally or ensure the remote instance is reachable from the machine running the API.
  5. **Run migrations programmatically (optional)** – use the provided script (skips `000_create_database.sql`) or run the SQL manually:
  ```bash
  npm run migrate
  ```
  6. **Start the API**
  ```bash
  npm run dev
  ```
  7. **Health check** – open `http://localhost:4000/api/health` to confirm the service is live. The server logs a warning if the database is unreachable at startup; database-backed routes will fail until connectivity is restored.

## Next Steps

- Integrate secure file storage for receipts (S3, Azure Blob, etc.) and connect OCR pipeline.
- Wire up currency conversion service at approval time to display totals in base currency.
- Add automated tests (unit + integration) and CI workflow.
- Consider audit logging and notifications (email/slack) for approval events.

This specification should give GitHub Copilot or any developer complete context to begin implementing the backend services quickly.
