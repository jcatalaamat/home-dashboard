'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Transaction, TransactionCategory, TransactionType } from '@/types';

// Currency formatter
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Group transactions by month
const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const groups: { [key: string]: Transaction[] } = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(txn);
  });

  return groups;
};

// Format month key for display
const formatMonthKey = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function MoneyPage() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    getMonthlyIncome,
    getMonthlyExpenses
  } = useApp();

  // Form state
  const [formType, setFormType] = useState<TransactionType>('income');
  const [formCategory, setFormCategory] = useState<TransactionCategory>('ai-bots');
  const [formAmount, setFormAmount] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRecurring, setFormRecurring] = useState(false);

  // Calculate summary metrics
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const net = monthlyIncome - monthlyExpenses;

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income' && t.recurring && t.recurringPeriod === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Group transactions by month, sorted newest first
  const transactionsByMonth = useMemo(() => {
    const sorted = [...transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return groupTransactionsByMonth(sorted);
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formAmount || parseFloat(formAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formDescription.trim()) {
      alert('Please enter a description');
      return;
    }

    addTransaction({
      type: formType,
      category: formCategory,
      amount: parseFloat(formAmount),
      description: formDescription,
      date: formDate,
      recurring: formRecurring,
      recurringPeriod: formRecurring ? 'monthly' : undefined,
    });

    // Reset form
    setFormAmount('');
    setFormDescription('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormRecurring(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Money Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track income, expenses, and cash flow
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
            {formatCurrency(monthlyIncome)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">total this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-500 mt-1">
            {formatCurrency(monthlyExpenses)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">total this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
          <p className={`text-2xl font-bold mt-1 ${
            net >= 0
              ? 'text-green-600 dark:text-green-500'
              : 'text-red-600 dark:text-red-500'
          }`}>
            {formatCurrency(net)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">income - expenses</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">MRR</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-500 mt-1">
            {formatCurrency(mrr)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">recurring income</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as TransactionType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="ai-bots">AI Bots</option>
                <option value="land-sales">Land Sales</option>
                <option value="consulting">Consulting</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="What was this transaction for?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formRecurring}
              onChange={(e) => setFormRecurring(e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="recurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Recurring (monthly)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transaction List */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaction History
        </h2>

        {Object.keys(transactionsByMonth).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet. Add your first transaction above!
            </p>
          </div>
        ) : (
          Object.entries(transactionsByMonth).map(([monthKey, monthTransactions]) => (
            <div key={monthKey} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Month Header */}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatMonthKey(monthKey)}
                </h3>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {monthTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Type Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            txn.type === 'income'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {txn.type === 'income' ? (
                              <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {txn.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {txn.category}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(txn.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              {txn.recurring && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                                  Recurring
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Amount */}
                        <p className={`text-lg font-semibold ${
                          txn.type === 'income'
                            ? 'text-green-600 dark:text-green-500'
                            : 'text-red-600 dark:text-red-500'
                        }`}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </p>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                          title="Delete transaction"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
