import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui';
import { 
  Plus, 
  MagnifyingGlass, 
  PaperPlaneTilt,
  CaretDown,
  X
} from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';

const UsersManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'marc',
      role: 'Manager',
      manager: 'Sarah',
      email: 'marc@gmail.com'
    }
  ]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Employee',
    manager: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = ['Manager', 'Employee'];
  const managers = users.filter(u => u.role === 'Manager').map(u => u.name);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!newUser.name.trim()) newErrors.name = 'Name is required';
    if (!newUser.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(newUser.email)) newErrors.email = 'Email is invalid';
    
    // Check if user with same name exists
    if (users.some(u => u.name.toLowerCase() === newUser.name.toLowerCase())) {
      newErrors.name = 'User with this name already exists';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userToAdd = {
        id: users.length + 1,
        name: newUser.name,
        role: newUser.role,
        manager: newUser.role === 'Employee' ? newUser.manager : '',
        email: newUser.email
      };
      
      setUsers([...users, userToAdd]);
      setShowNewUserModal(false);
      setNewUser({ name: '', role: 'Employee', manager: '', email: '' });
      setErrors({});
      setLoading(false);
      
      // In production: Send password via email
      alert(`Password sent to ${newUser.email}`);
    }, 500);
  };

  const handleSendPassword = (userEmail) => {
    // Simulate sending password
    alert(`Password sent to ${userEmail}`);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light text-white mb-2">
            Users Management
          </h1>
          <p className="text-white/60">
            Manage company employees and managers
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" 
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
            />
          </div>

          {/* New User Button */}
          <button
            onClick={() => setShowNewUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
          >
            <Plus size={20} weight="bold" />
            <span>New</span>
          </button>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                      Manager
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white/90">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            user.role === 'Manager' 
                              ? 'bg-primary-500/20 text-primary-400' 
                              : 'bg-white/10 text-white/70'
                          }`}>
                            {user.role}
                          </span>
                          <CaretDown size={16} className="text-white/40" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {user.manager || '-'}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleSendPassword(user.email)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
                          >
                            <PaperPlaneTilt size={16} />
                            Send password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-white/40">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* New User Modal */}
        {showNewUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">Create New User</h2>
                  <button
                    onClick={() => {
                      setShowNewUserModal(false);
                      setNewUser({ name: '', role: 'Employee', manager: '', email: '' });
                      setErrors({});
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-white/70" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                      placeholder="Enter user name"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                      placeholder="user@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value, manager: '' })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                    >
                      {roles.map(role => (
                        <option key={role} value={role} className="bg-[#1e293b] text-white">
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manager (only for employees) */}
                  {newUser.role === 'Employee' && (
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Manager
                      </label>
                      <select
                        value={newUser.manager}
                        onChange={(e) => setNewUser({ ...newUser, manager: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-[#1e293b] text-white/70">
                          Select a manager
                        </option>
                        {managers.map(manager => (
                          <option key={manager} value={manager} className="bg-[#1e293b] text-white">
                            {manager}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Info Note */}
                  <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
                    <p className="text-primary-400 text-xs">
                      A randomly generated password will be sent to the user's email
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewUserModal(false);
                        setNewUser({ name: '', role: 'Employee', manager: '', email: '' });
                        setErrors({});
                      }}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
