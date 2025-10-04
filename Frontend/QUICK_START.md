# 🚀 ClaimDoo - Quick Start Guide

## Getting Started in 3 Steps

### 1. **Start the Server**
```bash
npm run dev
```
Open browser to: **http://localhost:5173/** (or the port shown)

### 2. **Login with Demo Account**
Use any of these credentials:

**👨‍💼 Admin Access:**
- Email: `admin@claimdoo.com`
- Password: `admin123`

**👔 Manager Access:**
- Email: `manager@claimdoo.com`
- Password: `manager123`

**👤 Employee Access:**
- Email: `sarah@claimdoo.com`
- Password: `employee123`

### 3. **Explore Features**

#### As Employee (sarah@claimdoo.com):
1. Click **"My Expenses"** tab
2. Click **"Upload Receipt"** button
3. Upload any receipt image
4. Watch OCR extract the text
5. Fill in expense details
6. Click **"Submit for Approval"**

#### As Admin (admin@claimdoo.com):
1. Click **"User Management"** tab → Create users
2. Click **"Approval Rules"** tab → Create category-based rules
3. Select category, set approvers, save rule

---

## 📊 Demo Data

The **Employee Expenses** page includes pre-populated demo data showing:
- 3 expenses in different statuses
- Example of "To Submit" (draft)
- Example of "Waiting Approval" (submitted)
- Example of "Approved" (completed)

---

## 🎯 Core Features to Demo

### 1. OCR Receipt Upload
- Upload receipt image → OCR extracts text → Auto-fills form
- Works with JPG, PNG images

### 2. Category-Based Approval Rules
- Create rules for different categories (Food, Travel, etc.)
- Each category can have different approvers and workflows

### 3. Status Tracking
- **To Submit:** Draft expenses
- **Waiting Approval:** Submitted and pending
- **Approved:** Completed expenses

### 4. Role-Based Dashboards
- Different views for Admin, Manager, Employee
- Customized navigation for each role

---

## 🎨 Visual Highlights

- **3D Spline Background** on landing page
- **Glassmorphic Cards** throughout the app
- **Dark Blue Buttons** (#1e3a8a) for CTAs
- **Logo** (CD.jpeg) in navbar
- **Smooth Animations** with Framer Motion

---

## 📱 Pages to Visit

| Page | URL | What to See |
|------|-----|-------------|
| Landing | `/` | 3D Spline hero, features |
| About | `/about` | Team info (Nirma University students) |
| Sign In | `/signin` | Demo credentials shown, logo |
| Dashboard | `/dashboard` | Overview with stats |
| My Expenses | `/dashboard/expenses` | Employee expense submission (NEW) |
| Users | `/dashboard/users` | Admin user management |
| Approval Rules | `/dashboard/approval-rules` | Category-based rules (UPDATED) |

---

## ⚡ Quick Actions

### Create New Expense (Employee)
1. Login as sarah@claimdoo.com
2. Go to "My Expenses"
3. Click "New Expense" or "Upload Receipt"
4. Fill form and submit

### Create Approval Rule (Admin)
1. Login as admin@claimdoo.com
2. Go to "Approval Rules"
3. Click "Add New Rule"
4. Select category, fill details, save

### Create User (Admin)
1. Login as admin@claimdoo.com
2. Go to "User Management"
3. Click "Add New User"
4. Fill form, assign role, save

---

## 💡 Pro Tips

1. **OCR works best with clear receipt images** - good lighting, straight angle
2. **Category badges** appear on approval rule cards in purple
3. **Manager approval badges** appear in blue on rules
4. **Demo credentials** are shown on the sign-in page
5. **All mockup requirements** have been implemented

---

## 🎊 Ready to Demo!

The application is fully functional and ready for presentation. All features from the mockup images have been implemented:
- ✅ Employee expense view with OCR upload
- ✅ Category-based approval rules
- ✅ Admin user management
- ✅ Status tracking table
- ✅ Demo accounts for all roles

**Have fun exploring ClaimDoo!** 🚀
