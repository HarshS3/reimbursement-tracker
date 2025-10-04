import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge, Input, Select } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenseApi, useExpenseMetadata } from '../../hooks/useApi';
import {
  Receipt,
  Calendar,
  CurrencyDollar,
  MagnifyingGlass,
  Download,
} from 'phosphor-react';

const ExpenseList = ({ expenses: initialExpenses, onRefresh }) => {
  const { isAdmin } = useAuth();
  const { getExpenses, loading } = useExpenseApi();
  const { categories: categoryMetadata, statuses: statusMetadata } = useExpenseMetadata();

  const [expenses, setExpenses] = useState(initialExpenses || []);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (!initialExpenses) {
      loadExpenses();
    }
  }, [initialExpenses]);

  useEffect(() => {
    if (initialExpenses) {
      setExpenses(initialExpenses);
    }
  }, [initialExpenses]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, statusFilter, categoryFilter]);

  const loadExpenses = async () => {
    const result = await getExpenses();
    if (result.success) {
      setExpenses(result.expenses);
      onRefresh?.(result.expenses);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];
    const search = searchTerm.trim().toLowerCase();

    if (search) {
      filtered = filtered.filter((expense) =>
        expense.description?.toLowerCase().includes(search) ||
        expense.employeeName?.toLowerCase().includes(search) ||
        expense.employeeEmail?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((expense) => expense.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (expense) => (expense.category || '').toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    filtered.sort(
      (a, b) => new Date(b.createdAt || b.expenseDate) - new Date(a.createdAt || a.expenseDate)
    );

    setFilteredExpenses(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Waiting Approval':
        return 'warning';
      case 'Draft':
      default:
        return 'default';
    }
  };

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'All Statuses' },
      ...statusMetadata.map((status) => ({ value: status.value, label: status.label })),
    ],
    [statusMetadata]
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...categoryMetadata.map((category) => ({ value: category.value, label: category.label })),
    ],
    [categoryMetadata]
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-2">
              {isAdmin ? 'All Expenses' : 'My Expenses'}
            </h2>
            <p className="body-text text-body">
              {isAdmin
                ? 'View and manage all company expenses'
                : 'Track your submitted expense claims'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-heading">{filteredExpenses.length}</div>
            <div className="text-sm text-muted">
              {filteredExpenses.length === 1 ? 'Expense' : 'Expenses'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
            />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptions}
          />

          <Button variant="secondary" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            <span className="ml-3 text-white/70">Loading expenses...</span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">
              {expenses.length === 0
                ? 'No expenses found'
                : 'No expenses match your filters'}
            </p>
            <p className="text-white/40 text-sm">
              {expenses.length === 0
                ? 'Submit your first expense to get started!'
                : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium text-muted border-b border-muted">
              <div>Employee</div>
              <div>Description</div>
              <div>Date</div>
              <div>Category</div>
              <div>Paid By</div>
              <div>Remarks</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            {filteredExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-7 gap-4 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-medium">
                      {(expense.employeeName || expense.paidBy || 'U').charAt(0)}
                    </span>
                  </div>
                  <span className="text-body text-sm">
                    {expense.employeeName || expense.paidBy || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center">
                  <Receipt size={16} className="text-primary mr-2" />
                  <div>
                    <div className="text-heading font-medium truncate" title={expense.description}>
                      {expense.description}
                    </div>
                    <div className="text-xs text-muted">
                      Submitted {formatDate(expense.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar size={14} className="text-muted mr-2" />
                  <span className="text-body text-sm">{formatDate(expense.expenseDate)}</span>
                </div>

                <div className="flex items-center">
                  <Badge variant="info" className="capitalize text-xs">
                    {expense.category || 'Unspecified'}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <span className="text-white/80 text-sm">{expense.paidBy || '-'}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-white/80 text-sm truncate" title={expense.remarks}>
                    {expense.remarks || '-'}
                  </span>
                </div>

                <div className="flex items-center">
                  <CurrencyDollar size={14} className="text-primary mr-1" />
                  <div className="text-sm">
                    <div className="text-heading font-medium">
                      {expense.currency} {parseFloat(expense.amount || 0).toFixed(2)}
                    </div>
                    {expense.originalCurrency && expense.originalCurrency !== expense.currency && (
                      <div className="text-xs text-muted">
                        Original: {expense.originalCurrency}{' '}
                        {parseFloat(expense.originalAmount || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={getBadgeVariant(expense.status)} className="capitalize">
                    {expense.status}
                  </Badge>
                  {expense.status === 'Approved' && (
                    <div className="text-xs text-success">
                      {formatDate(expense.updatedAt || expense.createdAt)}
                    </div>
                  )}
                  {expense.status === 'Rejected' && expense.approvals?.[0]?.comments && (
                    <div className="text-xs text-danger" title={expense.approvals[0].comments}>
                      View reason
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExpenseList;