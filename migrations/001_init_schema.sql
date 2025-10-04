BEGIN;

-- Companies store organization level settings
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_currency VARCHAR(10) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users belong to companies and can have hierarchical relationships
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Employee')),
    manager_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id);

-- Approval rules configuring how expenses move through the workflow
CREATE TABLE IF NOT EXISTS approval_rules (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_manager_approver BOOLEAN DEFAULT FALSE,
    min_approval_percentage NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_rules_company_id ON approval_rules(company_id);

CREATE TABLE IF NOT EXISTS rule_approvers (
    id SERIAL PRIMARY KEY,
    rule_id INT NOT NULL REFERENCES approval_rules(id) ON DELETE CASCADE,
    approver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sequence INT,
    is_mandatory BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_rule_approvers_rule_id ON rule_approvers(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_approvers_approver_id ON rule_approvers(approver_id);

-- Expenses submitted by employees
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rule_id INT REFERENCES approval_rules(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    expense_date DATE NOT NULL,
    paid_by VARCHAR(100),
    remarks TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft','Waiting Approval','Approved','Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_rule_id ON expenses(rule_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- Individual approval actions per expense and approver
CREATE TABLE IF NOT EXISTS expense_approvals (
    id SERIAL PRIMARY KEY,
    expense_id INT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    approver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sequence INT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    decision VARCHAR(20) DEFAULT 'Pending' CHECK (decision IN ('Approved','Rejected','Pending')),
    comments TEXT,
    decided_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS uidx_expense_approvals_per_approver ON expense_approvals(expense_id, approver_id);

-- Receipt attachments with optional OCR text for faster review
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    expense_id INT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    ocr_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipts_expense_id ON receipts(expense_id);

COMMIT;
