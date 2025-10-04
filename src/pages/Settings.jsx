import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '../components/ui';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Eye, 
  Download,
  Trash,
  Lock,
  Phone,
  Camera,
  Check
} from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, company } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [notifications, setNotifications] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    expenseApprovals: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'company', label: 'Company', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Eye }
  ];

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Picture */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-2xl">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Profile Picture</h3>
          <p className="body-text text-sm mb-4">
            Upload a profile picture to personalize your account. JPG, PNG or GIF (max 5MB).
          </p>
          <div className="flex space-x-3">
            <button className="neumorphic-btn glow-on-hover px-4 py-2 rounded-lg text-sm font-medium text-white">
              Upload New
            </button>
            <button className="text-red-400 hover:text-red-300 px-4 py-2 text-sm font-medium transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="luxury-input w-full"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email Address</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            className="luxury-input w-full"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="luxury-input w-full"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Job Title</label>
          <input
            type="text"
            defaultValue="Senior Manager"
            className="luxury-input w-full"
            placeholder="Enter your job title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Department</label>
          <select className="luxury-select w-full appearance-none cursor-pointer">
            <option className="bg-[#1e293b] text-white">Finance</option>
            <option className="bg-[#1e293b] text-white">Sales</option>
            <option className="bg-[#1e293b] text-white">Marketing</option>
            <option className="bg-[#1e293b] text-white">Engineering</option>
            <option className="bg-[#1e293b] text-white">HR</option>
            <option className="bg-[#1e293b] text-white">Operations</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Manager</label>
          <select className="luxury-select w-full appearance-none cursor-pointer">
            <option className="bg-[#1e293b] text-white">John Smith</option>
            <option className="bg-[#1e293b] text-white">Sarah Johnson</option>
            <option className="bg-[#1e293b] text-white">Michael Chen</option>
            <option className="bg-[#1e293b] text-white">Emily Rodriguez</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="text-white/60 hover:text-white px-6 py-3 font-medium transition-colors">
          Cancel
        </button>
        <button className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white">
          Save Changes
        </button>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'General email notifications', description: 'Receive updates about your account and expenses' },
            { key: 'expenseApprovals', label: 'Expense approvals', description: 'Get notified when expenses need approval or are approved' },
            { key: 'weeklyReports', label: 'Weekly expense reports', description: 'Receive weekly summaries of your expense activity' },
            { key: 'securityAlerts', label: 'Security alerts', description: 'Important security notifications and login alerts' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{item.label}</h4>
                <p className="body-text text-sm">{item.description}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key, !notifications[item.key])}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-primary-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-white font-medium mb-1">Browser notifications</h4>
            <p className="body-text text-sm">Receive real-time notifications in your browser</p>
          </div>
          <button
            onClick={() => handleNotificationChange('pushNotifications', !notifications.pushNotifications)}
            className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications.pushNotifications ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white">
          Save Preferences
        </button>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-8">
      {/* Password Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Current Password</label>
            <input
              type="password"
              className="luxury-input w-full"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">New Password</label>
            <input
              type="password"
              className="luxury-input w-full"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm New Password</label>
            <input
              type="password"
              className="luxury-input w-full"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="mt-4">
          <button className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <div className="flex items-start justify-between p-6 glass-card rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Authentication App</h4>
              <p className="body-text text-sm mb-2">
                Use an authentication app to generate secure login codes
              </p>
              <Badge variant="success">Enabled</Badge>
            </div>
          </div>
          <button className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Configure
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        <div className="space-y-4">
          {[
            { device: 'MacBook Pro', location: 'San Francisco, CA', current: true },
            { device: 'iPhone 15', location: 'San Francisco, CA', current: false },
            { device: 'Chrome Browser', location: 'New York, NY', current: false }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 glass-card rounded-xl">
              <div className="flex items-center space-x-4">
                {session.current && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
                <div>
                  <h4 className="text-white font-medium">{session.device}</h4>
                  <p className="body-text text-sm">{session.location}</p>
                </div>
              </div>
              {session.current ? (
                <Badge variant="success">Current Session</Badge>
              ) : (
                <button className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CompanyTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Company Name</label>
          <input
            type="text"
            defaultValue={company?.name || ''}
            className="luxury-input w-full"
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Industry</label>
          <select className="luxury-select w-full appearance-none cursor-pointer" defaultValue={company?.industry || ''}>
            <option className="bg-[#1e293b] text-white">Technology</option>
            <option className="bg-[#1e293b] text-white">Finance</option>
            <option className="bg-[#1e293b] text-white">Healthcare</option>
            <option className="bg-[#1e293b] text-white">Manufacturing</option>
            <option className="bg-[#1e293b] text-white">Retail</option>
            <option className="bg-[#1e293b] text-white">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Company Size</label>
          <select className="luxury-select w-full appearance-none cursor-pointer">
            <option className="bg-[#1e293b] text-white">1-10 employees</option>
            <option className="bg-[#1e293b] text-white">11-50 employees</option>
            <option className="bg-[#1e293b] text-white">51-200 employees</option>
            <option className="bg-[#1e293b] text-white">201-1000 employees</option>
            <option className="bg-[#1e293b] text-white">1000+ employees</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Base Currency</label>
          <select className="luxury-select w-full appearance-none cursor-pointer" defaultValue={company?.currency || ''}>
            <option value="USD" className="bg-[#1e293b] text-white">USD - US Dollar</option>
            <option value="EUR" className="bg-[#1e293b] text-white">EUR - Euro</option>
            <option value="GBP" className="bg-[#1e293b] text-white">GBP - British Pound</option>
            <option value="JPY" className="bg-[#1e293b] text-white">JPY - Japanese Yen</option>
            <option value="CAD" className="bg-[#1e293b] text-white">CAD - Canadian Dollar</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Company Address</label>
          <textarea
            className="luxury-input w-full h-24 resize-none"
            placeholder="Enter company address"
            defaultValue="123 Business Ave, Suite 456, San Francisco, CA 94105"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="text-white/60 hover:text-white px-6 py-3 font-medium transition-colors">
          Cancel
        </button>
        <button className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white">
          Save Changes
        </button>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-8">
      {/* Data Export */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Export</h3>
        <div className="p-6 glass-card rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
              <Download size={24} className="text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-2">Export Your Data</h4>
              <p className="body-text text-sm mb-4">
                Download a copy of all your personal data including expenses, receipts, and account information.
              </p>
              <button className="neumorphic-btn glow-on-hover px-4 py-2 rounded-lg text-sm font-medium text-white">
                Request Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Retention</h3>
        <div className="space-y-4">
          <div className="p-4 glass-card rounded-xl">
            <h4 className="text-white font-medium mb-2">Expense Data</h4>
            <p className="body-text text-sm">
              Your expense data is retained for 7 years as required by tax regulations.
            </p>
          </div>
          <div className="p-4 glass-card rounded-xl">
            <h4 className="text-white font-medium mb-2">Receipt Images</h4>
            <p className="body-text text-sm">
              Receipt images are stored securely and deleted automatically after 10 years.
            </p>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Deletion</h3>
        <div className="p-6 glass-card rounded-xl border border-red-500/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <Trash size={24} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium mb-2">Delete Account</h4>
              <p className="body-text text-sm mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      case 'company':
        return <CompanyTab />;
      case 'privacy':
        return <PrivacyTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            Account
            <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {' '}Settings
            </span>
          </h1>
          <p className="body-text text-xl max-w-3xl mx-auto">
            Manage your account preferences, security settings, and privacy options
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="body-text">
                  {activeTab === 'profile' && 'Update your personal information and profile settings'}
                  {activeTab === 'notifications' && 'Configure how you receive notifications and alerts'}
                  {activeTab === 'security' && 'Manage your password and security preferences'}
                  {activeTab === 'company' && 'Update your company information and settings'}
                  {activeTab === 'privacy' && 'Control your data and privacy preferences'}
                </p>
              </div>

              {renderTabContent()}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;