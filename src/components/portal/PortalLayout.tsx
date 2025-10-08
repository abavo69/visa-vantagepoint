import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Home, MessageCircle, FileText, CreditCard, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
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
      overview: 'Overview',
      profile: 'Profile',
      chat: 'AI Chat',
      documents: 'Documents',
      payments: 'Payments',
      settings: 'Settings',
      signOut: 'Sign Out'
    },
    es: {
      clientPortal: 'Portal del Cliente',
      adminPortal: 'Portal de Administrador',
      overview: 'Resumen',
      profile: 'Perfil',
      chat: 'Chat IA',
      documents: 'Documentos',
      payments: 'Pagos',
      settings: 'Configuración',
      signOut: 'Cerrar Sesión'
    }
  };

  const t = texts[language];
  const location = useLocation();

  const navigationItems = [
    { path: '/portal', label: t.overview, icon: Home },
    { path: '/portal/profile', label: t.profile, icon: User },
    { path: '/portal/chat', label: t.chat, icon: MessageCircle },
    { path: '/portal/documents', label: t.documents, icon: FileText },
    { path: '/portal/payments', label: t.payments, icon: CreditCard },
    { path: '/portal/settings', label: t.settings, icon: Settings },
  ];

  const isActivePath = (path: string) => {
    if (path === '/portal') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold text-primary">{t.clientPortal}</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/portal'}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate('/admin')}
            >
              <Shield className="h-4 w-4 mr-2" />
              {t.adminPortal}
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
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

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;