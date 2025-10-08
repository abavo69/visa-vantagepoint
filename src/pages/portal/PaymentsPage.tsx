import React from 'react';
import { CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentPortal from '@/components/portal/PaymentPortal';

const PaymentsPage = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Payments',
      description: 'View your payment history and manage billing.',
    },
    es: {
      title: 'Pagos',
      description: 'Ver tu historial de pagos y gestionar facturación.',
    }
  };

  const t = texts[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.description}</p>
      </div>

      <PaymentPortal />
    </div>
  );
};

export default PaymentsPage;
