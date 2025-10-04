# ClaimDoo - AI-Powered Expense Management System

**A Nirma University Academic Project**

ClaimDoo is a modern, luxury-styled expense reimbursement system with AI-powered OCR receipt scanning, category-based approval workflows, and role-based access control. Built with React 19, Vite, Tailwind CSS v4, and featuring stunning 3D Spline backgrounds.

---

## 👥 Team

**Nirma University - 3rd Year Students:**
- **Parth Srivastava** - parth.srivastava@gmail.com
- **Harsh Shah** - harsh.shah@gmail.com
- **Rudra Moradiya** - rudra.moradiya@gmail.com
- **Advait Pandya** - advait.pandya@gmail.com

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser to http://localhost:5173/

### Demo Accounts:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@claimdoo.com | admin123 |
| Manager | manager@claimdoo.com | manager123 |
| Employee | sarah@claimdoo.com | employee123 |

📖 **See [QUICK_START.md](./QUICK_START.md) for detailed guide**

---

## ✨ Key Features

### 🧾 Employee Expense Management
- **OCR Receipt Upload**: Uses Tesseract.js to extract text from receipt images
- **Manual Entry**: Create expenses without receipts
- **Status Tracking**: Draft → To Submit → Waiting Approval → Approved
- **Expense Categories**: Food, Travel, Accommodation, Office Supplies, Entertainment, Other
- **Comprehensive Table**: Employee, Description, Date, Category, Paid By, Remarks, Amount, Status

### � Category-Based Approval Rules (Admin)
- **Category-Specific Workflows**: Different approval rules for each expense category
- **Multi-Level Approvals**: Sequential or parallel approval chains
- **Manager Assignment**: Assign managers to approval workflows
- **Minimum Approval Percentage**: Set required approval threshold
- **Visual Rule Cards**: Category badges (purple) and manager badges (blue)

### 👥 User Management (Admin)
- **User Creation**: Create users with role assignment (Manager/Employee)
- **Manager Assignment**: Assign managers to employees
- **Password Sending**: Send password emails to new users
- **User Editing**: Update user details and roles
- **User Deletion**: Remove users from the system

### 🎯 Role-Based Dashboards
- **Admin Dashboard**: Users, Approval Rules, All Expenses, Overview
- **Manager Dashboard**: Approval Queue, Team Expenses, Overview
- **Employee Dashboard**: My Expenses, Submit Expense, Overview

---

## 🎨 Design Features

- **3D Spline Backgrounds**: Interactive 3D scenes on landing (70% opacity) and auth pages (20% opacity)
- **Glassmorphic UI**: Modern frosted glass effects throughout
- **Dark Blue CTAs**: #1e3a8a for all primary buttons
- **Logo Integration**: CD.jpeg displayed in navbar and auth pages
- **Smooth Animations**: Framer Motion page transitions and micro-interactions
- **Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **Luxury Gradient**: Dark theme with elegant color scheme

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with modern hooks and features
- **Vite 7.1.9**: Fast build tool and development server
- **React Router DOM**: Client-side routing and navigation

### Styling & UI
- **Tailwind CSS v4**: Latest version with @tailwindcss/vite plugin
- **Glassmorphic Design System**: Frosted glass effects and luxury styling
- **@splinetool/react-spline**: Interactive 3D backgrounds
- **Phosphor React Icons**: Modern icon library
- **Inter Font**: Professional typography
- **Responsive Design**: Mobile-first approach

### Animations & Interactions
- **Framer Motion**: Smooth animations and page transitions
- **Page Transitions**: Elegant fade and slide effects
- **Micro-Interactions**: Hover states, button animations

### AI & Processing
- **Tesseract.js**: Client-side OCR for receipt processing
- **Automatic Data Extraction**: Smart field recognition from images
- **Image Preview**: Receipt image display with zoom

