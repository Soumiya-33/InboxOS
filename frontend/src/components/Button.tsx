import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  type = 'button',
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    border: '1px solid var(--color-ink)',
    transition: 'box-shadow 0.1s ease, transform 0.1s ease',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.55 : 1,
  };

  const variantStyle: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-accent-cta)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-offset)',
    },
    secondary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-ink)',
      boxShadow: 'var(--shadow-offset)',
    },
    accent: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-ink)',
      boxShadow: 'var(--shadow-offset)',
    },
  };

  const sizeStyle: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '11px', gap: '6px' },
    md: { padding: '10px 18px', fontSize: '12px', gap: '8px' },
    lg: { padding: '14px 24px', fontSize: '13px', gap: '10px' },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const el = e.currentTarget;
    el.style.boxShadow = 'var(--shadow-offset-hover)';
    el.style.transform = 'translate(3px, 3px)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const el = e.currentTarget;
    el.style.boxShadow = 'var(--shadow-offset)';
    el.style.transform = '';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const el = e.currentTarget;
    el.style.boxShadow = 'none';
    el.style.transform = 'translate(6px, 6px)';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const el = e.currentTarget;
    el.style.boxShadow = 'var(--shadow-offset-hover)';
    el.style.transform = 'translate(3px, 3px)';
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={className}
      style={{
        ...baseStyle,
        ...variantStyle[variant],
        ...sizeStyle[size],
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};
