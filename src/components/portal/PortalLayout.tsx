import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, MessageCircle, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface PortalLayoutProps {
  children: ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    en: {
      clientPortal: 'Client Portal',
      adminPortal: 'Admin Portal',
      dashboard: 'Dashboard',
      chat: 'AI Chat',
      profile: 'Profile',
      signOut: 'Sign Out'
    },
    es: {
      clientPortal: 'Portal del Cliente',
      adminPortal: 'Portal de Administrador',
      dashboard: 'Panel',
      chat: 'Chat IA',
      profile: 'Perfil',
      signOut: 'Cerrar Sesión'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-primary">{t.clientPortal}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
              >
                <Shield className="h-4 w-4 mr-2" />
                {t.adminPortal}
              </Button>
            )}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t.signOut}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;