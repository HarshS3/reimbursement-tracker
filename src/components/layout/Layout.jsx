import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  List, 
  X, 
  User, 
  SignOut, 
  House, 
  Info,
  Gear
} from 'phosphor-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: House },
    { name: 'About', href: '/about', icon: Info },
  ];

  const authItems = isAuthenticated ? [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Settings', href: '/settings', icon: Gear },
  ] : [];

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-card backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/CD.jpeg" 
              alt="ClaimDoo Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-semibold text-white">ClaimDoo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-primary-400'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="neumorphic-btn glow-on-hover px-4 py-2 rounded-xl text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass-card"
          >
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <List size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-sm glass-card backdrop-blur-xl md:hidden"
          >
            <div className="p-6 pt-20">
              <div className="space-y-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 text-lg font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary-400'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Icon size={24} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {isAuthenticated ? (
                  <>
                    <div className="border-t border-white/10 pt-6">
                      {authItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 text-lg font-medium text-white/70 hover:text-white transition-colors duration-200 mb-4"
                          >
                            <Icon size={24} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 text-lg font-medium text-white/70 hover:text-white transition-colors duration-200"
                      >
                        <SignOut size={24} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <Link
                      to="/signin"
                      onClick={() => setIsOpen(false)}
                      className="block text-lg font-medium text-white/70 hover:text-white transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block neumorphic-btn glow-on-hover px-6 py-3 rounded-xl text-lg font-medium text-white text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;