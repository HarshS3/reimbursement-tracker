import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, TextArea } from '../components/ui';
import { 
  Envelope, 
  Phone, 
  MapPin, 
  Clock,
  PaperPlaneTilt,
  CheckCircle
} from 'phosphor-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Envelope,
      title: 'Email',
      content: 'hello@claimdoo.com',
      description: 'Send us an email anytime!'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Business St, Suite 100\nSan Francisco, CA 94105',
      description: 'Come say hello at our HQ!'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      content: 'Monday - Friday\n8:00 AM - 6:00 PM PST',
      description: 'We\'re here to help!'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto text-center p-12">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Message Sent Successfully!
            </h2>
            <p className="body-text mb-6">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            Get in
            <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {' '}Touch
            </span>
          </h1>
          <p className="body-text text-xl max-w-3xl mx-auto">
            Have questions about ClaimDoo? Want to see a demo? We'd love to hear from you. 
            Our team is here to help you transform your expense management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card>
                <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{errors.general}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      error={errors.name}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company (Optional)"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      error={errors.subject}
                      required
                    />
                  </div>

                  <TextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about what you need..."
                    error={errors.message}
                    rows={6}
                    required
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <PaperPlaneTilt size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={info.title} className="flex items-start">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Icon size={20} className="text-primary-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{info.title}</h4>
                          <p className="text-white/80 whitespace-pre-line mb-1">{info.content}</p>
                          <p className="text-white/60 text-sm">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Quick Support */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Need Quick Support?</h3>
                <p className="body-text text-sm mb-6">
                  Check out our comprehensive help center for instant answers to common questions.
                </p>
                <Button variant="secondary" className="w-full">
                  Visit Help Center
                </Button>
              </Card>
            </motion.div>

            {/* Enterprise Sales */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Enterprise Sales</h3>
                <p className="body-text text-sm mb-6">
                  Looking for custom solutions? Our enterprise team can help design the perfect plan for your organization.
                </p>
                <Button className="w-full">
                  Contact Sales Team
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="hero-text text-3xl font-light mb-4">Frequently Asked Questions</h2>
            <p className="body-text">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'How quickly can we get started?',
                answer: 'Most teams are up and running within 24 hours. Our onboarding process is designed to be quick and seamless.'
              },
              {
                question: 'Do you offer training for new users?',
                answer: 'Yes! We provide comprehensive training sessions and ongoing support to ensure your team gets the most out of ClaimDoo.'
              },
              {
                question: 'Can ClaimDoo integrate with our existing systems?',
                answer: 'Absolutely. We offer integrations with popular accounting, ERP, and HR systems. Contact us for specific integration requirements.'
              },
              {
                question: 'What about data security and compliance?',
                answer: 'Security is our top priority. We maintain SOC 2 compliance and use enterprise-grade encryption to protect your data.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                <p className="body-text text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;