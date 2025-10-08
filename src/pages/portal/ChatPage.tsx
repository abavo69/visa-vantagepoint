import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AIChat from '@/components/portal/AIChat';

const ChatPage = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'AI Support Assistant',
      description: 'Get instant help and answers to your visa-related questions.',
    },
    es: {
      title: 'Asistente de Soporte IA',
      description: 'Obtén ayuda instantánea y respuestas a tus preguntas sobre visas.',
    }
  };

  const t = texts[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      <Card className="h-[calc(100vh-250px)] min-h-[600px] shadow-card">
        <CardContent className="h-full p-0">
          <AIChat />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
