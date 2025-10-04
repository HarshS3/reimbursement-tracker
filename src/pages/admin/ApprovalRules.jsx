import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui';
import { 
  Plus, 
  X,
  CheckSquare,
  Square,
  CaretDown,
  Info
} from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';

const ApprovalRules = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // Mock users data - in production, fetch from API
  const [allUsers] = useState([
    { id: 1, name: 'John', role: 'Manager' },
    { id: 2, name: 'Mitchell', role: 'Manager' },
    { id: 3, name: 'Andreas', role: 'Manager' },
    { id: 4, name: 'Sarah', role: 'Manager' },
  ]);

  const [newRule, setNewRule] = useState({
    category: '',
    name: '',
    description: '',
    manager: '',
    isManagerApprover: false,
    approvers: [],
    approverSequence: false,
    minApprovalPercentage: 100
  });
  const [errors, setErrors] = useState({});

  const categories = ['Food', 'Travel', 'Accommodation', 'Office Supplies', 'Entertainment', 'Other'];

  const handleAddRule = () => {
    setEditingRule(null);
    setNewRule({
      category: '',
      name: '',
      description: '',
      manager: '',
      isManagerApprover: false,
      approvers: [],
      approverSequence: false,
      minApprovalPercentage: 100
    });
    setShowRuleModal(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setShowRuleModal(true);
  };

  const toggleApprover = (userId) => {
    setNewRule(prev => {
      const exists = prev.approvers.find(a => a.userId === userId);
      if (exists) {
        return {
          ...prev,
          approvers: prev.approvers.filter(a => a.userId !== userId)
        };
      } else {
        return {
          ...prev,
          approvers: [...prev.approvers, { userId, required: false }]
        };
      }
    });
  };

  const toggleRequired = (userId) => {
    setNewRule(prev => ({
      ...prev,
      approvers: prev.approvers.map(a => 
        a.userId === userId ? { ...a, required: !a.required } : a
      )
    }));
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!newRule.category) newErrors.category = 'Category is required';
    if (!newRule.name.trim()) newErrors.name = 'Rule name is required';
    if (!newRule.description.trim()) newErrors.description = 'Description is required';
    if (!newRule.manager) newErrors.manager = 'Manager selection is required';
    if (newRule.approvers.length === 0) {
      newErrors.approvers = 'At least one approver is required';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...newRule, id: r.id } : r));
    } else {
      setRules([...rules, { ...newRule, id: rules.length + 1 }]);
    }
    
    setShowRuleModal(false);
    setNewRule({
      category: '',
      name: '',
      description: '',
      manager: '',
      isManagerApprover: false,
      approvers: [],
      approverSequence: false,
      minApprovalPercentage: 100
    });
    setErrors({});
  };

  const getApproverNames = (approverIds) => {
    return approverIds
      .map(a => allUsers.find(u => u.id === a.userId)?.name)
      .filter(Boolean)
      .join(', ');
  };

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
            Approval Rules
          </h1>
          <p className="text-white/60">
            Configure approval workflows for expense reimbursements
          </p>
        </motion.div>

        {/* Add Rule Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleAddRule}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
          >
            <Plus size={20} weight="bold" />
            <span>New Rule</span>
          </button>
        </motion.div>

        {/* Rules List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {rules.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Info size={32} className="text-white/40" />
              </div>
              <h3 className="text-xl font-light text-white mb-2">No Rules Created</h3>
              <p className="text-white/60 mb-6">
                Create your first approval rule to start managing expense approvals
              </p>
              <button
                onClick={handleAddRule}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
              >
                <Plus size={20} weight="bold" />
                <span>Create First Rule</span>
              </button>
            </Card>
          ) : (
            rules.map((rule, index) => (
              <Card key={rule.id} className="p-6 hover:border-primary-400/30 transition-colors cursor-pointer"
                onClick={() => handleEditRule(rule)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{rule.name}</h3>
                    <p className="text-white/70 text-sm">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rule.category && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium">
                        {rule.category}
                      </span>
                    )}
                    {rule.isManagerApprover && (
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-medium">
                        Manager Approval
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Manager</p>
                    <p className="text-white font-medium">{rule.manager}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Approvers</p>
                    <p className="text-white font-medium">{getApproverNames(rule.approvers)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Min. Approval</p>
                    <p className="text-white font-medium">{rule.minApprovalPercentage}%</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </motion.div>

        {/* Rule Modal */}
        {showRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-3xl my-8"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    {editingRule ? 'Edit Approval Rule' : 'Create Approval Rule'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowRuleModal(false);
                      setNewRule({
                        name: '',
                        description: '',
                        manager: '',
                        isManagerApprover: false,
                        approvers: [],
                        approverSequence: false,
                        minApprovalPercentage: 100
                      });
                      setErrors({});
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-white/70" />
                  </button>
                </div>

                <form onSubmit={handleSaveRule} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Expense Category
                    </label>
                    <select
                      value={newRule.category}
                      onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-[#1e293b] text-white/70">
                        Select category
                      </option>
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-[#1e293b]">
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-400 mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Rule Name */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Rule Name
                    </label>
                    <input
                      type="text"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                      placeholder="e.g., Approval rule for miscellaneous expenses"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Description about rules
                    </label>
                    <textarea
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all resize-none"
                      placeholder="Describe the purpose and conditions of this rule..."
                      required
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400 mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Manager Selection */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Manager
                    </label>
                    <select
                      value={newRule.manager}
                      onChange={(e) => setNewRule({ ...newRule, manager: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-[#1e293b] text-white/70">
                        Select manager
                      </option>
                      {allUsers.filter(u => u.role === 'Manager').map(manager => (
                        <option key={manager.id} value={manager.name} className="bg-[#1e293b]">
                          {manager.name}
                        </option>
                      ))}
                    </select>
                    {errors.manager && (
                      <p className="text-sm text-red-400 mt-1">{errors.manager}</p>
                    )}
                    <p className="text-xs text-white/50 mt-2">
                      Initially the manager set on user record should be set, admin can change manager for approval if required.
                    </p>
                  </div>

                  {/* Is Manager an Approver */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div 
                        onClick={() => setNewRule({ ...newRule, isManagerApprover: !newRule.isManagerApprover })}
                        className="flex items-center"
                      >
                        {newRule.isManagerApprover ? (
                          <CheckSquare size={24} className="text-primary-400" weight="fill" />
                        ) : (
                          <Square size={24} className="text-white/40" />
                        )}
                      </div>
                      <div>
                        <span className="text-white/90 font-medium">Is manager an approver?</span>
                        <p className="text-xs text-white/50 mt-1">
                          If this field is checked then by default the approver request would go to his/her manager first, before going to other approvers.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Approvers Section */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Approvers
                    </label>
                    <Card className="p-4 bg-white/5">
                      <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-b border-white/10">
                        <div className="text-white/70 text-sm font-medium">User</div>
                        <div className="text-white/70 text-sm font-medium text-center">Required</div>
                        <div></div>
                      </div>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {allUsers.map((approver, index) => {
                          const isSelected = newRule.approvers.find(a => a.userId === approver.id);
                          const isRequired = isSelected?.required || false;
                          
                          return (
                            <div key={approver.id} className="grid grid-cols-3 gap-4 items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-medium">
                                    {approver.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{approver.name}</p>
                                  <span className="text-xs px-2 py-0.5 bg-white/10 text-white/70 rounded">
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => toggleRequired(approver.id)}
                                  disabled={!isSelected}
                                  className="disabled:opacity-30"
                                >
                                  {isRequired ? (
                                    <CheckSquare size={24} className="text-primary-400" weight="fill" />
                                  ) : (
                                    <Square size={24} className="text-white/40" />
                                  )}
                                </button>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => toggleApprover(approver.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isSelected 
                                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                      : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                                  }`}
                                >
                                  {isSelected ? 'Remove' : 'Add'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                    {errors.approvers && (
                      <p className="text-sm text-red-400 mt-1">{errors.approvers}</p>
                    )}
                    <p className="text-xs text-white/50 mt-2">
                      If this field is ticked then the author of the request is required to any approval/rejection before the request goes to any other approvers as per above listed in order.
                    </p>
                  </div>

                  {/* Approvers Sequence */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div 
                        onClick={() => setNewRule({ ...newRule, approverSequence: !newRule.approverSequence })}
                        className="flex items-center"
                      >
                        {newRule.approverSequence ? (
                          <CheckSquare size={24} className="text-primary-400" weight="fill" />
                        ) : (
                          <Square size={24} className="text-white/40" />
                        )}
                      </div>
                      <div>
                        <span className="text-white/90 font-medium">Approvers Sequence:</span>
                        <p className="text-xs text-white/50 mt-1">
                          If this field is ticked then the above mentioned sequence of approvers matters, that is first the request goes to John, if he approves/rejects then only request goes to mitchell and so on.
                          <br />
                          If the required approver rejects the request, then expense request is auto-rejected.
                          <br />
                          If not ticked then send approver request to all approvers at the same time.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Minimum Approval Percentage */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Minimum Approval percentage:
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newRule.minApprovalPercentage}
                        onChange={(e) => setNewRule({ ...newRule, minApprovalPercentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all"
                      />
                      <span className="text-white/70">%</span>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Specify the number of percentage approvers required in order to get the request approved.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRuleModal(false);
                        setNewRule({
                          name: '',
                          description: '',
                          manager: '',
                          isManagerApprover: false,
                          approvers: [],
                          approverSequence: false,
                          minApprovalPercentage: 100
                        });
                        setErrors({});
                      }}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
                    >
                      {editingRule ? 'Update Rule' : 'Create Rule'}
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

export default ApprovalRules;
