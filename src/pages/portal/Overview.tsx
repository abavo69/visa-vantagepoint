import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, FileText, CreditCard, Settings, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Overview = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const texts = {
    en: {
      welcome: 'Welcome Back',
      description: 'Here\'s what\'s happening with your account today.',
      quickAccess: 'Quick Access',
      aiChat: 'AI Support',
      aiDesc: 'Get instant help and answers',
      documents: 'Documents',
      docsDesc: 'Manage your files',
      payments: 'Payments',
      paymentsDesc: 'View payment history',
      settings: 'Settings',
      settingsDesc: 'Customize your portal',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
    },
    es: {
      welcome: 'Bienvenido de Nuevo',
      description: 'Esto es lo que está sucediendo con tu cuenta hoy.',
      quickAccess: 'Acceso Rápido',
      aiChat: 'Soporte IA',
      aiDesc: 'Obtén ayuda instantánea',
      documents: 'Documentos',
      docsDesc: 'Gestiona tus archivos',
      payments: 'Pagos',
      paymentsDesc: 'Ver historial de pagos',
      settings: 'Configuración',
      settingsDesc: 'Personaliza tu portal',
      recentActivity: 'Actividad Reciente',
      viewAll: 'Ver Todo',
    }
  };

  const t = texts[language];

  const getInitials = () => {
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const quickAccessCards = [
    {
      title: t.aiChat,
      description: t.aiDesc,
      icon: MessageCircle,
      path: '/portal/chat',
      color: 'text-primary',
    },
    {
      title: t.documents,
      description: t.docsDesc,
      icon: FileText,
      path: '/portal/documents',
      color: 'text-accent',
    },
    {
      title: t.payments,
      description: t.paymentsDesc,
      icon: CreditCard,
      path: '/portal/payments',
      color: 'text-primary',
    },
    {
      title: t.settings,
      description: t.settingsDesc,
      icon: Settings,
      path: '/portal/settings',
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-primary p-8 rounded-xl text-white shadow-card">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-white/20">
            <AvatarFallback className="text-2xl font-semibold bg-white/10 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{t.welcome}</h1>
            <p className="text-white/90 mt-2">{t.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.quickAccess}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessCards.map((card) => (
            <Card 
              key={card.path}
              className="hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <card.icon className={`h-8 w-8 ${card.color} group-hover:scale-110 transition-transform`} />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t.recentActivity}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm">{t.viewAll}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
