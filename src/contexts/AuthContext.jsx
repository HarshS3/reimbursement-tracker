import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  // Mock authentication state
  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('claimdoo_user');
    const storedCompany = localStorage.getItem('claimdoo_company');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    // Mock API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo accounts
      const demoAccounts = {
        'admin@claimdoo.com': {
          id: 1,
          name: 'Admin User',
          email: 'admin@claimdoo.com',
          role: 'admin',
          avatar: null,
          password: 'admin123'
        },
        'manager@claimdoo.com': {
          id: 2,
          name: 'Manager User',
          email: 'manager@claimdoo.com',
          role: 'manager',
          avatar: null,
          password: 'manager123'
        },
        'sarah@claimdoo.com': {
          id: 3,
          name: 'Sarah Johnson',
          email: 'sarah@claimdoo.com',
          role: 'employee',
          avatar: null,
          password: 'employee123',
          department: 'Engineering',
          manager: 'Manager User'
        }
      };
      
      // Check if it's a demo account
      const demoUser = demoAccounts[email];
      if (demoUser && demoUser.password === password) {
        const { password: _, ...userWithoutPassword } = demoUser;
        const mockUser = userWithoutPassword;
        
        const mockCompany = {
          id: 1,
          name: 'ClaimDoo Demo Company',
          currency: 'USD',
          country: 'United States'
        };
        
        setUser(mockUser);
        setCompany(mockCompany);
        
        localStorage.setItem('claimdoo_user', JSON.stringify(mockUser));
        localStorage.setItem('claimdoo_company', JSON.stringify(mockCompany));
        
        return { success: true };
      }
      
      // Default fallback for other emails
      const mockUser = {
        id: Date.now(),
        name: 'John Doe',
        email: email,
        role: 'admin', // admin, manager, employee
        avatar: null
      };
      
      const mockCompany = {
        id: 1,
        name: 'Sample Company',
        currency: 'USD',
        country: 'United States'
      };
      
      setUser(mockUser);
      setCompany(mockCompany);
      
      localStorage.setItem('claimdoo_user', JSON.stringify(mockUser));
      localStorage.setItem('claimdoo_company', JSON.stringify(mockCompany));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const signUp = async (userData) => {
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'admin', // First user becomes admin
        avatar: null
      };
      
      const newCompany = {
        id: Date.now(),
        name: userData.companyName || 'My Company',
        currency: userData.currency || 'USD',
        country: userData.country || 'United States'
      };
      
      setUser(newUser);
      setCompany(newCompany);
      
      localStorage.setItem('claimdoo_user', JSON.stringify(newUser));
      localStorage.setItem('claimdoo_company', JSON.stringify(newCompany));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('claimdoo_user');
    localStorage.removeItem('claimdoo_company');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('claimdoo_user', JSON.stringify(updatedUser));
  };

  const updateCompany = (companyData) => {
    const updatedCompany = { ...company, ...companyData };
    setCompany(updatedCompany);
    localStorage.setItem('claimdoo_company', JSON.stringify(updatedCompany));
  };

  const value = {
    user,
    company,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    updateCompany,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};