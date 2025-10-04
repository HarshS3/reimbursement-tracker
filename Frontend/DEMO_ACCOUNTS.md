# ClaimDoo Demo Accounts

## Available Demo Accounts

### 1. Admin Account
- **Email:** admin@claimdoo.com
- **Password:** admin123
- **Role:** Administrator
- **Access:**
  - User Management (create/edit users, assign roles)
  - Approval Rules (create category-based approval workflows)
  - All Expenses view
  - Dashboard overview

### 2. Manager Account
- **Email:** manager@claimdoo.com
- **Password:** manager123
- **Role:** Manager
- **Access:**
  - Approve/reject expense requests
  - View team expenses
  - Approval queue management
  - Dashboard overview

### 3. Employee Account
- **Email:** sarah@claimdoo.com
- **Password:** employee123
- **Role:** Employee
- **Name:** Sarah Johnson
- **Department:** Engineering
- **Access:**
  - Submit expense requests with OCR receipt upload
  - View own expenses (Draft, Waiting Approval, Approved)
  - Track approval status
  - Dashboard overview

## Features by Role

### Admin Features:
1. **User Management** (`/dashboard/users`)
   - Create new users
   - Assign roles (Manager/Employee)
   - Assign managers to employees
   - Send password emails
   - Edit/delete users

2. **Approval Rules** (`/dashboard/approval-rules`)
   - Create category-based approval rules (Food, Travel, Accommodation, etc.)
   - Set approval workflow (sequential/parallel)
   - Define minimum approval percentage
   - Assign approvers and managers
   - Edit/delete rules

3. **All Expenses View**
   - View all company expenses
   - Filter by status, category, employee
   - Export reports

### Manager Features:
1. **Approval Queue**
   - Review pending expense requests
   - Approve/reject with comments
   - View expense details and receipts
   - Track approval history

2. **Team Expenses**
   - View all team member expenses
   - Monitor spending patterns
   - Generate team reports

### Employee Features:
1. **My Expenses** (`/dashboard/expenses`)
   - Upload receipt with OCR data extraction
   - Manual expense entry
   - View expense history
   - Track approval status (To Submit, Waiting Approval, Approved)
   - Save drafts
   - Submit for approval

2. **Expense Form Fields:**
   - Employee name
   - Description
   - Date
   - Category (Food, Travel, Accommodation, Office Supplies, Entertainment, Other)
   - Paid By (Self/Company)
   - Remarks
   - Amount
   - Receipt image (optional with OCR)

## Testing Workflow

1. **Login as Admin** → Create approval rules for different categories
2. **Login as Employee (Sarah)** → Upload receipt, submit expense for approval
3. **Login as Manager** → Review and approve Sarah's expense
4. **Login as Employee (Sarah)** → View approved expense with status updated

## Technical Features Demonstrated

- **OCR Receipt Processing:** Uses Tesseract.js to extract text from receipt images
- **Category-Based Approval:** Different approval workflows for different expense types
- **Multi-Level Approval:** Sequential or parallel approval with minimum percentage
- **Status Tracking:** Draft → To Submit → Waiting Approval → Approved/Rejected
- **Role-Based Access Control:** Different dashboards and features for each role
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **3D Spline Integration:** Interactive 3D backgrounds on landing and auth pages
- **Glassmorphic UI:** Modern, luxury design with frosted glass effects
