import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge } from '../components/ui';
import ExpenseSubmissionForm from '../components/dashboard/ExpenseSubmissionForm';
import ExpenseList from '../components/dashboard/ExpenseList';
import ApprovalQueue from '../components/dashboard/ApprovalQueue';
import { useExpenseApi, useExpenseMetadata } from '../hooks/useApi';
import {
  Plus,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Gear,
  ChartBar,
  CurrencyDollar
} from 'phosphor-react';

const Dashboard = () => {
  const { user, company, isAdmin, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const { getExpenses } = useExpenseApi();
  const { statuses } = useExpenseMetadata();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const result = await getExpenses();
    if (result.success) {
      setExpenses(result.expenses);
    }
  };

  const normalizeStatus = (value) =>
    String(value || '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

  const statusMap = useMemo(() => {
    const map = new Map();
    statuses.forEach((status) => {
      const valueKey = normalizeStatus(status.value);
      if (valueKey && !map.has(valueKey)) {
        map.set(valueKey, status);
      }

      const labelKey = normalizeStatus(status.label);
      if (labelKey && !map.has(labelKey)) {
        map.set(labelKey, status);
      }
    });
    return map;
  }, [statuses]);

  const stats = useMemo(() =>
    expenses.reduce(
      (acc, exp) => {
        const key = normalizeStatus(exp.status);
        if (key === 'approved') {
          acc.approved += 1;
          acc.totalAmount += Number.parseFloat(exp.amount || 0) || 0;
        } else if (key === 'rejected') {
          acc.rejected += 1;
        } else if (key === 'waiting_approval' || key === 'pending') {
          acc.pending += 1;
        }
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0, totalAmount: 0 }
    ),
  [expenses]);

  const statusDisplay = useMemo(() => {
    const findStatus = (predicateKeys) => {
      for (const candidate of predicateKeys) {
        const match = statusMap.get(candidate);
        if (match) return match;
      }
      return null;
    };

    return {
      pending: findStatus(['waiting_approval', 'pending']),
      approved: findStatus(['approved']),
      rejected: findStatus(['rejected']),
    };
  }, [statusMap]);

  const getStatusVariant = (status) => {
    const key = normalizeStatus(status);
    if (key === 'approved') return 'success';
    if (key === 'rejected') return 'error';
    return 'warning';
  };

  const getStatusLabel = (status) => {
    const key = normalizeStatus(status);
    return statusMap.get(key)?.label || status || 'Unknown';
  };

  const adminTabs = [
    { id: 'overview', name: 'Overview', icon: ChartBar },
    { id: 'expenses', name: 'All Expenses', icon: Receipt },
    { id: 'users', name: 'User Management', icon: Users, route: '/dashboard/users' },
    { id: 'approval-rules', name: 'Approval Rules', icon: Gear, route: '/dashboard/approval-rules' },
  ];

  const managerTabs = [
    { id: 'overview', name: 'Overview', icon: ChartBar },
    { id: 'approvals', name: 'Approvals', icon: Clock },
    { id: 'team-expenses', name: 'Team Expenses', icon: Receipt },
  ];

  const employeeTabs = [
    { id: 'overview', name: 'Overview', icon: ChartBar },
    { id: 'my-expenses', name: 'My Expenses', icon: Receipt, route: '/dashboard/expenses' },
    { id: 'submit', name: 'Submit Expense', icon: Plus },
  ];

  const getTabs = () => {
    if (isAdmin) return adminTabs;
    if (isManager) return managerTabs;
    return employeeTabs;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome back, {user?.name}
            </h2>
            <p className="body-text">
              {company?.name} • {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Base Currency</div>
            <div className="text-lg font-semibold text-white">{company?.currency}</div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
              <Clock size={24} className="text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{stats.pending}</div>
              <div className="text-sm text-white/60">{statusDisplay.pending?.label || 'Waiting Approval'}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{stats.approved}</div>
              <div className="text-sm text-white/60">{statusDisplay.approved?.label || 'Approved'}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4">
              <XCircle size={24} className="text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{stats.rejected}</div>
              <div className="text-sm text-white/60">{statusDisplay.rejected?.label || 'Rejected'}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4">
              <CurrencyDollar size={24} className="text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {company?.currency} {stats.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-white/60">Total Approved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions removed for employees per latest UX request */}

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
              <div className="flex items-center">
                <Receipt size={16} className="text-white/60 mr-3" />
                <div>
                  <div className="text-white font-medium">{expense.description}</div>
                  <div className="text-sm text-white/60">
                    {new Date(expense.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-white font-medium">
                  {expense.currency} {expense.amount}
                </div>
                <Badge 
                  variant={getStatusVariant(expense.status)}
                >
                  {getStatusLabel(expense.status)}
                </Badge>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="text-center py-8 text-white/60">
              No expenses yet. {isEmployee && 'Submit your first expense to get started!'}
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'expenses':
      case 'my-expenses':
      case 'team-expenses':
        return <ExpenseList expenses={expenses} onRefresh={loadExpenses} />;
      case 'approvals':
        return <ApprovalQueue onRefresh={loadExpenses} />;
      case 'submit':
        return (
          <ExpenseSubmissionForm 
            onClose={() => setActiveTab('overview')} 
            onSuccess={() => {
              loadExpenses();
              setActiveTab('my-expenses');
            }} 
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="hero-text text-3xl font-light mb-2">Dashboard</h1>
          <p className="body-text">
            Manage your expense reimbursements and approvals
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="glass-card rounded-xl p-2">
            <div className="flex flex-wrap gap-2">
              {getTabs().map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.route) {
                        navigate(tab.route);
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Expense Submission Modal */}
        {showExpenseForm && (
          <ExpenseSubmissionForm
            onClose={() => setShowExpenseForm(false)}
            onSuccess={() => {
              setShowExpenseForm(false);
              loadExpenses();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;