import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui';
import { 
  Upload,
  Plus,
  Image as ImageIcon,
  X,
  Camera
} from 'phosphor-react';
import Tesseract from 'tesseract.js';

const EmployeeExpenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      employee: 'Sarah',
      description: 'Restaurant bill',
      date: '9th Oct, 2025',
      category: 'Food',
      paidBy: 'Sarah',
      remarks: 'Movie',
      amount: 5000,
      status: 'Draft'
    },
    {
      id: 2,
      employee: 'Sarah',
      description: 'Flight tickets',
      date: '8th Oct, 2025',
      category: 'Travel',
      paidBy: 'Sarah',
      remarks: 'Business trip',
      amount: 33674,
      status: 'Submitted'
    },
    {
      id: 3,
      employee: 'Sarah',
      description: 'Hotel booking',
      date: '5th Oct, 2025',
      category: 'Accommodation',
      paidBy: 'Sarah',
      remarks: 'Conference',
      amount: 500,
      status: 'Approved'
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    date: '',
    category: '',
    paidBy: 'Sarah',
    remarks: '',
    amount: ''
  });

  const categories = ['Food', 'Travel', 'Accommodation', 'Office Supplies', 'Entertainment', 'Other'];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCRProcess = async () => {
    if (!selectedFile) return;
    
    setOcrProcessing(true);
    
    try {
      const result = await Tesseract.recognize(
        selectedFile,
        'eng',
        {
          logger: (m) => console.log(m)
        }
      );
      
      const text = result.data.text;
      console.log('OCR Result:', text);
      
      // Parse OCR data (simplified extraction)
      const amountMatch = text.match(/(\d+[.,]\d{2}|\d+)/);
      const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '')) : '';
      
      // Extract date (simplified)
      const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
      const date = dateMatch ? dateMatch[0] : '';
      
      setOcrData({
        amount,
        date,
        rawText: text
      });
      
      setNewExpense(prev => ({
        ...prev,
        amount: amount || prev.amount,
        date: date || prev.date,
        description: prev.description || 'Receipt expense'
      }));
      
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process receipt. Please enter details manually.');
    } finally {
      setOcrProcessing(false);
    }
  };

  const handleSubmitExpense = (status = 'Draft') => {
    const expense = {
      id: expenses.length + 1,
      employee: 'Sarah',
      description: newExpense.description,
      date: newExpense.date,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      remarks: newExpense.remarks,
      amount: parseFloat(newExpense.amount) || 0,
      status: status,
      receipt: previewUrl
    };
    
    setExpenses([expense, ...expenses]);
    
    // Reset form
    setNewExpense({
      description: '',
      date: '',
      category: '',
      paidBy: 'Sarah',
      remarks: '',
      amount: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setOcrData(null);
    setShowUploadModal(false);
    setShowNewExpenseModal(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Draft': 'bg-gray-500/20 text-gray-400',
      'Submitted': 'bg-yellow-500/20 text-yellow-400',
      'Approved': 'bg-green-500/20 text-green-400',
      'Rejected': 'bg-red-500/20 text-red-400'
    };
    return badges[status] || badges['Draft'];
  };

  const getStatusLabel = (status) => {
    if (status === 'Draft') return 'To Submit';
    if (status === 'Submitted') return 'Waiting Approval';
    return status;
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
            My Expenses
          </h1>
          <p className="text-white/60">
            Upload receipts and submit expense claims
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-primary-500/10 border-primary-500/20">
            <p className="text-white/90 text-sm">
              User should be able to upload a receipt from his computer or take a photo of the receipt, 
              using OCR a new expense should get created with total amount and other necessary details.
            </p>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-4"
        >
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
          >
            <Upload size={20} weight="bold" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setShowNewExpenseModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 font-medium"
          >
            <Plus size={20} weight="bold" />
            <span>New</span>
          </button>
        </motion.div>

        {/* Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 grid grid-cols-3 gap-4"
        >
          <Card className="text-center">
            <div className="text-sm text-white/60 mb-1">To Submit</div>
            <div className="text-3xl font-bold text-white">
              {expenses.filter(e => e.status === 'Draft').length}
            </div>
            <div className="text-xs text-white/50 mt-1">
              {expenses.filter(e => e.status === 'Draft').reduce((sum, e) => sum + e.amount, 0).toFixed(2)} rs
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-white/60 mb-1">Waiting Approval</div>
            <div className="text-3xl font-bold text-yellow-400">
              {expenses.filter(e => e.status === 'Submitted').length}
            </div>
            <div className="text-xs text-white/50 mt-1">
              {expenses.filter(e => e.status === 'Submitted').reduce((sum, e) => sum + e.amount, 0).toFixed(2)} rs
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-white/60 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-400">
              {expenses.filter(e => e.status === 'Approved').length}
            </div>
            <div className="text-xs text-white/50 mt-1">
              {expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0).toFixed(2)} rs
            </div>
          </Card>
        </motion.div>

        {/* Expenses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Paid By</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Remarks</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr 
                      key={expense.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {expense.employee.charAt(0)}
                            </span>
                          </div>
                          <span className="text-white font-medium">{expense.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{expense.description}</td>
                      <td className="px-6 py-4 text-white/70">{expense.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/10 text-white/90 rounded-lg text-sm">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">{expense.paidBy}</td>
                      <td className="px-6 py-4 text-white/70">{expense.remarks}</td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{expense.amount.toFixed(2)} rs</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadge(expense.status)}`}>
                          {getStatusLabel(expense.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              {showUploadModal === 'minimized' ? (
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-sm">Upload Receipt (minimized)</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          setShowUploadModal(false);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setOcrData(null);
                        }}
                        className="p-1 hover:bg-white/10 rounded-lg"
                      >
                        <X size={18} className="text-white/70" />
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
              <Card className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">Upload Receipt</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowUploadModal('minimized')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 text-sm"
                    >
                      Minimize
                    </button>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setOcrData(null);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={24} className="text-white/70" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* File Upload Area */}
                  {!previewUrl ? (
                    <>
                    <label className="block" htmlFor="receipt-upload-input">
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-primary-400/50 transition-colors cursor-pointer">
                        <ImageIcon size={48} className="text-white/40 mx-auto mb-4" />
                        <p className="text-white/90 mb-2">Click to upload receipt</p>
                        <p className="text-white/50 text-sm">or drag and drop</p>
                        <p className="text-white/40 text-xs mt-2">PNG, JPG up to 10MB</p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="receipt-upload-input"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadModal(false);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setOcrData(null);
                        }}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {/* Preview */}
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Receipt preview" 
                          className="w-full h-64 object-contain bg-white/5 rounded-xl"
                        />
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setOcrData(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                        >
                          <X size={20} className="text-white" />
                        </button>
                      </div>

                      {/* Process OCR Button */}
                      {!ocrData && (
                        <button
                          onClick={handleOCRProcess}
                          disabled={ocrProcessing}
                          className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50"
                        >
                          {ocrProcessing ? 'Processing...' : 'Extract Data with OCR'}
                        </button>
                      )}

                      {/* Expense Form */}
                      {ocrData && (
                        <form className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Description
                              </label>
                              <input
                                type="text"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                                placeholder="Enter description"
                              />
                            </div>
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={newExpense.date}
                                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                                placeholder="9th Oct, 2025"
                              />
                            </div>
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Category
                              </label>
                              <select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-[#1e293b] text-white/70">Select category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat} className="bg-[#1e293b] text-white">{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Amount (rs)
                              </label>
                              <input
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                                placeholder="5000"
                              />
                            </div>
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Paid By
                              </label>
                              <input
                                type="text"
                                value={newExpense.paidBy}
                                onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-white/90 text-sm font-medium mb-2">
                                Remarks
                              </label>
                              <input
                                type="text"
                                value={newExpense.remarks}
                                onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                                placeholder="Enter remarks"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              type="button"
                              onClick={() => handleSubmitExpense('Draft')}
                              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                            >
                              Save as Draft
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSubmitExpense('Submitted')}
                              className="flex-1 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
                            >
                              Submit for Approval
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Footer actions when preview exists */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUploadModal(false);
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setOcrData(null);
                          }}
                          className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        {ocrData && (
                          <button
                            type="button"
                            onClick={() => handleSubmitExpense('Submitted')}
                            className="flex-1 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
                          >
                            Submit for Approval
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              )}
            </motion.div>
          </div>
        )}

        {/* New Expense Modal (Manual Entry) */}
        {showNewExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">New Expense</h2>
                  <button
                    onClick={() => {
                      setShowNewExpenseModal(false);
                      setNewExpense({
                        description: '',
                        date: '',
                        category: '',
                        paidBy: 'Sarah',
                        remarks: '',
                        amount: ''
                      });
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-white/70" />
                  </button>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                        placeholder="9th Oct, 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Category
                      </label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#1e293b] text-white/70">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#1e293b] text-white">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Amount (rs)
                      </label>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Paid By
                      </label>
                      <input
                        type="text"
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={newExpense.remarks}
                        onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-400 transition-all"
                        placeholder="Enter remarks"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => handleSubmitExpense('Draft')}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200 font-medium"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitExpense('Submitted')}
                      className="flex-1 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl transition-all duration-300 font-medium"
                    >
                      Submit for Approval
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

export default EmployeeExpenses;
