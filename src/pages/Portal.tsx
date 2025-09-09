import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PortalLayout from '@/components/portal/PortalLayout';
import Dashboard from '@/components/portal/Dashboard';
import { useLanguage } from '@/contexts/LanguageContext';

const Portal = () => {
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
      <Dashboard />
    </PortalLayout>
  );
};

export default Portal;