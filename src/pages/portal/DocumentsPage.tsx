import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DocumentManager from '@/components/portal/DocumentManager';

const DocumentsPage = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Documents',
      description: 'View and manage your visa documents and files.',
    },
    es: {
      title: 'Documentos',
      description: 'Ver y gestionar tus documentos y archivos de visa.',
    }
  };

  const t = texts[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      <DocumentManager />
    </div>
  );
};

export default DocumentsPage;
