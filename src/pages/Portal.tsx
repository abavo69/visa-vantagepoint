import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoginTracking } from '@/hooks/useLoginTracking';
import PortalLayout from '@/components/portal/PortalLayout';
import Overview from '@/pages/portal/Overview';
import ProfilePage from '@/pages/portal/ProfilePage';
import ChatPage from '@/pages/portal/ChatPage';
import DocumentsPage from '@/pages/portal/DocumentsPage';
import PaymentsPage from '@/pages/portal/PaymentsPage';
import SettingsPage from '@/pages/portal/SettingsPage';
import { useLanguage } from '@/contexts/LanguageContext';

const Portal = () => {
  useLoginTracking();
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    en: {
      loading: 'Loading...'
    },
    es: {
      loading: 'Cargando...'
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">{t.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PortalLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </PortalLayout>
  );
};

export default Portal;