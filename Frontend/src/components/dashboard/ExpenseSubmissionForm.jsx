import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Select, TextArea, Modal } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenseApi, useCurrencyConversion, useCountries, useRuleApi } from '../../hooks/useApi';
import STRINGS from '../../config/strings';
import { Camera, Upload, X, Receipt as ReceiptIcon, CurrencyDollar } from 'phosphor-react';
import Tesseract from 'tesseract.js';

const ExpenseSubmissionForm = ({ onClose, onSuccess }) => {
  const { user, company } = useAuth();
  const { submitExpense, loading: submitting } = useExpenseApi();
  const { convertCurrency } = useCurrencyConversion();
  const { countries } = useCountries();
  const { getRules } = useRuleApi();
  const [rules, setRules] = useState([]);
  const [rulesError, setRulesError] = useState(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: company?.currency || 'USD',
    ruleId: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: user?.name || '',
    remarks: ''
  });
  
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [minimized, setMinimized] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const res = await getRules();
        if (res?.success) {
          setRules(res.rules || []);
          setRulesError(null);
        } else {
          setRules([]);
          setRulesError(res?.error || 'Failed to load rules');
        }
      } catch (e) {
        setRules([]);
        setRulesError('Failed to load rules');
      }
    };
    loadRules();
  }, [getRules]);

  const ruleOptions = useMemo(() => (
    [
      { value: '', label: 'Select an approval rule' },
      ...rules.map((rule) => ({ value: rule.id || rule.rule_id, label: rule.name }))
    ]
  ), [rules]);

  const currencyOptions = useMemo(() => {
    const unique = new Map();

    countries.forEach((country) => {
      (country.currencies || []).forEach((currency) => {
        if (currency?.code && !unique.has(currency.code)) {
          const label = currency?.name ? `${currency.code} - ${currency.name}` : currency.code;
          unique.set(currency.code, label);
        }
      });
    });

    if (company?.currency && !unique.has(company.currency)) {
      unique.set(company.currency, `${company.currency} - Base Currency`);
    }

    let options = Array.from(unique.entries()).map(([value, label]) => ({ value, label }));

    if (options.length === 0) {
      const fallback = company?.currency || 'USD';
      return [{ value: fallback, label: `${fallback} - Base Currency` }];
    }

    options.sort((a, b) => a.value.localeCompare(b.value));

    if (company?.currency) {
      const baseIndex = options.findIndex((option) => option.value === company.currency);
      if (baseIndex > 0) {
        const [baseOption] = options.splice(baseIndex, 1);
        options.unshift(baseOption);
      }
    }

    return options;
  }, [countries, company?.currency]);
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors for the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Trigger currency conversion when amount or currency changes
    if (name === 'amount' || name === 'currency') {
      const amountToConvert = name === 'amount' ? parseFloat(value || 0) : parseFloat(formData.amount || 0);
      const fromCurrency = name === 'currency' ? value : formData.currency;
      if (!isNaN(amountToConvert) && fromCurrency && company?.currency) {
        try {
          const result = await convertCurrency(amountToConvert, fromCurrency, company?.currency);
          setConvertedAmount(result);
        } catch (err) {
          console.error('Currency conversion failed:', err);
        }
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setReceipt(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Perform OCR
    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const extractedData = extractReceiptData(text);
      setFormData(prev => ({ ...prev, ...extractedData }));
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setOcrLoading(false);
    }
  };

  const extractReceiptData = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const extracted = {};

    // Extract amount (look for currency symbols and numbers)
    const amountRegex = /[$€£¥₹]\s*(\d+\.?\d*)/g;
    const amounts = [];
    let match;
    while ((match = amountRegex.exec(text)) !== null) {
      amounts.push(parseFloat(match[1]));
    }
    if (amounts.length > 0) {
      extracted.amount = Math.max(...amounts).toString(); // Use the largest amount found
    }

    // Extract date
    const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      const [, month, day, year] = dateMatch;
      const fullYear = year.length === 2 ? `20${year}` : year;
      extracted.date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Extract merchant/description (usually the first line or lines with certain patterns)
    const merchantLines = lines.filter(line => 
      line.length > 3 && 
      !line.match(/^\d+$/) && 
      !line.match(/^[$€£¥₹]/) &&
      !line.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/)
    );
    
    if (merchantLines.length > 0) {
      extracted.description = merchantLines[0];
    }

    // Auto-categorize based on keywords
    const foodKeywords = ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'];
    const transportKeywords = ['taxi', 'uber', 'gas', 'fuel', 'parking', 'bus', 'train'];
    const hotelKeywords = ['hotel', 'motel', 'accommodation', 'lodge', 'inn'];
    
    const textLower = text.toLowerCase();
    if (foodKeywords.some(keyword => textLower.includes(keyword))) {
      extracted.category = 'food';
    } else if (transportKeywords.some(keyword => textLower.includes(keyword))) {
      extracted.category = 'transport';
    } else if (hotelKeywords.some(keyword => textLower.includes(keyword))) {
      extracted.category = 'accommodation';
    }

    return extracted;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.ruleId) {
      newErrors.ruleId = 'Approval rule is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const expenseData = {
      ...formData,
      userId: user?.id,
      receiptUrl: receiptPreview, // In real app, upload to cloud storage
      convertedAmount: convertedAmount?.convertedAmount,
      conversionRate: convertedAmount?.rate,
      baseCurrency: company?.currency
    };

    const result = await submitExpense(expenseData);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-heading">Submit New Expense</h2>
          <button
            onClick={() => setMinimized(prev => !prev)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
          >
            {minimized ? (
              <span className="text-body text-sm">Restore</span>
            ) : (
              <span className="text-body text-sm">Minimize</span>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>
        {!minimized && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-danger text-sm">{errors.general}</p>
            </div>
          )}

          {/* Receipt Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-heading flex items-center">
              <ReceiptIcon size={20} className="mr-2" />
              Receipt Upload
            </h3>
            
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
              {receiptPreview ? (
                <div className="space-y-4">
                  <img 
                    src={receiptPreview} 
                    alt="Receipt preview" 
                    className="max-h-40 mx-auto rounded-lg"
                  />
                  <div className="flex justify-center space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setReceipt(null);
                        setReceiptPreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  {ocrLoading && (
                    <div className="text-primary text-sm">
                      Processing receipt with AI OCR...
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload size={48} className="text-muted mx-auto mb-4" />
                  <p className="text-body mb-2">
                    Upload receipt for automatic data extraction
                  </p>
                  <p className="text-muted text-sm mb-4">
                    AI will auto-fill fields like date, amount, category, and merchant
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload">
                    <Button type="button" variant="secondary" className="cursor-pointer">
                      <Camera size={16} className="mr-2" />
                      Upload Receipt
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Expense Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Restaurant bill, taxi fare, etc."
                error={errors.description}
                required
              />
            </div>

            <Input
              label="Amount"
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              error={errors.amount}
              required
            />

            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              options={currencyOptions}
              error={errors.currency}
            />

            {rulesError && (
              <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-danger text-sm">{rulesError}</p>
              </div>
            )}

            <Select
              label="Approval Rule"
              name="ruleId"
              value={formData.ruleId}
              onChange={handleInputChange}
              options={ruleOptions}
              error={errors.ruleId}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-body">Expense Date</label>
              <input
                className={`luxury-input w-full ${errors.date ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              {errors.date && (
                <p className="text-danger text-sm">{errors.date}</p>
              )}
            </div>

            <Input
              label="Paid By"
              name="paidBy"
              value={formData.paidBy}
              onChange={handleInputChange}
              placeholder="Who paid for this expense?"
              required
            />
          </div>

          {/* Currency Conversion Info */}
          {convertedAmount && formData.currency !== company?.currency && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <h4 className="text-primary-400 font-medium mb-2">Currency Conversion</h4>
              <p className="text-white/80 text-sm">
                {formData.currency} {formData.amount} = {company?.currency} {convertedAmount.convertedAmount}
              </p>
              <p className="text-white/60 text-xs">
                Exchange rate: 1 {formData.currency} = {convertedAmount.rate} {company?.currency}
              </p>
              <p className="text-white/50 text-xs">
                In manager's approval dashboard, the amount should get auto-converted to base currency of the company with real-time today's currency conversion rates.
              </p>
            </div>
          )}

          <TextArea
            label="Remarks (Optional)"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Additional notes or comments"
            rows={3}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting || ocrLoading}
            >
              {submitting ? 'Submitting...' : 'Submit Expense'}
            </Button>
          </div>
        </form>
        )}
      </div>
    </Modal>
  );
};

export default ExpenseSubmissionForm;