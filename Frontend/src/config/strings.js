const STRINGS = {
  appName: 'ClaimDoo',
  nav: {
    getStarted: 'Get Started',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out'
  },
  auth: {
    signinTitle: 'Signin Page',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    loginButton: 'Login',
    signingIn: 'Signing in...',
    demoHeader: 'Demo Accounts:',
    forgotPassword: 'Forgot password?',
    demoAccounts: [
      { role: 'Admin', email: 'admin@claimdoo.com', password: 'admin123' },
      { role: 'Manager', email: 'manager@claimdoo.com', password: 'manager123' },
      { role: 'Employee', email: 'sarah@claimdoo.com', password: 'employee123' }
    ]
  },
  dashboard: {
    myExpenses: 'My Expenses',
    upload: 'Upload',
    new: 'New',
    toSubmit: 'To Submit',
    waitingApproval: 'Waiting Approval',
    approved: 'Approved'
  },
  userManagement: {
    title: 'User Management',
    description: 'Manage employees, managers, and their roles',
    newUser: 'New User',
    noUsers: 'No users found',
    noUsersHelp: 'Can create a new user on the fly, if no user found with that name.'
  },
  expenses: {
    submitNew: 'Submit New Expense',
    receiptUpload: 'Receipt Upload',
    uploadReceipt: 'Upload Receipt',
    processingReceipt: 'Processing receipt with AI OCR...',
    descriptionPlaceholder: 'Restaurant bill, taxi fare, etc.'
  },
  approvalRules: {
    defaultRuleName: 'Approval rule for miscellaneous expenses',
    defaultRuleDescription: 'Default approval workflow for general expenses'
  },
  generic: {
    restore: 'Restore',
    minimize: 'Minimize',
    cancel: 'Cancel',
    save: 'Save',
    remove: 'Remove',
    close: 'Close'
  }
};

export default STRINGS;
