import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-12 min-h-[320px] w-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-ink)',
        boxShadow: 'var(--shadow-offset)',
      }}
    >
      {/* Icon block */}
      <div
        className="mb-5 p-4 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-accent)',
          border: '1px solid var(--color-ink)',
          boxShadow: 'var(--shadow-offset-sm)',
        }}
      >
        <Icon size={40} style={{ color: 'var(--color-ink)' }} />
      </div>

      {/* Title */}
      <h3
        className="text-sm font-bold mb-2 uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-xs max-w-[280px] leading-relaxed"
        style={{ color: '#666', fontFamily: 'var(--font-body)' }}
      >
        {description}
      </p>
    </div>
  );
};
