'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface AreaBadgeProps {
  areaId: string | null;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  showName?: boolean;
}

export default function AreaBadge({
  areaId,
  size = 'sm',
  showIcon = true,
  showName = true,
}: AreaBadgeProps) {
  const { getArea } = useApp();

  if (!areaId) return null;

  const area = getArea(areaId);
  if (!area) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${area.color}20`,
        color: area.color,
      }}
    >
      {showIcon && <span>{area.icon}</span>}
      {showName && <span>{area.name}</span>}
    </span>
  );
}
