import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Inbox,
  CheckSquare,
  Zap,
  Settings,
  Activity,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { useCompose } from '../context/ComposeContext';

export interface SidebarNavProps {
  onCloseMobileMenu?: () => void;
  isMobile?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  onCloseMobileMenu,
  isMobile = false,
}) => {
  const location = useLocation();
  const { openCompose } = useCompose();

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Inbox',
      icon: <Inbox size={17} />,
      count: 14,
    },
    {
      path: '/dashboard/tasks',
      label: 'Dashboard Tasks',
      icon: <CheckSquare size={17} />,
      count: 5,
    },
    {
      path: '/dashboard/rules',
      label: 'Routing Rules',
      icon: <Zap size={17} />,
    },
    {
      path: '/dashboard/settings?tab=integrations',
      label: 'Integrations',
      icon: <Activity size={17} />,
    },
    {
      path: '/dashboard/settings',
      label: 'Preferences',
      icon: <Settings size={17} />,
    },
  ];

  const isItemActive = (path: string) => {
    if (path.includes('tab=integrations')) {
      const searchParams = new URLSearchParams(location.search);
      return location.pathname.startsWith('/dashboard/settings') && searchParams.get('tab') === 'integrations';
    }
    if (path === '/dashboard/settings') {
      const searchParams = new URLSearchParams(location.search);
      return location.pathname.startsWith('/dashboard/settings') && searchParams.get('tab') !== 'integrations';
    }
    if (path === '/dashboard') {
      return (
        location.pathname === '/dashboard' ||
        location.pathname === '/dashboard/'
      );
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <div className="flex flex-col h-full flex-1" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* ── Brand Logo Header ─────────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between ${isMobile ? 'pb-4 mb-2' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-2.5">
          {/* Logo mark: solid yellow box with black sparkles */}
          <div
            className="flex items-center justify-center w-9 h-9 shrink-0"
            style={{
              backgroundColor: 'var(--color-accent)',
              border: '1px solid var(--color-ink)',
            }}
          >
            <Sparkles size={18} className="text-black" fill="currentColor" />
          </div>
          <div className="text-left">
            <h1
              className="text-base leading-none font-black"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              InboxOS
            </h1>
            <span
              className="text-[9px] font-black tracking-widest uppercase block mt-0.5"
              style={{ color: 'var(--color-ink)', opacity: 0.8 }}
            >
              Decision Layer
            </span>
          </div>
        </div>

        {isMobile && onCloseMobileMenu && (
          <button
            onClick={onCloseMobileMenu}
            className="p-2 flex items-center justify-center min-h-[44px] min-w-[44px]"
            style={{ border: '1px solid var(--color-ink)' }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Compose Action Button ──────────────────────────────────────────────── */}
      <div className={`${isMobile ? 'py-2 mb-2' : 'px-4 py-3'}`}>
        <button
          onClick={() => {
            openCompose();
            handleLinkClick();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider min-h-[44px] transition-all"
          style={{
            backgroundColor: 'var(--color-accent)',
            border: '1px solid var(--color-ink)',
            color: 'var(--color-ink)',
            boxShadow: '3px 3px 0 var(--color-ink)',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'translate(3px,3px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 var(--color-ink)';
            (e.currentTarget as HTMLElement).style.transform = '';
          }}
        >
          <Plus size={16} />
          <span>Compose Action</span>
        </button>
      </div>

      {/* ── Navigation Links ─────────────────────────────────────────────────── */}
      <nav className={`flex-1 space-y-1.5 overflow-y-auto text-left ${isMobile ? '' : 'px-3'}`}>
        <div
          className="text-[9px] font-black uppercase tracking-widest px-4 mb-2 pt-1"
          style={{ color: '#888', fontFamily: 'var(--font-body)' }}
        >
          Workspace
        </div>
        {navigationItems.map((item) => {
          const active = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-100 font-bold text-xs min-h-[44px]"
              style={{
                backgroundColor: active ? 'var(--color-accent)' : 'transparent',
                color: 'var(--color-ink)',
                border: `1px solid ${active ? 'var(--color-ink)' : 'transparent'}`,
                boxShadow: active ? '3px 3px 0 var(--color-ink)' : 'none',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '2px',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f7f6f0';
                  (e.currentTarget as HTMLElement).style.border = '1px solid var(--color-ink)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.border = '1px solid transparent';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className="text-[9px] px-2 py-0.5 font-black border"
                  style={{
                    backgroundColor: active ? 'var(--color-ink)' : '#f3f1e9',
                    color: active ? '#FFFFFF' : 'var(--color-ink)',
                    borderColor: 'var(--color-ink)',
                  }}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── System Status Card ────────────────────────────────────────────────── */}
      <div className={`${isMobile ? 'pt-3 mt-3' : 'p-4'}`}>
        <div
          className="p-3.5 text-left"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-ink)',
            boxShadow: '3px 3px 0 var(--color-ink)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full opacity-75"
                  style={{ backgroundColor: 'var(--color-success)' }}
                />
                <span
                  className="relative inline-flex h-2.5 w-2.5"
                  style={{ backgroundColor: 'var(--color-success)' }}
                />
              </span>
              <span
                className="text-[10px] font-black uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                AI Agent Active
              </span>
            </div>
            <Activity size={11} style={{ color: 'var(--color-accent-cta)' }} />
          </div>

          <p
            className="text-[10px] font-bold leading-normal mb-2.5"
            style={{ color: '#666', fontFamily: 'var(--font-body)' }}
          >
            Analyzing incoming streams automatically. Gmail linked.
          </p>

          <div
            className="flex items-center justify-between text-[9px] font-mono pt-2"
            style={{
              borderTop: '1px solid var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              color: '#888',
            }}
          >
            <span>Provider: OpenAI</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
