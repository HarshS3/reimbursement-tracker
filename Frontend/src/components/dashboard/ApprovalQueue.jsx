import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge, TextArea, Modal } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenseApi, useCurrencyConversion } from '../../hooks/useApi';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  CurrencyDollar,
  Calendar,
  User,
  Receipt,
  ChatCircle
} from 'phosphor-react';

const ApprovalQueue = ({ onRefresh }) => {
  const { user, company } = useAuth();
  const { getPendingApprovals, decideApproval, loading } = useExpenseApi();
  const { convertCurrency } = useCurrencyConversion();
  
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('approve'); // 'approve' or 'reject'
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [listError, setListError] = useState(null);
  const [approvalError, setApprovalError] = useState(null);

  useEffect(() => {
    loadPendingExpenses();
  }, [user?.id ?? null]);

  const loadPendingExpenses = async () => {
    try {
      const result = await getPendingApprovals();
      if (result.success) {
        const approvals = result.approvals || [];
        setPendingExpenses(approvals);
        setListError(null);

        const conversions = {};
        for (const item of approvals) {
          if (item.currency && company?.currency && item.currency !== company.currency) {
            try {
              const converted = await convertCurrency(
                Number.parseFloat(item.amount || 0) || 0,
                item.currency,
                company.currency
              );
              conversions[item.id] = converted;
            } catch (error) {
              console.error('Currency conversion failed:', error);
            }
          }
        }
        setConvertedAmounts(conversions);
      } else {
        setPendingExpenses([]);
        setListError(result.error || 'Failed to load pending approvals.');
      }
    } catch (e) {
      setPendingExpenses([]);
      setListError('Failed to load pending approvals. Please try again.');
    }
  };

  const handleApprovalAction = (expense, action) => {
    setSelectedExpense(expense);
    setApprovalAction(action);
    setShowApprovalModal(true);
    setComments('');
  };

  const submitApproval = async () => {
    if (!selectedExpense) return;

    setProcessing(true);
    try {
      const decision = approvalAction === 'approve' ? 'Approved' : 'Rejected';
      const result = await decideApproval(selectedExpense.id, decision, comments);

      if (result.success) {
        setShowApprovalModal(false);
        await loadPendingExpenses();
        onRefresh?.();
        setApprovalError(null);
      } else {
        setApprovalError(result.error || 'Failed to submit decision.');
      }
    } catch (error) {
      console.error('Approval failed:', error);
      setApprovalError('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConvertedAmount = (item) => {
    if (item.currency === company?.currency) {
      return `${company?.currency} ${Number.parseFloat(item.amount || 0).toFixed(2)}`;
    }

    const converted = convertedAmounts[item.id];
    if (converted) {
      return (
        <div>
          <div className="text-white font-medium">
            {company?.currency} {converted.convertedAmount.toFixed(2)}
          </div>
          <div className="text-xs text-white/60">
            Original: {item.original_currency || item.currency} {Number.parseFloat(item.original_amount || item.amount || 0).toFixed(2)}
          </div>
        </div>
      );
    }

    return `${item.currency} ${Number.parseFloat(item.amount || 0).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-heading mb-2">
              Approvals to Review
            </h2>
            <p className="body-text text-body">
              Review and approve expense claims from your team
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-heading">{pendingExpenses.length}</div>
            <div className="text-sm text-muted">Pending</div>
          </div>
        </div>

        {listError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{listError}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            <span className="ml-3 text-white/70">Loading expenses...</span>
          </div>
        ) : pendingExpenses.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No pending approvals</p>
            <p className="text-white/40 text-sm">All caught up! New submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-muted border-b border-muted">
              <div>Approval Subject</div>
              <div>Request Owner</div>
              <div>Category</div>
              <div>Request Status</div>
              <div>Total Amount<br/>(in company's currency)</div>
              <div>Actions</div>
            </div>

            {/* Expense Rows */}
            {pendingExpenses.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-6 gap-4 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <Receipt size={16} className="text-primary mr-2" />
                  <div>
                    <div className="text-heading font-medium truncate">{item.description}</div>
                    <div className="text-xs text-muted flex items-center mt-1">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(item.expense_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-medium">
                      {item.employee_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-heading font-medium">{item.employee_name || 'Unknown'}</div>
                    <div className="text-xs text-muted">Employee</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge variant="info" className="capitalize">
                    {item.category}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <Badge variant="warning">
                    {item.status}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <CurrencyDollar size={16} className="text-primary mr-1" />
                  <div className="text-sm">
                    {getConvertedAmount(item)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedExpense(item)}
                    className="p-2"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprovalAction(item, 'approve')}
                    className="bg-green-500/20 text-success hover:bg-green-500/30"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprovalAction(item, 'reject')}
                    className="bg-red-500/20 text-danger hover:bg-red-500/30"
                  >
                    Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Expense Detail Modal */}
      {selectedExpense && !showApprovalModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedExpense(null)}
          title="Expense Details"
          className="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/60">Description</label>
                <p className="text-white font-medium">{selectedExpense.description}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Amount</label>
                <div>{getConvertedAmount(selectedExpense)}</div>
              </div>
              <div>
                <label className="text-sm text-white/60">Category</label>
                <p className="text-white capitalize">{selectedExpense.category}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Date</label>
                <p className="text-white">{formatDate(selectedExpense.expense_date)}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Paid By</label>
                <p className="text-white">{selectedExpense.employee_name}</p>
              </div>
            </div>

            {selectedExpense.comments && (
              <div>
                <label className="text-sm text-white/60">Latest Comments</label>
                <p className="text-white">{selectedExpense.comments}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedExpense(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleApprovalAction(selectedExpense, 'approve')}
                className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                <CheckCircle size={16} className="mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleApprovalAction(selectedExpense, 'reject')}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Approval Action Modal */}
      {showApprovalModal && selectedExpense && (
        <Modal
          isOpen={true}
          onClose={() => setShowApprovalModal(false)}
          title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Expense`}
        >
          <div className="space-y-6">
            {approvalError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{approvalError}</p>
              </div>
            )}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">{selectedExpense.description}</h4>
              <div className="text-sm text-white/60 space-y-1">
                <div>Amount: {getConvertedAmount(selectedExpense)}</div>
                <div>Submitted by: {selectedExpense.employee_name}</div>
                <div>Date: {formatDate(selectedExpense.expense_date)}</div>
              </div>
            </div>

            <TextArea
              label={`Comments ${approvalAction === 'reject' ? '(Required)' : '(Optional)'}`}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={`Add a comment about your ${approvalAction} decision...`}
              rows={4}
              required={approvalAction === 'reject'}
            />

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowApprovalModal(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={submitApproval}
                loading={processing}
                disabled={processing || (approvalAction === 'reject' && !comments.trim())}
                className={
                  approvalAction === 'approve'
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }
              >
                {processing ? 'Processing...' : `${approvalAction === 'approve' ? 'Approve' : 'Reject'} Expense`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApprovalQueue;