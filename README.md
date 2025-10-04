# ClaimDoo - AI-Powered Expense Management System

ClaimDoo is a modern, luxury-styled web application for managing business expenses with AI-powered OCR (Optical Character Recognition) technology. Built with React 19, Vite, and Tailwind CSS, it provides a comprehensive solution for expense submission, approval workflows, and financial management.

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role Authentication**: Employee, Manager, and Admin roles
- **Company Registration**: Complete onboarding with country and currency selection
- **Secure Login/Logout**: Protected routes and session management
- **Role-based Permissions**: Different access levels based on user roles

### 💰 Expense Management
- **AI-Powered OCR**: Automatic receipt scanning using Tesseract.js
- **Multi-Currency Support**: Real-time currency conversion and display
- **Expense Categories**: Automatic categorization of expenses
- **Receipt Storage**: Secure image upload and storage
- **Expense Tracking**: Comprehensive expense history and analytics

### 🔄 Approval Workflows
- **Multi-Level Approvals**: Configurable approval chains
- **Smart Rules**: Percentage-based, specific amount, and hybrid approval rules
- **Real-time Notifications**: Instant updates on approval status
- **Bulk Actions**: Approve or reject multiple expenses at once
- **Approval Comments**: Add notes and feedback during approval process

### 👥 User Management
- **User Creation**: Admin can create and manage user accounts
- **Role Assignment**: Flexible role and permission management
- **Manager Relationships**: Set up reporting hierarchies
- **Automatic Notifications**: Email notifications for new accounts

### 📊 Dashboard & Analytics
- **Role-based Dashboards**: Customized views for each user type
- **Expense Statistics**: Real-time spending analytics and trends
- **Approval Queues**: Organized view of pending approvals
- **Quick Actions**: Fast access to common tasks

### 🌐 Multi-Currency & Localization
- **190+ Countries**: Complete country selection with flags
- **Multiple Currencies**: Support for major world currencies
- **Real-time Conversion**: Live exchange rates integration
- **Localized Formatting**: Currency and number formatting

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with modern hooks and features
- **Vite 7.1.7**: Fast build tool and development server
- **React Router DOM**: Client-side routing and navigation

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Glassmorphism and neumorphism styles
- **Inter Font**: Modern typography
- **Responsive Design**: Mobile-first approach

### Animations & Interactions
- **Framer Motion**: Smooth animations and page transitions
- **Custom Animation Components**: Reusable animation utilities
- **Scroll Animations**: Reveal animations on scroll
- **Micro-interactions**: Enhanced user experience

### AI & Processing
- **Tesseract.js**: Client-side OCR for receipt processing
- **Automatic Data Extraction**: Smart field recognition
- **Image Processing**: Receipt image optimization

### Icons & Assets
- **Phosphor React**: Lightweight and consistent icon library
- **Custom Components**: Reusable UI component library

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing

## 🏗️ Project Structure

```
src/
├── components/
│   ├── animations/          # Animation utilities
│   ├── dashboard/           # Dashboard components
│   │   ├── ApprovalQueue.jsx
│   │   ├── ApprovalRules.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseSubmissionForm.jsx
│   │   └── UserManagement.jsx
│   ├── layout/              # Layout components
│   │   └── Layout.jsx
│   └── ui/                  # Reusable UI components
│       ├── Badge.jsx
│       ├── Card.jsx
│       └── index.js
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── data/
│   ├── countries.js        # Country data with flags
│   └── currencies.js       # Currency data
├── hooks/
│   ├── useApi.js           # API hooks
│   ├── useCountries.js     # Countries hook
│   ├── useCurrency.js      # Currency hook
│   ├── useExpenses.js      # Expenses hook
│   └── useUsers.js         # Users hook
├── pages/
│   ├── auth/               # Authentication pages
│   │   ├── SignIn.jsx
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
├── index.css              # Global styles and Tailwind
└── main.jsx              # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

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

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#3B82F6` to `#1D4ED8`)
- **Background**: Dark theme with glass effects
- **Text**: White with opacity variants
- **Accents**: Status colors (success, warning, error, info)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hierarchy**: Responsive text scaling
- **Weight**: 300-700 range

### Components
- **Glass Cards**: Frosted glass effect with backdrop blur
- **Neumorphic Buttons**: Soft, tactile button styles
- **Luxury Inputs**: Elegant form controls
- **Gradient Effects**: Smooth color transitions

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Extended color palette
- Custom utilities for glassmorphism
- Responsive breakpoints
- Animation utilities

### Vite Configuration
- React plugin integration
- PostCSS processing
- Development server optimization

## 📱 Pages & Features

### Public Pages
1. **Homepage** - Landing page with feature highlights
2. **About** - Company information and team
3. **Contact** - Contact form and information
4. **Blog** - Articles and insights
5. **Blog Posts** - Individual article pages

### Authentication
1. **Sign In** - User login with role selection
2. **Sign Up** - Company registration with currency setup

### Protected Pages
1. **Dashboard** - Role-based main interface
2. **Settings** - User account management

### Dashboard Tabs
- **Expense Submission** - Submit and track expenses
- **Approval Queue** - Review and approve expenses (Managers)
- **User Management** - Create and manage users (Admins)
- **Approval Rules** - Configure approval workflows (Admins)
- **Expense List** - View all expenses with filtering

## 🔐 User Roles & Permissions

### Employee
- Submit expenses with OCR
- View own expense history
- Track approval status
- Update profile settings

### Manager
- All employee permissions
- Approve/reject team expenses
- View team expense analytics
- Manage approval comments

### Admin
- All manager permissions
- Create and manage users
- Configure approval rules
- Access company settings
- View system-wide analytics

## 🌟 Key Features Explained

### AI-Powered OCR
- Upload receipt images
- Automatic text extraction
- Smart field recognition (amount, date, merchant)
- Manual correction capabilities

### Multi-Currency System
- Real-time exchange rates
- Automatic currency conversion
- Multiple currency display
- Historical rate tracking

### Approval Workflows
- **Percentage Rules**: Approve based on expense percentage
- **Specific Amount**: Set fixed approval amounts
- **Hybrid Rules**: Combine percentage and amount rules
- **Sequential Approval**: Multi-step approval chains

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interactions

## 🎯 Demo Credentials

### Test Accounts
```
Admin Account:
Email: admin@company.com
Password: password123

Manager Account:
Email: manager@company.com
Password: password123

Employee Account:
Email: employee@company.com
Password: password123
```

## 📈 Future Enhancements

### Planned Features
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with accounting systems
- [ ] Machine learning for fraud detection
- [ ] Advanced reporting features
- [ ] Multi-company support

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] Accessibility enhancements
- [ ] Progressive Web App features
- [ ] Offline functionality
- [ ] Advanced caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
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
