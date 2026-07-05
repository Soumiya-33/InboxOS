import React from 'react';
import { Plus } from 'lucide-react';
import { useCompose } from '../context/ComposeContext';

export const FloatingActionButton: React.FC = () => {
  const { openCompose } = useCompose();

  return (
    <button
      onClick={() => openCompose()}
      className="fixed bottom-6 right-6 z-40 block md:hidden w-14 h-14 flex items-center justify-center transition-all duration-150"
      style={{
        backgroundColor: 'var(--color-accent)',
        border: '1px solid var(--color-ink)',
        boxShadow: 'var(--shadow-offset)',
        color: 'var(--color-ink)',
      }}
      aria-label="Compose email"
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-hover)';
        (e.currentTarget as HTMLElement).style.transform = 'translate(3px,3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset)';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      <Plus size={24} />
    </button>
  );
};
