import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  country?: string;
  age?: number;
  phone?: string;
  avatar_url?: string;
}

const ClientProfile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const texts = {
    en: {
      title: 'Client Profile',
      description: 'Your personal information and account details',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      accountInfo: 'Account Information',
      name: 'Full Name',
      country: 'Country',
      age: 'Age',
      email: 'Email Address',
      phone: 'Phone Number',
      memberSince: 'Member Since',
      status: 'Account Status',
      active: 'Active',
      notProvided: 'Not provided',
      years: 'years old'
    },
    es: {
      title: 'Perfil del Cliente',
      description: 'Tu información personal y detalles de la cuenta',
      personalInfo: 'Información Personal',
      contactInfo: 'Información de Contacto',
      accountInfo: 'Información de la Cuenta',
      name: 'Nombre Completo',
      country: 'País',
      age: 'Edad',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      memberSince: 'Miembro Desde',
      status: 'Estado de la Cuenta',
      active: 'Activo',
      notProvided: 'No proporcionado',
      years: 'años'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, country, age, phone, avatar_url')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded-full w-20"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return t.notProvided;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={getFullName()} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-foreground">{getFullName()}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t.active}
                </Badge>
                {profile?.country && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{profile.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              {t.personalInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.name}</label>
                <p className="text-foreground">{getFullName()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.country}</label>
                <p className="text-foreground">{profile?.country || t.notProvided}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.age}</label>
                <p className="text-foreground">
                  {profile?.age ? `${profile.age} ${t.years}` : t.notProvided}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              {t.contactInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t.email}</label>
              <p className="text-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t.phone}</label>
              <p className="text-foreground">{profile?.phone || t.notProvided}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              {t.accountInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.memberSince}</label>
                <p className="text-foreground">
                  {user?.created_at ? formatDate(user.created_at) : t.notProvided}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.status}</label>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t.active}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfile;