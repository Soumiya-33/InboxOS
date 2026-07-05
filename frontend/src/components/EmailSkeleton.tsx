import React from 'react';

export const EmailSkeletonRow: React.FC = () => {
  return (
    <div
      className="p-4 flex gap-4 animate-pulse relative overflow-hidden mb-1.5"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-ink)',
        boxShadow: 'var(--shadow-offset-sm)',
      }}
    >
      {/* Indicator square skeleton */}
      <div
        className="w-3 h-3 shrink-0 mt-1"
        style={{ backgroundColor: '#ddd', border: '1px solid #bbb' }}
      />

      <div className="flex-1 space-y-3.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {/* Sender name skeleton */}
          <div className="h-4 w-32" style={{ backgroundColor: '#e5e5e5' }} />
          <div className="flex items-center gap-2">
            <div className="h-3 w-16" style={{ backgroundColor: '#eee' }} />
            <div className="h-4 w-14" style={{ backgroundColor: '#eee' }} />
          </div>
        </div>

        {/* Subject skeleton */}
        <div className="h-4 w-1/3" style={{ backgroundColor: '#d5d5d5' }} />

        {/* Summary skeleton */}
        <div className="space-y-1.5">
          <div className="h-3 w-full" style={{ backgroundColor: '#eee' }} />
          <div className="h-3 w-4/5" style={{ backgroundColor: '#eee' }} />
        </div>

        {/* Badges skeleton */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-4 w-16" style={{ backgroundColor: '#e0e0e0', border: '1px solid #bbb' }} />
          <div className="h-4 w-20" style={{ backgroundColor: '#e0e0e0', border: '1px solid #bbb' }} />
        </div>
      </div>
    </div>
  );
};

export const EmailSkeletonList: React.FC<{ count?: number }> = ({
  count = 4,
}) => {
  const rows = Array.from({ length: count });

  return (
    <div className="space-y-0">
      {rows.map((_, index) => (
        <EmailSkeletonRow key={index} />
      ))}
    </div>
  );
};
