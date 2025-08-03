import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import api from "../../utils/api";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const recipientId = searchParams.get("id");
  const recipientName = searchParams.get("name");
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!recipientId || !recipientName) {
      toast.error("Invalid recipient");
      navigate("/dashboard");
    }
    fetchBalance();
  }, [recipientId, recipientName]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/account/balance');
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      toast.error('Failed to fetch balance');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const amountNum = parseFloat(amount);
    
    if (!amount || amountNum <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amountNum < 0.01) {
      newErrors.amount = "Minimum amount is ₹0.01";
    } else if (balance !== null && amountNum > balance) {
      newErrors.amount = "Insufficient balance";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      if (errors.amount) {
        setErrors({ ...errors, amount: "" });
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/account/transfer', {
        to: recipientId,
        amount: parseFloat(amount),
        description: description.trim()
      });
      
      if (response.data.success) {
        toast.success(`₹${amount} sent successfully to ${recipientName}`);
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Transfer failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Send Money</h2>
          
          {/* Recipient Info */}
          <div className="flex items-center p-4 mb-8 space-x-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white bg-indigo-600 rounded-full">
              {recipientName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{recipientName}</p>
              <p className="text-sm text-gray-500">Recipient</p>
            </div>
          </div>

          {/* Balance Display */}
          {balance !== null && (
            <div className="p-3 mb-6 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800">
                Available Balance: <span className="font-semibold">₹{balance.toFixed(2)}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  ₹
                </span>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`block w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-sm font-medium text-white transition-colors bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Money</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};