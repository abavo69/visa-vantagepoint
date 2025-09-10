import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AIChat from '@/components/portal/AIChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Consultation = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Free Consultation Chat',
      description: 'Get instant help and answers to your visa questions from our AI assistant.',
    },
    es: {
      title: 'Chat de Consulta Gratuita',
      description: 'Obtén ayuda instantánea y respuestas a tus preguntas de visa de nuestro asistente de IA.',
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                {t.title}
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <AIChat />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consultation;