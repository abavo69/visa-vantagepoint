import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SupportChat from '@/components/portal/SupportChat';

const ChatPage = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Support',
      description: 'Send a message to our support team. An agent will reply here.',
    },
    es: {
      title: 'Soporte',
      description: 'Envía un mensaje a nuestro equipo de soporte. Un agente responderá aquí.',
    }
  };

  const t = texts[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Headphones className="h-8 w-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      <Card className="h-[calc(100vh-250px)] min-h-[500px] shadow-card">
        <CardContent className="h-full p-0">
          <SupportChat />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
