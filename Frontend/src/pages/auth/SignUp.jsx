import React, { useState, useEffect, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeSlash } from 'phosphor-react';
import { useCountries } from '../../hooks/useApi';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    currency: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { countries, loading: countriesLoading } = useCountries();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'country' && countries.length > 0) {
      const selectedCountry = countries.find(c => c.name.common === value);
      if (selectedCountry && selectedCountry.currencies) {
        const currencyCode = Object.keys(selectedCountry.currencies)[0];
        setFormData(prev => ({
          ...prev,
          currency: currencyCode
        }));
      }
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const companyName = formData.name.trim() || formData.email.split('@')[0];
      
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: companyName + ' Company',
        country: formData.country,
        currency: formData.currency
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = countries.map(country => ({
    value: country.name.common,
    label: country.name.common
  }));

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        }>
          <div className="w-full h-full opacity-20">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>
        </Suspense>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          {/* Logo and Brand Name */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/CD.jpeg" 
              alt="ClaimDoo Logo" 
              className="w-20 h-20 rounded-2xl mb-3 shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white">ClaimDoo</h1>
          </div>
          
          <div className="text-sm text-primary-400 mb-2">
            1 admin user per company
          </div>
          <h2 className="text-4xl font-light text-white mb-2">
            Admin (company) Signup Page
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-8 rounded-3xl"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}
              
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                    placeholder="Create a password (min 8 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 mt-1">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Country selection
                </label>
                <div className="text-xs text-white/50 mb-2">
                  Selected country's currency is set as company's base currency.
                </div>
                {countriesLoading ? (
                  <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-400"></div>
                    <span className="ml-2 text-white/70 text-sm">Loading countries...</span>
                  </div>
                ) : (
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                      errors.country 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                        : 'border-white/10 focus:border-primary-400 focus:ring-primary-400/20'
                    }`}
                    required
                  >
                    <option value="" className="bg-[#1e293b] text-white/70">Select your country</option>
                    {countryOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        className="bg-[#1e293b] text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {errors.country && (
                  <p className="text-sm text-red-400 mt-1">{errors.country}</p>
                )}
                {formData.currency && (
                  <div className="mt-2 text-xs text-primary-400">
                    Base Currency: <strong>{formData.currency}</strong>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading || countriesLoading}
                className="w-full py-3 bg-[#1e3a8a] text-white font-medium rounded-xl hover:bg-[#1e40af] hover:shadow-lg hover:shadow-blue-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Creating Account...' : 'Signup'}
              </button>
            </form>
          
          {/* Footer Link */}
          <div className="mt-6 text-center pt-4 border-t border-white/10">
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
