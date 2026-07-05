import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = 'max-w-lg w-full',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        } else {
          modalRef.current.focus();
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = Array.from(
            modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
          ) as HTMLElement[];
          if (focusable.length === 0) { e.preventDefault(); return; }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) { last.focus(); e.preventDefault(); }
          } else {
            if (document.activeElement === last) { first.focus(); e.preventDefault(); }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      style={{ backgroundColor: 'rgba(17,17,17,0.6)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Modal Dialog Content Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative p-6 md:p-8 outline-none text-left max-h-[90vh] overflow-y-auto flex flex-col animate-scaleUp ${className}`}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-ink)',
          boxShadow: '8px 8px 0px var(--color-ink)',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between mb-5 pb-4"
          style={{ borderBottom: '1px solid var(--color-ink)' }}
        >
          {title ? (
            <h2
              id="modal-title"
              className="text-base font-bold tracking-tight uppercase"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {title}
            </h2>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="p-1.5 flex items-center justify-center transition-all focus:outline-none"
            style={{
              border: '1px solid var(--color-ink)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: '2px 2px 0px var(--color-ink)',
            }}
            aria-label="Close modal"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translate(2px,2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0px var(--color-ink)';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">{children}</div>
      </div>
    </div>
  );
};
