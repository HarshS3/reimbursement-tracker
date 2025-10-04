import React, { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useAuth } from '../../contexts/AuthContext';
import STRINGS from '../../config/strings';
import { Eye, EyeSlash } from 'phosphor-react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
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

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Lighter Spline Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        }>
          <div className="w-full h-full opacity-20">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Logo and Brand Name */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/CD.jpeg" 
              alt="ClaimDoo Logo" 
              className="w-20 h-20 rounded-2xl mb-3 shadow-lg"
            />
            <h1 className="text-3xl font-bold text-heading">{STRINGS.appName}</h1>
          </div>
          
          <h2 className="text-4xl font-light text-heading mb-2">
            {STRINGS.auth.signinTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-8 rounded-3xl"
        >
          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-primary/10 border border-muted rounded-xl">
            <p className="text-primary font-semibold text-sm mb-2">{STRINGS.auth.demoHeader}</p>
            <div className="space-y-1 text-xs text-body">
              {STRINGS.auth.demoAccounts.map((a) => (
                <p key={a.email}><span className="font-medium text-heading">{a.role}:</span> {a.email} / {a.password}</p>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-danger text-sm">{errors.general}</p>
              </div>
            )}
            
            {/* Email */}
            <div>
              <label className="block text-body text-sm font-medium mb-2">
                {STRINGS.auth.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-muted rounded-xl text-body placeholder-white/40 focus:outline-none" 
                placeholder={STRINGS.auth.emailPlaceholder}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-body text-sm font-medium mb-2">
                {STRINGS.auth.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-muted rounded-xl text-body placeholder-white/40 focus:outline-none"
                  placeholder={STRINGS.auth.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          
          {/* Footer Links */}
            <div className="mt-6 space-y-3 text-center">
              <p className="text-body text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-light font-medium transition-colors"
                >
                  {STRINGS.nav.signUp}
                </Link>
              </p>
              <Link 
                to="/forgot-password" 
                className="block text-sm text-primary hover:text-primary-light transition-colors"
              >
                {STRINGS.auth.forgotPassword}
              </Link>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;