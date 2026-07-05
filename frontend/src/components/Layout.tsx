import React, { useState } from 'react';
import { Search, Bell, Moon, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SidebarNav } from './SidebarNav';
import { FloatingActionButton } from './FloatingActionButton';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)' }}>
      {/* ── Left Sidebar (Desktop) ────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 z-30 shrink-0"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-ink)',
        }}
      >
        <SidebarNav />
      </aside>

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile drawer container */}
        <aside
          className={`relative flex flex-col w-[260px] h-full p-4 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRight: '1px solid var(--color-ink)',
          }}
        >
          <SidebarNav
            isMobile
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          />
        </aside>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Main Navbar Header */}
        <header
          className="px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-20"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-ink)',
            boxShadow: '0 3px 0 var(--color-ink)',
          }}
        >
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            style={{ border: '1px solid var(--color-ink)' }}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center w-full max-w-[380px] relative">
            <Search size={15} className="absolute left-3" style={{ color: '#666' }} />
            <input
              type="text"
              placeholder="Search actions, emails, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-input pl-10 text-xs"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            {/* Dark Mode toggle visual */}
            <button
              className="p-2 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
              style={{ border: '1px solid var(--color-ink)' }}
              aria-label="Toggle theme"
            >
              <Moon size={16} />
            </button>

            {/* Notification Bell */}
            <button
              className="p-2 flex items-center justify-center transition-colors relative min-h-[44px] min-w-[44px]"
              style={{ border: '1px solid var(--color-ink)' }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2"
                style={{ backgroundColor: 'var(--color-danger)', border: '1.5px solid var(--color-ink)' }}
              />
            </button>

            <div className="w-px h-6 bg-neu-ink opacity-20" />

            {/* User Profile Info */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold truncate max-w-[120px]" style={{ fontFamily: 'var(--font-body)' }}>
                  {user?.email ? user.email.split('@')[0] : 'User'}
                </p>
                <p className="text-[10px] truncate max-w-[120px]" style={{ color: '#666' }}>
                  {user?.email || 'offline'}
                </p>
              </div>
              <div
                className="w-9 h-9 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: 'var(--color-accent-cta)',
                  border: '1px solid var(--color-ink)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'OS'}
              </div>
            </div>

            <div className="w-px h-6 bg-neu-ink opacity-20" />

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all uppercase tracking-wider min-h-[40px]"
              style={{
                backgroundColor: 'var(--color-danger)',
                border: '1px solid var(--color-ink)',
                color: '#fff',
                boxShadow: 'var(--shadow-offset-sm)',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-hover)';
                (e.currentTarget as HTMLElement).style.transform = 'translate(1px,1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-offset-sm)';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
              title="Log Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Portal */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <FloatingActionButton />
    </div>
  );
};
