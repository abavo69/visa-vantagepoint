import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Globe, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [themeColor, setThemeColor] = useState('#1e40af');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const texts = {
    en: {
      title: 'Settings',
      description: 'Customize your portal experience and preferences',
      appearance: 'Appearance',
      appearanceDesc: 'Customize the look and feel of your portal',
      themeColor: 'Theme Color',
      themeColorDesc: 'Choose your preferred accent color',
      notifications: 'Notifications',
      notificationsDesc: 'Manage your notification preferences',
      enableNotifications: 'Enable Notifications',
      enableNotificationsDesc: 'Receive notifications about important updates',
      emailUpdates: 'Email Updates',
      emailUpdatesDesc: 'Receive email updates about your visa status',
      language: 'Language',
      languageDesc: 'Change your preferred language',
      privacy: 'Privacy & Security',
      privacyDesc: 'Manage your privacy and security settings',
      saveChanges: 'Save Changes',
      changesSaved: 'Settings saved successfully',
      currentLanguage: 'Current language',
    },
    es: {
      title: 'Configuración',
      description: 'Personaliza tu experiencia del portal y preferencias',
      appearance: 'Apariencia',
      appearanceDesc: 'Personaliza el aspecto de tu portal',
      themeColor: 'Color del Tema',
      themeColorDesc: 'Elige tu color de acento preferido',
      notifications: 'Notificaciones',
      notificationsDesc: 'Gestiona tus preferencias de notificaciones',
      enableNotifications: 'Habilitar Notificaciones',
      enableNotificationsDesc: 'Recibir notificaciones sobre actualizaciones importantes',
      emailUpdates: 'Actualizaciones por Correo',
      emailUpdatesDesc: 'Recibir actualizaciones por correo sobre el estado de tu visa',
      language: 'Idioma',
      languageDesc: 'Cambia tu idioma preferido',
      privacy: 'Privacidad y Seguridad',
      privacyDesc: 'Gestiona tus configuraciones de privacidad y seguridad',
      saveChanges: 'Guardar Cambios',
      changesSaved: 'Configuración guardada exitosamente',
      currentLanguage: 'Idioma actual',
    }
  };

  const t = texts[language];

  const handleSaveSettings = () => {
    // Update CSS variables for theme color
    const root = document.documentElement;
    const hslColor = hexToHSL(themeColor);
    root.style.setProperty('--primary', hslColor);

    toast({
      title: t.changesSaved,
    });
  };

  const hexToHSL = (hex: string) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const colorPresets = [
    { name: 'Blue', value: '#1e40af' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Green', value: '#059669' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Pink', value: '#db2777' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {t.appearance}
          </CardTitle>
          <CardDescription>{t.appearanceDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="themeColor">{t.themeColor}</Label>
            <p className="text-sm text-muted-foreground">{t.themeColorDesc}</p>
            <div className="flex gap-3 mt-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setThemeColor(preset.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                    themeColor === preset.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t.notifications}
          </CardTitle>
          <CardDescription>{t.notificationsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">{t.enableNotifications}</Label>
              <p className="text-sm text-muted-foreground">{t.enableNotificationsDesc}</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailUpdates">{t.emailUpdates}</Label>
              <p className="text-sm text-muted-foreground">{t.emailUpdatesDesc}</p>
            </div>
            <Switch
              id="emailUpdates"
              checked={emailUpdates}
              onCheckedChange={setEmailUpdates}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t.language}
          </CardTitle>
          <CardDescription>{t.languageDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {t.currentLanguage}: <span className="font-medium">{language === 'en' ? 'English' : 'Español'}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Use the language switcher in the header to change languages.
          </p>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.privacy}
          </CardTitle>
          <CardDescription>{t.privacyDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Privacy and security settings will be available soon.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveSettings}>
          {t.saveChanges}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
