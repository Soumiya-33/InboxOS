import React, { useState } from 'react';
import { 
  Inbox, 
  CheckSquare, 
  Zap, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Activity, 
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompose } from '../context/ComposeContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, count, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border-l-4 border-accent shadow-[0_4px_12px_rgba(99,102,241,0.15)] font-medium' 
          : 'text-gray-400 hover:text-gray-100 hover:bg-white/5 border-l-4 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-accent' : 'text-gray-400'}`}>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          active 
            ? 'bg-accent text-white' 
            : 'bg-white/10 text-gray-300'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab
}) => {
  const { user, logout } = useAuth();
  const { openCompose } = useCompose();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={18} />, count: 14 },
    { id: 'tasks', label: 'Dashboard Tasks', icon: <CheckSquare size={18} />, count: 5 },
    { id: 'rules', label: 'Routing Rules', icon: <Zap size={18} /> },
    { id: 'settings', label: 'Preferences', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-bg-base text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* ── Left Sidebar (Desktop) ────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[260px] glass border-r border-white/5 h-screen sticky top-0 z-30 shrink-0">
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 glow-accent">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              InboxOS
            </h1>
            <span className="text-[10px] text-indigo-400/80 font-semibold tracking-wider uppercase block -mt-0.5">
              Decision Layer
            </span>
          </div>
        </div>

        {/* Compose Button */}
        <div className="px-4 py-4">
          <button 
            onClick={() => openCompose()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 glow-accent-hover active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Compose Action</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-4 mb-2">
            Workspace
          </div>
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              count={item.count}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* System & AI Agent Status Card */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-panel rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-gray-300">AI Agent Active</span>
              </div>
              <Activity size={12} className="text-indigo-400" />
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal mb-2">
              Analyzing incoming streams automatically. Gmail linked.
            </p>
            
            <div className="flex items-center justify-between text-[9px] text-gray-500 border-t border-white/5 pt-2">
              <span>Provider: OpenAI</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>

      </aside>

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile drawer container */}
          <aside className="relative flex flex-col w-[260px] bg-bg-base border-r border-white/10 h-full p-4 z-50">
            <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-white">InboxOS</h2>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                aria-label="Close mobile menu"
              >
                <X size={20} />
              </button>
            </div>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCompose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm mb-4 transition-all duration-200"
            >
              <Plus size={16} />
              <span>Compose Action</span>
            </button>

            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  count={item.count}
                  active={activeTab === item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main Content Area ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Main Navbar Header */}
        <header className="glass border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center w-full max-w-[380px] relative">
            <Search size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions, emails, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-200"
            />
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-4">
            
            {/* Dark Mode toggle visual */}
            <button 
              className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon size={18} />
            </button>

            {/* Notification Bell */}
            <button 
              className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            {/* User Profile Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-gray-200 truncate max-w-[120px]">
                  {user?.email ? user.email.split('@')[0] : 'User'}
                </p>
                <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                  {user?.email || 'offline'}
                </p>
              </div>
              <button 
                onClick={logout}
                title="Log Out"
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-md border border-white/10 transition-all active:scale-95"
              >
                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'OS'}
              </button>
            </div>

          </div>

        </header>

        {/* Dashboard Content Portal */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
