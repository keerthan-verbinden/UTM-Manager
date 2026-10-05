/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CreateLinkForm } from './components/CreateLinkForm.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { Toast } from './components/Toast.tsx';
import { ToastMessage, CampaignLink } from './types.ts';
import { Link2 } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'create'>('dashboard');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Link2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading UTM Manager...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage
            onSwitchToRegister={() => setAuthView('register')}
            showToast={showToast}
          />
        ) : (
          <RegisterPage
            onSwitchToLogin={() => setAuthView('login')}
            showToast={showToast}
          />
        )}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  const handleLinkCreated = (savedLink: CampaignLink) => {
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' ? (
          <DashboardPage
            onCreateLinkClick={() => setCurrentTab('create')}
            showToast={showToast}
          />
        ) : (
          <CreateLinkForm
            onSuccess={handleLinkCreated}
            onCancel={() => setCurrentTab('dashboard')}
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
