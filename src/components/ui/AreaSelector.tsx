'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface AreaSelectorProps {
  value: string | null;
  onChange: (areaId: string | null) => void;
  className?: string;
  showNone?: boolean;
  noneLabel?: string;
}

export default function AreaSelector({
  value,
  onChange,
  className = '',
  showNone = true,
  noneLabel = 'No area',
}: AreaSelectorProps) {
  const { getAreas } = useApp();
  const areas = getAreas();

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={`text-sm px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 ${className}`}
    >
      {showNone && <option value="">{noneLabel}</option>}
      {areas.map((area) => (
        <option key={area.id} value={area.id}>
          {area.icon} {area.name}
        </option>
      ))}
    </select>
  );
}
