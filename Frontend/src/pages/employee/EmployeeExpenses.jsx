import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../../components/ui';
import STRINGS from '../../config/strings';
import { Upload, Plus } from 'phosphor-react';
import ExpenseSubmissionForm from '../../components/dashboard/ExpenseSubmissionForm';
import ExpenseList from '../../components/dashboard/ExpenseList';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenseApi, useExpenseMetadata } from '../../hooks/useApi';

const EmployeeExpenses = () => {
  const { company } = useAuth();
  const { getExpenses } = useExpenseApi();
  const { statuses } = useExpenseMetadata();

  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const statusMap = useMemo(() => {
    const map = new Map();
    statuses.forEach((status) => {
      map.set(status.value, status.label);
    });
    return map;
  }, [statuses]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    const result = await getExpenses();
    if (result.success) {
      setExpenses(result.expenses);
    }
    setLoadingExpenses(false);
  };

  const summary = useMemo(() => {
    const base = {
      Draft: { count: 0, amount: 0 },
      'Waiting Approval': { count: 0, amount: 0 },
      Approved: { count: 0, amount: 0 },
    };

    expenses.forEach((expense) => {
      const status = expense.status || 'Draft';
      const key = base[status] ? status : 'Draft';
      const amount = Number(expense.amount || 0);
      base[key].count += 1;
      base[key].amount += Number.isNaN(amount) ? 0 : amount;
    });

    return base;
  }, [expenses]);

  const currency = company?.currency || expenses[0]?.currency || 'USD';

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-light text-heading">{STRINGS.dashboard.myExpenses}</h1>
          <p className="text-muted max-w-2xl">
            {STRINGS.dashboard.upload}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Button onClick={() => setShowExpenseForm(true)} className="flex items-center gap-2">
            <Upload size={18} weight="bold" />
            <span>Upload Receipt</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} weight="bold" />
            <span>New Expense</span>
          </Button>
          <Button
            variant="ghost"
            onClick={loadExpenses}
            disabled={loadingExpenses}
            className="text-sm"
          >
            {loadingExpenses ? 'Refreshing…' : 'Refresh'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="text-center">
            <div className="text-sm text-muted mb-1">{statusMap.get('Draft') || 'To Submit'}</div>
            <div className="text-3xl font-semibold text-heading">{summary.Draft.count}</div>
            <div className="text-xs text-white/60 mt-1">
              {currency} {summary.Draft.amount.toFixed(2)}
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-muted mb-1">
              {statusMap.get('Waiting Approval') || 'Waiting Approval'}
            </div>
            <div className="text-3xl font-semibold text-warning">{summary['Waiting Approval'].count}</div>
            <div className="text-xs text-white/60 mt-1">
              {currency} {summary['Waiting Approval'].amount.toFixed(2)}
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-muted mb-1">{statusMap.get('Approved') || 'Approved'}</div>
            <div className="text-3xl font-semibold text-success">{summary.Approved.count}</div>
            <div className="text-xs text-white/60 mt-1">
              {currency} {summary.Approved.amount.toFixed(2)}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExpenseList expenses={expenses} onRefresh={loadExpenses} />
        </motion.div>
      </div>

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
  );
};

export default EmployeeExpenses;
