import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Select, TextArea, Badge } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Plus, 
  Gear, 
  Users, 
  Percent, 
  CheckCircle, 
  PencilSimple, 
  Trash,
  User
} from 'phosphor-react';

const ApprovalRules = () => {
  const { user, company } = useAuth();
  const [rules, setRules] = useState([]);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ruleType: 'percentage', // 'percentage', 'specific', 'hybrid'
    manager: '',
    approvers: [{ name: 'John', required: true }, { name: 'Mitchell', required: false }, { name: 'Andreas', required: false }],
    approverSequence: false,
    minimumApprovalPercentage: 60
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load existing approval rules
    const savedRules = JSON.parse(localStorage.getItem('claimdoo_approval_rules') || '[]');
    if (savedRules.length === 0) {
      // Add default rule for demo
      const defaultRule = {
        id: 1,
        name: 'Approval rule for miscellaneous expenses',
        description: 'Default approval workflow for general expenses',
        ruleType: 'percentage',
        manager: 'Sarah',
        approvers: [
          { name: 'John', required: true },
          { name: 'Mitchell', required: false },
          { name: 'Andreas', required: false }
        ],
        approverSequence: false,
        minimumApprovalPercentage: 60,
        createdAt: new Date().toISOString()
      };
      setRules([defaultRule]);
      localStorage.setItem('claimdoo_approval_rules', JSON.stringify([defaultRule]));
    } else {
      setRules(savedRules);
    }
  }, []);

  const handleOpenForm = (rule = null) => {
    setEditingRule(rule);
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        ruleType: rule.ruleType,
        manager: rule.manager,
        approvers: rule.approvers,
        approverSequence: rule.approverSequence,
        minimumApprovalPercentage: rule.minimumApprovalPercentage
      });
    } else {
      setFormData({
        name: '',
        description: '',
        ruleType: 'percentage',
        manager: '',
        approvers: [{ name: '', required: false }],
        approverSequence: false,
        minimumApprovalPercentage: 60
      });
    }
    setErrors({});
    setShowRuleForm(true);
  };

  const handleCloseForm = () => {
    setShowRuleForm(false);
    setEditingRule(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleApproverChange = (index, field, value) => {
    const updatedApprovers = [...formData.approvers];
    updatedApprovers[index][field] = value;
    setFormData(prev => ({
      ...prev,
      approvers: updatedApprovers
    }));
  };

  const addApprover = () => {
    setFormData(prev => ({
      ...prev,
      approvers: [...prev.approvers, { name: '', required: false }]
    }));
  };

  const removeApprover = (index) => {
    if (formData.approvers.length > 1) {
      const updatedApprovers = formData.approvers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        approvers: updatedApprovers
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.ruleType === 'percentage' && (formData.minimumApprovalPercentage < 1 || formData.minimumApprovalPercentage > 100)) {
      newErrors.minimumApprovalPercentage = 'Percentage must be between 1 and 100';
    }

    const validApprovers = formData.approvers.filter(approver => approver.name.trim());
    if (validApprovers.length === 0) {
      newErrors.approvers = 'At least one approver is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const ruleData = {
      ...formData,
      approvers: formData.approvers.filter(approver => approver.name.trim()),
      id: editingRule ? editingRule.id : Date.now(),
      createdAt: editingRule ? editingRule.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedRules;
    if (editingRule) {
      updatedRules = rules.map(rule => rule.id === editingRule.id ? ruleData : rule);
    } else {
      updatedRules = [...rules, ruleData];
    }

    setRules(updatedRules);
    localStorage.setItem('claimdoo_approval_rules', JSON.stringify(updatedRules));
    handleCloseForm();
  };

  const deleteRule = (ruleId) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    localStorage.setItem('claimdoo_approval_rules', JSON.stringify(updatedRules));
  };

  const ruleTypeOptions = [
    { value: 'percentage', label: 'Percentage Rule' },
    { value: 'specific', label: 'Specific Approver Rule' },
    { value: 'hybrid', label: 'Hybrid Rule' }
  ];

  const availableManagers = ['Sarah', 'Michael', 'David', 'Emma'];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-2">
              Approval Rules
            </h2>
            <p className="body-text text-body">
              Configure multi-level approval workflows and conditional rules
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <Plus size={16} className="mr-2" />
            New Rule
          </Button>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-12">
            <Gear size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No approval rules configured</p>
            <p className="text-white/40 text-sm">Create your first approval rule to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-heading mb-2">{rule.name}</h3>
                    <p className="text-muted text-sm mb-3">{rule.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <User size={14} className="text-muted mr-1" />
                        <span className="text-body">Manager: {rule.manager}</span>
                      </div>
                      
                      <Badge variant="info" className="capitalize">
                        {rule.ruleType} Rule
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenForm(rule)}
                      className="p-2"
                    >
                      <PencilSimple size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center">
                        <Users size={16} className="mr-2" />
                        Approvers
                      </h4>
                      <div className="space-y-2">
                        {rule.approvers.map((approver, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                                <span className="text-white text-xs">{index + 1}</span>
                              </div>
                              <span className="text-body">{approver.name}</span>
                            </div>
                            {approver.required ? (
                              <Badge variant="success" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="default" className="text-xs">Optional</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center">
                        <Gear size={16} className="mr-2" />
                        Rule Configuration
                      </h4>
                      <div className="space-y-3">
                        {rule.ruleType === 'percentage' && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center text-body">
                              <Percent size={16} className="mr-2" />
                              <span>Minimum Approval: {rule.minimumApprovalPercentage}%</span>
                            </div>
                            <p className="text-xs text-muted mt-1">
                              Specify the number of percentage approvers required in order to get the request approved.
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center text-body">
                            <CheckCircle size={16} className="mr-2" />
                            <span>Sequential Approval: {rule.approverSequence ? 'Yes' : 'No'}</span>
                          </div>
                          {rule.approverSequence ? (
                            <p className="text-xs text-muted mt-1">
                              If this field is ticked true then the above mentioned sequence of approvers matters, 
                              that is first the request goes to John, if he approves/rejects then only request goes 
                              to mitchell and so on.
                            </p>
                          ) : (
                            <p className="text-xs text-muted mt-1">
                              If not ticked then send approver request to all approvers at the same time.
                            </p>
                          )}
                        </div>
                        
                        {!rule.approverSequence && (
                          <p className="text-xs text-muted">
                            If the required approver rejects the request, then expense request is auto-rejected.
                            If not ticked then send approver request to all approvers at the same time.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Rule Form Modal */}
      {showRuleForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseForm} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-heading">
                   {editingRule ? 'Edit Approval Rule' : 'Create Approval Rule'}
                 </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Rule Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter rule name"
                    error={errors.name}
                    required
                  />

                  <Select
                    label="Rule Type"
                    name="ruleType"
                    value={formData.ruleType}
                    onChange={handleInputChange}
                    options={ruleTypeOptions}
                  />
                </div>

                <TextArea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this rule is for"
                  error={errors.description}
                  required
                  rows={3}
                />

                <Select
                  label="Manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select manager' },
                    ...availableManagers.map(manager => ({ value: manager, label: manager }))
                  ]}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Approvers</h4>
                    <Button type="button" size="sm" onClick={addApprover}>
                      <Plus size={14} className="mr-1" />
                      Add Approver
                    </Button>
                  </div>
                  
                  <div className="text-xs text-white/60 mb-4">
                    If this field is ticked then by default the expense request would go to his/her manager first, before going to other approvers.
                  </div>

                  {formData.approvers.map((approver, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary-400 text-sm">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <Input
                          placeholder="Approver name"
                          value={approver.name}
                          onChange={(e) => handleApproverChange(index, 'name', e.target.value)}
                          className="bg-transparent border-white/10"
                        />
                      </div>
                      
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={approver.required}
                          onChange={(e) => handleApproverChange(index, 'required', e.target.checked)}
                          className="rounded border-white/20 bg-transparent text-primary-500 focus:ring-primary-500/20 mr-2"
                        />
                        <span className="text-white/80">Required</span>
                      </label>
                      
                      {formData.approvers.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeApprover(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.approvers && (
                    <p className="text-red-400 text-sm">{errors.approvers}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="approverSequence"
                      checked={formData.approverSequence}
                      onChange={handleInputChange}
                      className="rounded border-white/20 bg-transparent text-primary-500 focus:ring-primary-500/20 mr-3"
                    />
                    <span className="text-white font-medium">Approvers Sequence</span>
                  </label>
                  <p className="text-xs text-white/60">
                    If this field is ticked true then the above mentioned sequence of approvers matters,
                    that is first the request goes to John, if he approves/rejects then only request goes
                    to mitchell and so on. If the required approver rejects the request, then expense request is auto-rejected.
                    If not ticked then send approver request to all approvers at the same time.
                  </p>
                </div>

                {formData.ruleType === 'percentage' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/90">
                      Minimum Approval Percentage: {formData.minimumApprovalPercentage}%
                    </label>
                    <input
                      type="range"
                      name="minimumApprovalPercentage"
                      min="1"
                      max="100"
                      value={formData.minimumApprovalPercentage}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <p className="text-xs text-white/60">
                      Specify the number of percentage approvers required in order to get the request approved.
                    </p>
                    {errors.minimumApprovalPercentage && (
                      <p className="text-red-400 text-sm">{errors.minimumApprovalPercentage}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="secondary" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalRules;