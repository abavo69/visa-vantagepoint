import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, FileText, Settings, User, BarChart3, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AIChat from './AIChat';
import ClientProfile from './ClientProfile';

const Dashboard = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const texts = {
    en: {
      welcome: 'Welcome to Your Client Portal',
      description: 'Manage your account and get assistance from our AI support.',
      overview: 'Overview',
      profile: 'Profile',
      aiSupport: 'AI Support',
      aiDescription: 'Get instant help and answers to your questions.',
      quickActions: 'Quick Actions',
      documents: 'Documents',
      documentsDesc: 'View and manage your documents',
      settings: 'Account Settings',
      settingsDesc: 'Update your profile and preferences',
      analytics: 'Analytics',
      analyticsDesc: 'View your account activity and insights',
      appointments: 'Appointments',
      appointmentsDesc: 'Schedule and manage your appointments'
    },
    es: {
      welcome: 'Bienvenido a Tu Portal de Cliente',
      description: 'Gestiona tu cuenta y obtén asistencia de nuestro soporte de IA.',
      overview: 'Resumen',
      profile: 'Perfil',
      aiSupport: 'Soporte IA',
      aiDescription: 'Obtén ayuda instantánea y respuestas a tus preguntas.',
      quickActions: 'Acciones Rápidas',
      documents: 'Documentos',
      documentsDesc: 'Ver y gestionar tus documentos',
      settings: 'Configuración de Cuenta',
      settingsDesc: 'Actualiza tu perfil y preferencias',
      analytics: 'Analíticas',
      analyticsDesc: 'Ve la actividad de tu cuenta y perspectivas',
      appointments: 'Citas',
      appointmentsDesc: 'Programa y gestiona tus citas'
    }
  };

  const t = texts[language];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ClientProfile />;
      case 'aiSupport':
        return (
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                {t.aiSupport}
              </CardTitle>
              <CardDescription>{t.aiDescription}</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <AIChat />
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => setActiveTab('profile')}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  {t.profile}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">View and edit your profile information</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  {t.documents}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{t.documentsDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  {t.analytics}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{t.analyticsDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  {t.appointments}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{t.appointmentsDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-4 hover:shadow-card transition-shadow cursor-pointer" onClick={() => setActiveTab('aiSupport')}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                  {t.aiSupport}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{t.aiDescription}</CardDescription>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.welcome}</h1>
          <p className="text-muted-foreground mt-2">{t.description}</p>
        </div>
        
        {activeTab !== 'overview' && (
          <button
            onClick={() => setActiveTab('overview')}
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            ← Back to {t.overview}
          </button>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default Dashboard;