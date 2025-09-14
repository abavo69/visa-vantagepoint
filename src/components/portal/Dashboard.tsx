import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, FileText, Settings, User, MapPin, Calendar, Phone, Mail, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AIChat from './AIChat';
import DocumentManager from './DocumentManager';
import PaymentPortal from './PaymentPortal';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  country?: string;
  age?: number;
  phone?: string;
  created_at?: string;
}

const Dashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const texts = {
    en: {
      welcome: 'Welcome to Your Client Portal',
      description: 'Manage your account and access our professional services.',
      profile: 'Your Profile',
      profileDesc: 'Your account information and details',
      aiSupport: 'AI Support Assistant',
      aiDescription: 'Get instant help and answers to your questions.',
      quickActions: 'Quick Actions',
      documents: 'Documents',
      documentsDesc: 'View and manage your documents',
      payments: 'Payments',
      paymentsDesc: 'View your payment history and status',
      settings: 'Account Settings',
      settingsDesc: 'Update your profile and preferences',
      personalInfo: 'Personal Information',
      accountInfo: 'Account Information',
      memberSince: 'Member since',
      name: 'Name',
      location: 'Location',
      age: 'Age',
      email: 'Email',
      yearsOld: 'years old',
    },
    es: {
      welcome: 'Bienvenido a Tu Portal de Cliente',
      description: 'Gestiona tu cuenta y accede a nuestros servicios profesionales.',
      profile: 'Tu Perfil',
      profileDesc: 'Información y detalles de tu cuenta',
      aiSupport: 'Asistente de Soporte IA',
      aiDescription: 'Obtén ayuda instantánea y respuestas a tus preguntas.',
      quickActions: 'Acciones Rápidas',
      documents: 'Documentos',
      documentsDesc: 'Ver y gestionar tus documentos',
      payments: 'Pagos',
      paymentsDesc: 'Ver tu historial de pagos y estado',
      settings: 'Configuración de Cuenta',
      settingsDesc: 'Actualiza tu perfil y preferencias',
      personalInfo: 'Información Personal',
      accountInfo: 'Información de Cuenta',
      memberSince: 'Miembro desde',
      name: 'Nombre',
      location: 'Ubicación',
      age: 'Edad',
      email: 'Correo',
      yearsOld: 'años',
    }
  };

  const t = texts[language];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
  };

  const formatMemberSince = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-primary p-6 rounded-xl text-white shadow-elegant">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarFallback className="text-lg font-semibold bg-white/10 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{t.welcome}</h1>
            <p className="text-white/80 mt-1">{t.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-primary" />
                {t.profile}
              </CardTitle>
              <CardDescription>{t.profileDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t.name}:</span>
                      <span className="text-sm text-muted-foreground">{getFullName()}</span>
                    </div>
                    
                    {profile?.country && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t.location}:</span>
                        <Badge variant="secondary" className="text-xs">
                          {profile.country}
                        </Badge>
                      </div>
                    )}
                    
                    {profile?.age && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t.age}:</span>
                        <span className="text-sm text-muted-foreground">
                          {profile.age} {t.yearsOld}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t.email}:</span>
                      <span className="text-sm text-muted-foreground">{user?.email}</span>
                    </div>
                    
                    {formatMemberSince() && (
                      <div className="pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {t.memberSince} {formatMemberSince()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{t.quickActions}</h2>
            
            <Card className="hover:shadow-card-hover transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm group-hover:text-primary transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  {t.settings}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{t.settingsDesc}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t.documents}
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t.payments}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-4">
              <Card className="h-[700px] shadow-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center text-lg">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                    {t.aiSupport}
                  </CardTitle>
                  <CardDescription>{t.aiDescription}</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] p-0">
                  <AIChat />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <DocumentManager />
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <PaymentPortal />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;