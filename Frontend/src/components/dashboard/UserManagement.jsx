import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Select, Modal, Badge } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useUserApi } from '../../hooks/useApi';
import { 
  Plus, 
  User, 
  Envelope, 
  Shield, 
  PencilSimple, 
  Trash,
  Eye,
  EyeSlash,
  PaperPlaneTilt
} from 'phosphor-react';

const UserManagement = () => {
  const { user: currentUser, company } = useAuth();
  const { getUsers, createUser, updateUser, loading } = useUserApi();
  
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    manager: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Generate random password when modal opens for new user
    if (showUserModal && !editingUser) {
      setFormData(prev => ({
        ...prev,
        password: generateRandomPassword()
      }));
    }
  }, [showUserModal, editingUser]);

  const loadUsers = async () => {
    const result = await getUsers();
    if (result.success) {
      setUsers(result.users);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager || '',
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        manager: '',
        password: generateRandomPassword()
      });
    }
    setErrors({});
    setShowUserModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      manager: '',
      password: ''
    });
    setErrors({});
  };

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

    // Check if email already exists (exclude current user when editing)
    const emailExists = users.some(user => 
      user.email === formData.email && (!editingUser || user.id !== editingUser.id)
    );
    if (emailExists) {
      newErrors.email = 'Email already exists';
    }

    if (!editingUser && !formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let result;
      if (editingUser) {
        result = await updateUser(editingUser.id, formData);
      } else {
        result = await createUser({
          ...formData,
          companyId: company?.id
        });
      }

      if (result.success) {
        await loadUsers();
        handleCloseModal();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendPassword = (user) => {
    setPasswordUser(user);
    setShowPasswordModal(true);
    
    // Simulate sending password email
    setTimeout(() => {
      setShowPasswordModal(false);
      // In real app, this would trigger an API call to send password reset email
      console.log(`Password sent to ${user.email}`);
    }, 2000);
  };

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ];

  const managerOptions = [
    { value: '', label: 'No manager' },
    ...users
      .filter(user => user.role === 'manager' || user.role === 'admin')
      .map(user => ({ value: user.name, label: user.name }))
  ];

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'employee': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">User Management</h2>
            <p className="body-text">
              Manage employees, managers, and their roles
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={16} className="mr-2" />
            New User
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            <span className="ml-3 text-white/70">Loading users...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-white/60 border-b border-white/10">
              <div>User</div>
              <div>Role</div>
              <div>Manager</div>
              <div>Email</div>
              <div>Actions</div>
            </div>

            {/* User Rows */}
            {users.length === 0 ? (
              <div className="text-center py-12">
                <User size={48} className="text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No users found</p>
                <p className="text-white/40 text-sm">
                  {users.length === 0 ? 'Can create a new user on the fly, if no user found with that name.' : ''}
                </p>
              </div>
            ) : (
              users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-5 gap-4 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-xs text-white/60">
                        {user.id === currentUser?.id && '(You)'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>

                  <div className="flex items-center">
                    <span className="text-white/80">
                      {user.manager || '-'}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Envelope size={14} className="text-white/40 mr-2" />
                    <span className="text-white/80 text-sm">{user.email}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenModal(user)}
                      className="p-2"
                    >
                      <PencilSimple size={14} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendPassword(user)}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                      Send Password
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* User Modal */}
      {showUserModal && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title={editingUser ? 'Edit User' : 'Create New User'}
          className="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              error={errors.email}
              required
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              error={errors.role}
            />

            <Select
              label="Manager"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              options={managerOptions}
              error={errors.manager}
            />

            {!editingUser && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Generated Password
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    readOnly
                    className="pr-20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setFormData(prev => ({ ...prev, password: generateRandomPassword() }))}
                      className="p-1 text-xs"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-white/60">
                  Clicking on this button should send a randomly generated unique password in mail of that user, 
                  afterwards user can change his password by logging in
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Send Password Modal */}
      {showPasswordModal && passwordUser && (
        <Modal
          isOpen={true}
          onClose={() => setShowPasswordModal(false)}
          title="Sending Password"
          className="max-w-sm"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto">
              <PaperPlaneTilt size={32} className="text-primary-400 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-medium mb-2">
                Sending password to {passwordUser.name}
              </p>
              <p className="text-white/60 text-sm">
                A secure password will be sent to {passwordUser.email}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400"></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;