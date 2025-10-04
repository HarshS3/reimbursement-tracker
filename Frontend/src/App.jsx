import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ForgotPassword from './pages/auth/ForgotPassword';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Homepage from './pages/Homepage';
import About from './pages/About';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import UsersManagement from './pages/admin/UsersManagement';
import ApprovalRules from './pages/admin/ApprovalRules';
import EmployeeExpenses from './pages/employee/EmployeeExpenses';

// Page Transition Component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-luxury-gradient">
          <Layout>
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <Homepage />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <About />
                </PageTransition>
              } />
              <Route path="/signin" element={
                <PageTransition>
                  <SignIn />
                </PageTransition>
              } />
              <Route path="/signup" element={
                <PageTransition>
                  <SignUp />
                </PageTransition>
              } />
              <Route path="/forgot-password" element={
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              } />
              <Route path="/dashboard" element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              } />
              <Route path="/dashboard/users" element={
                <PageTransition>
                  <UsersManagement />
                </PageTransition>
              } />
              <Route path="/dashboard/approval-rules" element={
                <PageTransition>
                  <ApprovalRules />
                </PageTransition>
              } />
              <Route path="/dashboard/expenses" element={
                <PageTransition>
                  <EmployeeExpenses />
                </PageTransition>
              } />
              <Route path="/settings" element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              } />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
