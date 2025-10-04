import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui';
import { 
  Target, 
  Users, 
  Heart, 
  Lightbulb,
  TrendUp,
  Globe,
  Shield,
  Sparkle
} from 'phosphor-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI and OCR technology to eliminate manual expense processing.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with our users in mind, making expense management effortless.'
    },
    {
      icon: Shield,
      title: 'Security Focused',
      description: 'Enterprise-grade security ensures your financial data is always protected.'
    },
    {
      icon: Globe,
      title: 'Global Ready',
      description: 'Multi-currency support and international compliance out of the box.'
    }
  ];

  const team = [
    {
      name: 'Parth Srivastava',
      role: '3rd Year, Nirma University',
      bio: 'Full-stack developer passionate about creating seamless user experiences.',
      avatar: null,
      email: 'parth.srivastava660@gmail.com'
    },
    {
      name: 'Harsh Shah',
      role: '3rd Year, Nirma University',
      bio: 'Backend specialist focused on scalable architectures and API design.',
      avatar: null,
      email: '23bce089@nirmauni.ac.in'
    },
    {
      name: 'Rudra Moradiya',
      role: '3rd Year, Nirma University',
      bio: 'Frontend enthusiast with expertise in modern React and UI/UX design.',
      avatar: null,
      email: '23bce189@nirmauni.ac.in'
    },
    {
      name: 'Advait Pandya',
      role: '3rd Year, Nirma University',
      bio: 'AI/ML enthusiast specializing in OCR technology and intelligent automation.',
      avatar: null,
      email: '23bce012@nirmauni.ac.in'
    }
  ];

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            The Story Behind
            <br />
            <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              ClaimDoo
            </span>
          </h1>
          <p className="body-text text-xl max-w-3xl mx-auto">
            Born from frustration with outdated expense systems, ClaimDoo represents the future 
            of intelligent expense management for modern businesses.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="text-center p-12">
            <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Sparkle size={32} className="text-primary-400" />
            </div>
            <h2 className="hero-text text-3xl font-light mb-6">Our Mission</h2>
            <p className="body-text text-lg max-w-4xl mx-auto leading-relaxed">
              To eliminate the pain points of expense management through intelligent automation. 
              We believe that finance teams should focus on strategic decisions, not manual data entry. 
              By combining AI-powered OCR, smart approval workflows, and seamless multi-currency support, 
              we're building the expense management platform that modern businesses deserve.
            </p>
          </Card>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="hero-text text-3xl font-light mb-6">Why We Built ClaimDoo</h2>
              <div className="space-y-6 body-text">
                <p>
                  After years of working in finance teams, our founders experienced firsthand 
                  the frustration of manual expense processing. Hours spent on data entry, 
                  approval bottlenecks, and currency conversion errors were draining productivity 
                  and morale.
                </p>
                <p>
                  The breaking point came during a quarterly review when it took three weeks 
                  to process a simple expense report due to approval chain confusion. That's 
                  when we decided to build the solution we wished existed.
                </p>
                <p>
                  ClaimDoo isn't just another expense tool – it's a complete reimagining of 
                  how expense management should work in the modern workplace.
                </p>
              </div>
            </div>
            
            <Card className="p-8">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Lightbulb size={24} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">2019</h3>
                    <p className="text-white/70 text-sm">
                      Founded with the vision to automate expense management using AI
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <TrendUp size={24} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">2022</h3>
                    <p className="text-white/70 text-sm">
                      Achieved 99%+ OCR accuracy and launched multi-currency support
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Users size={24} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">2024</h3>
                    <p className="text-white/70 text-sm">
                      Serving thousands of companies worldwide with intelligent expense automation
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="hero-text text-3xl sm:text-4xl font-light mb-4">Our Values</h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} className="text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="body-text text-sm">{value.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="hero-text text-3xl sm:text-4xl font-light mb-4">Meet Our Team</h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              3rd year students from Nirma University building intelligent expense management solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-medium">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-400 text-sm font-medium mb-2">{member.role}</p>
                  <p className="body-text text-xs mb-3 text-white/50">{member.email}</p>
                  <p className="body-text text-sm">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;