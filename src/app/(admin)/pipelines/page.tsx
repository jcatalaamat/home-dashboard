'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PipelineType, PipelineDeal, SalvajeStage, AIBotsStage } from '@/types';

type PipelineTab = 'salvaje' | 'ai-bots';

const tabs: { id: PipelineTab; label: string }[] = [
  { id: 'salvaje', label: 'Proyecto Salvaje' },
  { id: 'ai-bots', label: 'AI Bot Clients' },
];

const salvajeStages: { id: SalvajeStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'visit-scheduled', label: 'Visit Scheduled' },
  { id: 'visited', label: 'Visited' },
  { id: 'negotiating', label: 'Negotiating' },
  { id: 'sold', label: 'Sold' },
  { id: 'lost', label: 'Lost' },
];

const aiBotsStages: { id: AIBotsStage; label: string }[] = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'demo-scheduled', label: 'Demo Scheduled' },
  { id: 'demo-done', label: 'Demo Done' },
  { id: 'proposal-sent', label: 'Proposal Sent' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

export default function PipelinesPage() {
  const { getDealsByPipeline, addDeal, updateDeal, deleteDeal, moveDealToStage } = useApp();
  const [activeTab, setActiveTab] = useState<PipelineTab>('salvaje');
  const [editingDeal, setEditingDeal] = useState<PipelineDeal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormStage, setAddFormStage] = useState<string>('');

  const deals = getDealsByPipeline(activeTab);
  const stages = activeTab === 'salvaje' ? salvajeStages : aiBotsStages;

  const getDealsByStage = (stage: string) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getDaysInStage = (deal: PipelineDeal) => {
    const updated = new Date(deal.updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddDeal = (stage: string) => {
    setAddFormStage(stage);
    setShowAddForm(true);
  };

  const handleSaveDeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dealData = {
      pipelineType: activeTab as PipelineType,
      name: formData.get('name') as string,
      value: Number(formData.get('value')),
      stage: addFormStage,
      nextAction: formData.get('nextAction') as string,
      contactInfo: formData.get('contactInfo') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      notes: formData.get('notes') as string,
      goalId: null,
    };

    addDeal(dealData);
    setShowAddForm(false);
    setAddFormStage('');
  };

  const handleUpdateDeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDeal) return;

    const formData = new FormData(e.currentTarget);

    updateDeal(editingDeal.id, {
      name: formData.get('name') as string,
      value: Number(formData.get('value')),
      nextAction: formData.get('nextAction') as string,
      contactInfo: formData.get('contactInfo') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      notes: formData.get('notes') as string,
    });

    setEditingDeal(null);
  };

  const handleMoveDeal = (dealId: string, newStage: string) => {
    moveDealToStage(dealId, newStage);
  };

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      deleteDeal(dealId);
      setEditingDeal(null);
    }
  };

  const getTotalValue = () => {
    return deals
      .filter((d) => d.stage !== 'lost' && d.stage !== 'sold' && d.stage !== 'won')
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const getWonValue = () => {
    return deals
      .filter((d) => d.stage === 'sold' || d.stage === 'won')
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipelines</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {deals.length} deal{deals.length !== 1 ? 's' : ''} | Pipeline Value: {formatCurrency(getTotalValue())} | Won: {formatCurrency(getWonValue())}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            const isClosedStage = stage.id === 'sold' || stage.id === 'won' || stage.id === 'lost';

            return (
              <div
                key={stage.id}
                className={`flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border ${
                  isClosedStage
                    ? 'border-gray-300 dark:border-gray-600'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Stage Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {stage.label}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(stageValue)}
                    </p>
                  )}
                </div>

                {/* Deals */}
                <div className="space-y-3 mb-3">
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      daysInStage={getDaysInStage(deal)}
                      formatCurrency={formatCurrency}
                      onEdit={() => setEditingDeal(deal)}
                      onMove={handleMoveDeal}
                      stages={stages}
                      currentStage={stage.id}
                    />
                  ))}
                </div>

                {/* Add Deal Button */}
                {!isClosedStage && (
                  <button
                    onClick={() => handleAddDeal(stage.id)}
                    className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    + Add Deal
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddForm && (
        <DealFormModal
          title="Add New Deal"
          onClose={() => {
            setShowAddForm(false);
            setAddFormStage('');
          }}
          onSubmit={handleSaveDeal}
        />
      )}

      {/* Edit Deal Modal */}
      {editingDeal && (
        <DealFormModal
          title="Edit Deal"
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
          onSubmit={handleUpdateDeal}
          onDelete={() => handleDeleteDeal(editingDeal.id)}
        />
      )}
    </div>
  );
}

// Deal Card Component
interface DealCardProps {
  deal: PipelineDeal;
  daysInStage: number;
  formatCurrency: (value: number) => string;
  onEdit: () => void;
  onMove: (dealId: string, stage: string) => void;
  stages: { id: string; label: string }[];
  currentStage: string;
}

function DealCard({ deal, daysInStage, formatCurrency, onEdit, onMove, stages, currentStage }: DealCardProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  // Filter out lost, won, sold stages from move options
  const moveableStages = stages.filter(
    (s) => s.id !== currentStage && s.id !== 'lost' && s.id !== 'sold' && s.id !== 'won'
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-all group">
      <div className="space-y-2">
        {/* Name */}
        <h4
          onClick={onEdit}
          className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-brand-500 transition-colors"
        >
          {deal.name}
        </h4>

        {/* Value */}
        <p className="text-lg font-semibold text-brand-500 dark:text-brand-400">
          {formatCurrency(deal.value)}
        </p>

        {/* Next Action */}
        {deal.nextAction && (
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Next: </span>
            {deal.nextAction}
          </div>
        )}

        {/* Days in Stage */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className={`text-xs ${daysInStage > 30 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {daysInStage} day{daysInStage !== 1 ? 's' : ''} in stage
          </span>
        </div>

        {/* Move Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <button
              onClick={() => setShowMoveMenu(!showMoveMenu)}
              className="w-full text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Move to...
            </button>

            {showMoveMenu && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {moveableStages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => {
                      onMove(deal.id, stage.id);
                      setShowMoveMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {stage.label}
                  </button>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      onMove(deal.id, 'lost');
                      setShowMoveMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Mark as Lost
                  </button>
                  {(currentStage !== 'sold' && currentStage !== 'won') && (
                    <button
                      onClick={() => {
                        const wonStage = deal.pipelineType === 'salvaje' ? 'sold' : 'won';
                        onMove(deal.id, wonStage);
                        setShowMoveMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      Mark as {deal.pipelineType === 'salvaje' ? 'Sold' : 'Won'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Deal Form Modal Component
interface DealFormModalProps {
  title: string;
  deal?: PipelineDeal;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
}

function DealFormModal({ title, deal, onClose, onSubmit, onDelete }: DealFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deal Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={deal?.name}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value (USD) *
              </label>
              <input
                type="number"
                name="value"
                defaultValue={deal?.value}
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Action
              </label>
              <input
                type="text"
                name="nextAction"
                defaultValue={deal?.nextAction}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contactInfo"
                defaultValue={deal?.contactInfo}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={deal?.phone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={deal?.email}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                defaultValue={deal?.notes}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
              >
                {deal ? 'Update Deal' : 'Add Deal'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              {deal && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
