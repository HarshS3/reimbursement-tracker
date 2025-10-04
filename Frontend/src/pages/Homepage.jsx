import React, { Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { Button, Card } from '../components/ui';
import { 
  ArrowRight, 
  Lightning, 
  Shield, 
  Globe, 
  Users,
  ChartBar,
  Clock,
  CheckCircle,
  Star,
  CurrencyDollar,
  Receipt,
  Robot,
  Sparkle
} from 'phosphor-react';

const Homepage = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const features = [
    {
      icon: Robot,
      title: 'AI-Powered OCR',
      description: 'Automatically extract receipt data with 99%+ accuracy using advanced AI technology',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Multi-Level Approval',
      description: 'Customizable approval workflows with conditional rules and real-time notifications',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Handle expenses in 150+ currencies with real-time conversion and localization',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lightning,
      title: 'Instant Processing',
      description: 'Submit and approve expenses in seconds, not days with automated workflows',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with 3D Spline Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Spline Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/50 text-lg"
              >
                Loading 3D Scene...
              </motion.div>
            </div>
          }>
            <Spline 
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
              style={{ width: '100%', height: '100%', opacity: 0.7 }}
            />
          </Suspense>
        </div>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/50 to-[#0f172a] z-10"></div>
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-20 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-6 py-2 rounded-full glass-card mb-8"
          >
            <Sparkle size={18} className="text-primary-400 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-white/90">AI-Powered Expense Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-text text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light mb-8"
          >
            Expense Management
            <br />
            <span className="text-gradient bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="body-text text-xl sm:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform your expense workflows with AI-powered OCR, intelligent approval systems,
            and seamless multi-currency support
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/signup">
              <Button size="lg" className="group glow-on-hover px-8 py-4 text-lg font-medium">
                Get Started Free
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '99%', label: 'OCR Accuracy', icon: CheckCircle },
              { value: '75%', label: 'Time Saved', icon: Clock },
              { value: '150+', label: 'Currencies', icon: CurrencyDollar },
              { value: '10K+', label: 'Happy Users', icon: Users }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center glass-card p-4 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Icon size={20} className="text-primary-400 mr-2" />
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white/50 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-32 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-2 rounded-full glass-card mb-6">
              <Lightning size={18} className="text-primary-400 mr-2" />
              <span className="text-sm font-medium text-white/90">Powerful Features</span>
            </div>
            <h2 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
              Everything You Need
            </h2>
            <p className="body-text text-xl max-w-2xl mx-auto">
              Built for modern businesses with advanced technology and intuitive design
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="p-8 h-full relative overflow-hidden transition-all duration-300">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {feature.title}
                      </h3>
                      
                      <p className="body-text text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-32 bg-[#1e293b]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-2 rounded-full glass-card mb-6">
              <Receipt size={18} className="text-primary-400 mr-2" />
              <span className="text-sm font-medium text-white/90">Simple Process</span>
            </div>
            <h2 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
              How It Works
            </h2>
            <p className="body-text text-xl max-w-2xl mx-auto">
              Get started in minutes with our intuitive three-step process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Capture Receipt', 
                description: 'Snap a photo of your receipt or upload from your device. Our mobile app makes it instant.',
                icon: Receipt,
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                step: '02', 
                title: 'AI Extraction', 
                description: 'Our AI automatically extracts all relevant data with 99%+ accuracy in seconds.',
                icon: Robot,
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                step: '03', 
                title: 'Submit & Approve', 
                description: 'Review, submit, and get instant approvals through smart workflows and notifications.',
                icon: CheckCircle,
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {/* Background Step Number */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-8xl font-bold text-white/5">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center glow-on-hover shadow-2xl`}>
                      <Icon size={44} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="body-text text-lg leading-relaxed">{item.description}</p>
                  
                  {/* Connector Line (except for last item) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-transparent transform -translate-x-1/2"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="text-center">
              <h2 className="hero-text text-3xl sm:text-4xl font-light mb-4">
                Ready to Transform Your Expense Management?
              </h2>
              <p className="body-text text-lg mb-8">
                Join thousands of companies already using ClaimDoo to streamline their expense processes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="group">
                    Start Free Trial
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;