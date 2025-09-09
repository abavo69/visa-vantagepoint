import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AIChat from './AIChat';

const Dashboard = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      welcome: 'Welcome to Your Client Portal',
      description: 'Manage your account and get assistance from our AI support.',
      aiSupport: 'AI Support Chat',
      aiDescription: 'Get instant help and answers to your questions.',
      quickActions: 'Quick Actions',
      documents: 'Documents',
      documentsDesc: 'View and manage your documents',
      settings: 'Account Settings',
      settingsDesc: 'Update your profile and preferences'
    },
    es: {
      welcome: 'Bienvenido a Tu Portal de Cliente',
      description: 'Gestiona tu cuenta y obtén asistencia de nuestro soporte de IA.',
      aiSupport: 'Chat de Soporte IA',
      aiDescription: 'Obtén ayuda instantánea y respuestas a tus preguntas.',
      quickActions: 'Acciones Rápidas',
      documents: 'Documentos',
      documentsDesc: 'Ver y gestionar tus documentos',
      settings: 'Configuración de Cuenta',
      settingsDesc: 'Actualiza tu perfil y preferencias'
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t.welcome}</h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">{t.quickActions}</h2>
          
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
                <Settings className="h-4 w-4 mr-2 text-primary" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">{t.settingsDesc}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-2">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;