import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook for fetching countries and currencies
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://restcountries.com/v3.1/all?fields=name,currencies'
        );
        
        // Sort countries alphabetically and filter out countries without currencies
        const sortedCountries = response.data
          .filter(country => country.currencies && Object.keys(country.currencies).length > 0)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(sortedCountries);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries. Please try again.');
        // Fallback data for development
        setCountries([
          {
            name: { common: 'United States' },
            currencies: { USD: { name: 'United States dollar', symbol: '$' } }
          },
          {
            name: { common: 'United Kingdom' },
            currencies: { GBP: { name: 'British pound', symbol: '£' } }
          },
          {
            name: { common: 'Canada' },
            currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } }
          },
          {
            name: { common: 'Australia' },
            currencies: { AUD: { name: 'Australian dollar', symbol: '$' } }
          },
          {
            name: { common: 'Germany' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } }
          }
        ]);
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
      
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      
      const rate = response.data.rates[toCurrency];
      if (!rate) {
        throw new Error(`Exchange rate not found for ${toCurrency}`);
      }
      
      const convertedAmount = (amount * rate).toFixed(2);
      
      return {
        convertedAmount: parseFloat(convertedAmount),
        rate,
        date: response.data.date
      };
    } catch (err) {
      console.error('Currency conversion failed:', err);
      setError('Failed to convert currency. Please try again.');
      // Return fallback conversion for development
      return {
        convertedAmount: amount * 1.1, // Mock 10% difference
        rate: 1.1,
        date: new Date().toISOString().split('T')[0]
      };
    } finally {
      setLoading(false);
    }
  };

  return { convertCurrency, loading, error };
};

// Hook for expense management API calls
export const useExpenseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExpense = {
        id: Date.now(),
        ...expenseData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        approvalHistory: []
      };
      
      // Store in localStorage for demo
      const existingExpenses = JSON.parse(localStorage.getItem('claimdoo_expenses') || '[]');
      existingExpenses.push(newExpense);
      localStorage.setItem('claimdoo_expenses', JSON.stringify(existingExpenses));
      
      return { success: true, expense: newExpense };
    } catch (err) {
      console.error('Failed to submit expense:', err);
      setError('Failed to submit expense. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getExpenses = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const expenses = JSON.parse(localStorage.getItem('claimdoo_expenses') || '[]');
      
      // Apply filters if provided
      let filteredExpenses = expenses;
      if (filters.status) {
        filteredExpenses = expenses.filter(exp => exp.status === filters.status);
      }
      if (filters.userId) {
        filteredExpenses = filteredExpenses.filter(exp => exp.userId === filters.userId);
      }
      
      return { success: true, expenses: filteredExpenses };
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (expenseId, decision, comments = '') => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const expenses = JSON.parse(localStorage.getItem('claimdoo_expenses') || '[]');
      const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);
      
      if (expenseIndex === -1) {
        throw new Error('Expense not found');
      }
      
      expenses[expenseIndex].status = decision; // 'approved' or 'rejected'
      expenses[expenseIndex].approvalHistory.push({
        decision,
        comments,
        approvedBy: 'Current User', // Replace with actual user
        approvedAt: new Date().toISOString()
      });
      
      localStorage.setItem('claimdoo_expenses', JSON.stringify(expenses));
      
      return { success: true, expense: expenses[expenseIndex] };
    } catch (err) {
      console.error('Failed to process approval:', err);
      setError('Failed to process approval. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitExpense,
    getExpenses,
    approveExpense,
    loading,
    error
  };
};

// Hook for user management API calls
export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('claimdoo_users') || '[]');
      
      return { success: true, users };
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('claimdoo_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('claimdoo_users', JSON.stringify(existingUsers));
      
      return { success: true, user: newUser };
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('Failed to create user. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = JSON.parse(localStorage.getItem('claimdoo_users') || '[]');
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('claimdoo_users', JSON.stringify(users));
      
      return { success: true, user: users[userIndex] };
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    getUsers,
    createUser,
    updateUser,
    loading,
    error
  };
};