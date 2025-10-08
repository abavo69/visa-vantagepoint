import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Calendar, Mail, Phone, Edit, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  country?: string;
  age?: number;
  phone?: string;
  created_at?: string;
}

const ProfilePage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({});

  const texts = {
    en: {
      title: 'Your Profile',
      description: 'Manage your personal information and account details',
      personalInfo: 'Personal Information',
      accountInfo: 'Account Information',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      firstName: 'First Name',
      lastName: 'Last Name',
      country: 'Country',
      age: 'Age',
      phone: 'Phone',
      email: 'Email',
      memberSince: 'Member since',
      yearsOld: 'years old',
      updateSuccess: 'Profile updated successfully',
      updateError: 'Failed to update profile',
    },
    es: {
      title: 'Tu Perfil',
      description: 'Gestiona tu información personal y detalles de cuenta',
      personalInfo: 'Información Personal',
      accountInfo: 'Información de Cuenta',
      edit: 'Editar Perfil',
      save: 'Guardar Cambios',
      cancel: 'Cancelar',
      firstName: 'Nombre',
      lastName: 'Apellido',
      country: 'País',
      age: 'Edad',
      phone: 'Teléfono',
      email: 'Correo',
      memberSince: 'Miembro desde',
      yearsOld: 'años',
      updateSuccess: 'Perfil actualizado exitosamente',
      updateError: 'Error al actualizar perfil',
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchProfile();
  }, [user]);

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
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData,
        });

      if (error) throw error;

      setProfile(formData);
      setEditing(false);
      toast({
        title: t.updateSuccess,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t.updateError,
        variant: 'destructive',
      });
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.description}</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            {t.edit}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditing(false); setFormData(profile || {}); }}>
              {t.cancel}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {t.save}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarFallback className="text-4xl font-semibold bg-gradient-primary text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{getFullName()}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              {formatMemberSince() && (
                <Badge variant="secondary">
                  {t.memberSince} {formatMemberSince()}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.personalInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t.country}</Label>
                  <Input
                    id="country"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{t.age}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.firstName}</p>
                    <p className="text-sm text-muted-foreground">{profile?.first_name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.lastName}</p>
                    <p className="text-sm text-muted-foreground">{profile?.last_name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.country}</p>
                    <p className="text-sm text-muted-foreground">{profile?.country || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.age}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.age ? `${profile.age} ${t.yearsOld}` : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.phone}</p>
                    <p className="text-sm text-muted-foreground">{profile?.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.email}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
