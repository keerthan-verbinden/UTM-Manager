import React from 'react';
import { Link2, LogOut, PlusCircle, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  currentTab: 'dashboard' | 'create';
  onSelectTab: (tab: 'dashboard' | 'create') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center space-x-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-lg tracking-tight block">
                  UTM Manager
                </span>
                <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block -mt-1">
                  Digital Agency
                </span>
              </div>
            </button>

            {/* Navigation links */}
            <nav className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onSelectTab('create')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'create'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Create Link</span>
              </button>
            </nav>
          </div>

          {/* Right side: User & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-800 text-xs truncate max-w-[140px]">
                  {user.name}
                </span>
              </div>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
              title="Logout from UTM Manager"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="sm:hidden flex items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onSelectTab('create')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium ${
              currentTab === 'create'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Create Link</span>
          </button>
        </div>
      </div>
    </header>
  );
};