### Icons & Assets
- **Phosphor React**: Modern, consistent icon library
- **Custom Logo**: CD.jpeg for branding

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboard/           # Dashboard components (legacy)
│   ├── layout/              # Layout components
│   │   └── Layout.jsx      # Main layout with navbar
│   └── ui/                  # Reusable UI components
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       └── index.js
├── contexts/
│   └── AuthContext.jsx      # Authentication with demo accounts
├── pages/
│   ├── admin/               # Admin pages
│   │   ├── UsersManagement.jsx       # User CRUD
│   │   └── ApprovalRules.jsx         # Category-based rules
│   ├── employee/            # Employee pages
│   │   └── EmployeeExpenses.jsx      # OCR upload & expenses
│   ├── auth/                # Authentication pages
│   │   ├── SignIn.jsx       # Login with demo credentials
│   │   └── SignUp.jsx       # Registration
│   │   └── SignUp.jsx
│   ├── About.jsx           # About page
│   ├── Blog.jsx            # Blog listing page
│   ├── BlogPost.jsx        # Individual blog post
│   ├── Contact.jsx         # Contact page
│   ├── Dashboard.jsx       # Main dashboard
│   ├── Homepage.jsx        # Landing page
│   └── Settings.jsx        # User settings
├── utils/
│   └── auth.js            # Authentication utilities
├── App.jsx                # Main application component
│   ├── Dashboard.jsx        # Main dashboard with tabs
│   ├── Homepage.jsx         # Landing page with 3D Spline
│   ├── About.jsx            # Team information
│   └── Settings.jsx
├── App.jsx                  # Routes and page transitions
├── index.css               # Global styles and Tailwind
└── main.jsx                # Application entry point
public/
└── CD.jpeg                 # ClaimDoo logo
```

---

## � Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClaimDoo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

5. **Login with demo account**
   - Employee: `sarah@claimdoo.com` / `employee123`
   - Manager: `manager@claimdoo.com` / `manager123`
   - Admin: `admin@claimdoo.com` / `admin123`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## 🎨 Design System

### Color Palette
- **Primary/CTA**: Dark Blue (`#1e3a8a`) for buttons
- **Category Badge**: Purple (`purple-500/20` bg, `purple-400` text)
- **Manager Badge**: Blue (`primary-500/20` bg, `primary-400` text)
- **Background**: Dark gradient (`#0f172a` to `#1e293b`)
- **Glass Cards**: White with low opacity and backdrop blur
- **Text**: White with opacity variants (90%, 70%, 50%)
- **Accents**: Status colors (green for approved, yellow for waiting, red for rejected)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hierarchy**: H1 (3xl-4xl) → H2 (2xl-3xl) → H3 (xl-2xl) → Body (base-sm)
- **Weight**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Glass Cards**: `bg-white/5` with `backdrop-blur-xl` and `border-white/10`
- **Buttons**: Dark blue (#1e3a8a) with hover effects
- **Badges**: Rounded pills with category-specific colors
- **Modals**: Center overlay with glass card styling
- **Forms**: Elegant inputs with focus states

---

## 🔧 Configuration

### Tailwind CSS v4
- Uses `@tailwindcss/vite` plugin (no separate config file needed)
- Custom utilities in `index.css`:
  - `.glass-card` - Glassmorphic card effect
  - `.luxury-gradient` - Background gradient
  - Font families and animations

### Vite Configuration
- React plugin integration
- Tailwind CSS v4 plugin
- Fast HMR (Hot Module Replacement)

---

## 📱 Routes & Pages

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Landing with 3D Spline, features |
| `/about` | About | Team info (Nirma students) |
| `/signin` | Sign In | Login with demo credentials |
| `/signup` | Sign Up | Registration form |

### Protected Routes (Dashboard)
| Route | Page | Role | Description |
|-------|------|------|-------------|
| `/dashboard` | Dashboard | All | Overview with stats |
| `/dashboard/expenses` | Employee Expenses | Employee | OCR upload, expense submission |
| `/dashboard/users` | User Management | Admin | Create/edit users |
| `/dashboard/approval-rules` | Approval Rules | Admin | Category-based rules |
| `/settings` | Settings | All | User preferences |

### Authentication
1. **Sign In** - User login with role selection
2. **Sign Up** - Company registration with currency setup


---

## 🔐 User Roles & Permissions

### 👤 Employee
- ✅ Submit expenses with OCR receipt upload
- ✅ View own expense history with status tracking
- ✅ Save drafts and submit for approval
- ✅ Track approval status (To Submit, Waiting Approval, Approved)
- ✅ Update profile settings

### 👔 Manager
- ✅ All employee permissions
- ✅ Approve/reject team expenses
- ✅ View approval queue
- ✅ Access team expense analytics
- ✅ Add approval comments

### 👨‍💼 Admin
- ✅ All manager permissions
- ✅ Create and manage users (assign roles, managers)
- ✅ Configure category-based approval rules
- ✅ Access all expenses across company
- ✅ View system-wide analytics

---

## 🌟 Feature Deep Dive

### 🧾 OCR Receipt Processing
1. **Upload Receipt**: Click "Upload Receipt" button
2. **Image Preview**: View receipt with zoom capability
3. **OCR Extraction**: Tesseract.js extracts text from image
4. **Progress Indicator**: Shows "Processing receipt..." with percentage
5. **Auto-Fill Form**: Extracted data fills expense form fields
6. **Manual Correction**: Edit any field as needed
7. **Submit**: Save as draft or submit for approval

### 📋 Category-Based Approval Rules
- **6 Expense Categories**:
  - Food & Dining
  - Travel & Transportation
  - Accommodation & Lodging
  - Office Supplies
  - Entertainment
  - Other
  
- **Rule Configuration**:
  - Select category
  - Assign manager
  - Add multiple approvers with roles
  - Set sequential or parallel workflow
  - Define minimum approval percentage
  - Mark approvals as required

- **Visual Indicators**:
  - Purple badges for categories
  - Blue badges for manager approval
  - Edit/delete functionality

### 📊 Status Tracking
- **Draft / To Submit**: Saved locally, not submitted
- **Submitted / Waiting Approval**: Sent to approvers, pending review
- **Approved**: All required approvals received, ready for reimbursement
- **Rejected**: Declined by approvers, needs revision

---

## 🎯 Demo Credentials

```
🔑 Admin Access
Email: admin@claimdoo.com
Password: admin123
Features: Users, Approval Rules, All Expenses

🔑 Manager Access
Email: manager@claimdoo.com
Password: manager123
Features: Approval Queue, Team Expenses

🔑 Employee Access
Email: sarah@claimdoo.com
Password: employee123
Features: Submit Expenses, OCR Upload, View Status
```

**💡 Tip:** Demo credentials are shown on the sign-in page!

---

## 📈 Future Enhancements

### Planned Features
- [ ] Backend API integration with database
- [ ] Real-time notifications (email, in-app, push)
- [ ] Manager approval queue interface with approve/reject actions
- [ ] Advanced analytics and spending trends
- [ ] Export to PDF/CSV for accounting
- [ ] Receipt image archive and search
- [ ] Multi-company support
- [ ] Mobile app (React Native)
- [ ] Integration with accounting systems (QuickBooks, Xero)
- [ ] Machine learning for auto-categorization
- [ ] Email notifications for status changes
- [ ] Approval workflow automation

### Technical Improvements
- [ ] Backend API (Node.js + Express)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] File storage (AWS S3/Azure Blob)
- [ ] Unit and integration tests (Jest, Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance optimization
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Progressive Web App (PWA)
- [ ] Offline functionality with service workers

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 3 steps
- **[DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md)** - Detailed demo account info
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete feature summary

---

## 🤝 Contributing

This is an academic project by Nirma University students. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is created for academic purposes at Nirma University.

---

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Spline Design** for 3D interactive backgrounds
- **Tesseract.js** for OCR technology
- **Framer Motion** for smooth animations
- **Phosphor Icons** for beautiful icon library
- **React** and **Vite** for the amazing developer experience

---

## 📞 Contact

**Project Team:**
- Parth Srivastava - parth.srivastava@gmail.com
- Harsh Shah - harsh.shah@gmail.com
- Rudra Moradiya - rudra.moradiya@gmail.com
- Advait Pandya - advait.pandya@gmail.com

**Institution:** Nirma University

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐!

---

**Made with ❤️ by Nirma University Students**

---

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Spline Design** for 3D interactive backgrounds
- **Tesseract.js** for OCR technology
- **Framer Motion** for smooth animations
- **Phosphor Icons** for the beautiful icon set
- **Tesseract.js** for OCR capabilities
- **React Team** for the amazing framework

---

**ClaimDoo** - Revolutionizing expense management with AI-powered automation and luxury user experience. 🚀

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
