import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

// Hook for fetching countries and currencies
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await client.get('/reference/countries');
        const list = response?.data?.countries || [];
        setCountries(list);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError(err?.response?.data?.message || 'Failed to load countries. Please try again.');
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

// Hook for currency conversion
export const useCurrencyConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return { convertedAmount: amount, rate: 1 };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await client.get('/reference/convert', {
        params: {
          amount,
          from: fromCurrency,
          to: toCurrency,
        },
      });

      return response?.data || {
        convertedAmount: amount,
        rate: 1,
      };
    } catch (err) {
      console.error('Currency conversion failed:', err);
      setError(err?.response?.data?.message || 'Failed to convert currency. Please try again.');
      return { convertedAmount: amount, rate: 1 };
    } finally {
      setLoading(false);
    }
  };

  return { convertCurrency, loading, error };
};

export const useExpenseMetadata = () => {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await client.get('/reference/expenses/metadata');
        const metadata = response?.data?.metadata || {};
        setCategories(metadata.categories || []);
        setStatuses(metadata.statuses || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch expense metadata:', err);
        setError(err?.response?.data?.message || 'Failed to load expense metadata. Please try again.');
        setCategories([]);
        setStatuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { categories, statuses, loading, error };
};

// Hook for expense management API calls
export const useExpenseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        description: expenseData.description,
        category: expenseData.category || null,
        expenseDate: expenseData.date || expenseData.expenseDate,
        paidBy: expenseData.paidBy || null,
        remarks: expenseData.remarks || null,
        amount: expenseData.amount,
        currency: expenseData.currency,
        status: expenseData.status || 'Draft',
        ruleId: expenseData.ruleId || null,
        receipts: expenseData.receipts || expenseData.receiptUrl
          ? [
              {
                fileUrl: expenseData.receiptUrl,
                ocrText: expenseData.ocrText || null,
              },
            ]
          : [],
      };

      const resp = await client.post('/expenses', payload);
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.patch(`/expenses/${id}`, updateData);
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const getExpenses = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.get('/expenses', { params: filters });
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const getExpenseDetail = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.get(`/expenses/${id}`);
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const getPendingApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.get('/approvals');
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const decideApproval = async (approvalId, decision, comments) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.patch(`/approvals/${approvalId}`, {
        decision,
        comments,
      });
      return resp.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitExpense,
    updateExpense,
    getExpenses,
    getExpenseDetail,
    getPendingApprovals,
    decideApproval,
    loading,
    error,
  };
};

// Hook for user management API calls
export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.get('/users');
      return resp.data;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.post('/users', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        managerId: userData.managerId || null,
      });
      return resp.data;
    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await client.patch(`/users/${userId}`, updates);
      return resp.data;
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(err?.response?.data?.message || err.message);
      return { success: false, error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getUsers,
    createUser,
    updateUser,
    loading,
    error
  };
};