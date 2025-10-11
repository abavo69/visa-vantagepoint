import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Calendar, DollarSign, Receipt, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { convertCurrency, getSupportedCurrencies } from '@/lib/currencyConverter';
import { CircularProgress } from '@/components/ui/circular-progress';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_date: string;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  description?: string;
  visa_type?: string;
}

const PaymentPortal = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [convertedTotalPaid, setConvertedTotalPaid] = useState(0);
  const [convertedTotalDue, setConvertedTotalDue] = useState(0);
  const [convertedPlanTotal, setConvertedPlanTotal] = useState(0);
  const [converting, setConverting] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<any>(null);
  const [planTotalAmount, setPlanTotalAmount] = useState(0);
  const [convertedPayments, setConvertedPayments] = useState<{ [key: string]: number }>({});

  const texts = {
    en: {
      title: 'Payment Portal',
      description: 'Track your visa application payments and payment history',
      totalPaid: 'Total Paid',
      totalDue: 'Total Due',
      remaining: 'Remaining Balance',
      displayCurrency: 'Display Currency',
      paymentHistory: 'Payment History',
      noPayments: 'No payments found',
      amount: 'Amount',
      status: 'Status',
      method: 'Method',
      date: 'Date',
      transactionId: 'Transaction ID',
      visaType: 'Visa Type',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded',
      viewReceipt: 'View Receipt'
    },
    es: {
      title: 'Portal de Pagos',
      description: 'Rastrea tus pagos de solicitud de visa e historial de pagos',
      totalPaid: 'Total Pagado',
      totalDue: 'Total Debido',
      remaining: 'Saldo Restante',
      displayCurrency: 'Moneda de Visualización',
      paymentHistory: 'Historial de Pagos',
      noPayments: 'No se encontraron pagos',
      amount: 'Cantidad',
      status: 'Estado',
      method: 'Método',
      date: 'Fecha',
      transactionId: 'ID de Transacción',
      visaType: 'Tipo de Visa',
      pending: 'Pendiente',
      completed: 'Completado',
      failed: 'Fallido',
      refunded: 'Reembolsado',
      viewReceipt: 'Ver Recibo'
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchPayments();
    fetchPaymentPlan();
    detectUserCurrency();
  }, [user]);

  useEffect(() => {
    convertAmounts();
    convertAllPaymentAmounts();
  }, [displayCurrency, totalPaid, totalDue, planTotalAmount, payments]);

  const fetchPayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('visa_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
      
      // Calculate total paid (only completed payments) and total due (all pending + completed)
      const paidTotal = (data || [])
        .filter(payment => payment.payment_status === 'completed')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      const dueTotal = (data || [])
        .filter(payment => ['pending', 'completed'].includes(payment.payment_status))
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      setTotalPaid(paidTotal);
      setTotalDue(dueTotal);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentPlan = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPaymentPlan(data);
        setPlanTotalAmount(Number(data.total_amount));
      }
    } catch (error) {
      console.error('Error fetching payment plan:', error);
    }
  };

  const detectUserCurrency = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      
      // Map country codes to currencies
      const countryCurrencyMap: { [key: string]: string } = {
        US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
        JP: 'JPY', AU: 'AUD', CA: 'CAD', CH: 'CHF', CN: 'CNY', SE: 'SEK', NZ: 'NZD',
        MX: 'MXN', SG: 'SGD', HK: 'HKD', NO: 'NOK', KR: 'KRW', TR: 'TRY', IN: 'INR',
        RU: 'RUB', BR: 'BRL', ZA: 'ZAR', DK: 'DKK', PL: 'PLN', TH: 'THB', ID: 'IDR',
        HU: 'HUF', CZ: 'CZK', IL: 'ILS', CL: 'CLP', PH: 'PHP', AE: 'AED', CO: 'COP',
        SA: 'SAR', MY: 'MYR', RO: 'RON', AR: 'ARS', VN: 'VND', BG: 'BGN', HR: 'HRK',
        EG: 'EGP', PK: 'PKR', NG: 'NGN', BD: 'BDT', UA: 'UAH', KE: 'KES', MA: 'MAD',
        PE: 'PEN', QA: 'QAR', KW: 'KWD', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR',
        IE: 'EUR', GR: 'EUR', FI: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR',
        LT: 'EUR', LU: 'EUR', MT: 'EUR', CY: 'EUR'
      };
      
      const detectedCurrency = countryCurrencyMap[countryCode] || 'USD';
      setDisplayCurrency(detectedCurrency);
    } catch (error) {
      console.error('Error detecting user currency:', error);
      // Default to USD if detection fails
      setDisplayCurrency('USD');
    }
  };

  const convertAmounts = async () => {
    if (displayCurrency === 'USD') {
      setConvertedTotalPaid(totalPaid);
      setConvertedTotalDue(totalDue);
      setConvertedPlanTotal(planTotalAmount);
      return;
    }

    setConverting(true);
    try {
      const [convertedPaid, convertedDue, convertedPlan] = await Promise.all([
        convertCurrency(totalPaid, 'USD', displayCurrency),
        convertCurrency(totalDue, 'USD', displayCurrency),
        convertCurrency(planTotalAmount, 'USD', displayCurrency),
      ]);
      setConvertedTotalPaid(convertedPaid);
      setConvertedTotalDue(convertedDue);
      setConvertedPlanTotal(convertedPlan);
    } catch (error) {
      console.error('Error converting currency:', error);
      setConvertedTotalPaid(totalPaid);
      setConvertedTotalDue(totalDue);
      setConvertedPlanTotal(planTotalAmount);
    } finally {
      setConverting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t.pending;
      case 'completed':
        return t.completed;
      case 'failed':
        return t.failed;
      case 'refunded':
        return t.refunded;
      default:
        return status;
    }
  };

  const remaining = Math.max(0, convertedPlanTotal - convertedTotalPaid);
  const paymentPercentage = convertedPlanTotal > 0 ? (convertedTotalPaid / convertedPlanTotal) * 100 : 0;

  const convertAllPaymentAmounts = async () => {
    const converted: { [key: string]: number } = {};
    
    for (const payment of payments) {
      if (payment.currency === displayCurrency) {
        converted[payment.id] = payment.amount;
      } else {
        try {
          converted[payment.id] = await convertCurrency(payment.amount, payment.currency, displayCurrency);
        } catch {
          converted[payment.id] = payment.amount;
        }
      }
    }
    
    setConvertedPayments(converted);
  };

  return (
    <div className="space-y-6">
      {/* Circular Progress */}
      {planTotalAmount > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Payment Progress</h3>
                <p className="text-muted-foreground mb-4">
                  {paymentPlan?.description || 'Track your payment completion'}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-semibold text-green-600">
                      {formatAmount(convertedTotalPaid, displayCurrency)}
                    </span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {formatAmount(convertedPlanTotal, displayCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Remaining</span>
                    <span className={`font-semibold ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatAmount(remaining, displayCurrency)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <CircularProgress percentage={Math.min(100, paymentPercentage)} size={160} strokeWidth={12} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      
      {/* Currency Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">{t.displayCurrency}</Label>
            <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSupportedCurrencies().map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {converting && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.totalPaid}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatAmount(convertedTotalPaid, displayCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.totalDue}</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(convertedTotalDue, displayCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${remaining > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
                <DollarSign className={`h-6 w-6 ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.remaining}</p>
                <p className={`text-2xl font-bold ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatAmount(remaining, displayCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <CreditCard className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {payments.filter(p => p.payment_status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t.noPayments}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => {
                const convertedAmount = convertedPayments[payment.id] || payment.amount;

                return (
                  <div key={payment.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-foreground">
                            {formatAmount(convertedAmount, displayCurrency)}
                            {payment.currency !== displayCurrency && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (Original: {formatAmount(payment.amount, payment.currency)})
                              </span>
                            )}
                          </h4>
                        <Badge variant={getStatusBadgeVariant(payment.payment_status)}>
                          {getStatusText(payment.payment_status)}
                        </Badge>
                        {payment.visa_type && (
                          <Badge variant="outline" className="text-xs">
                            {payment.visa_type}
                          </Badge>
                        )}
                      </div>
                      
                      {payment.description && (
                        <p className="text-sm text-muted-foreground mb-2">{payment.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(payment.payment_date)}</span>
                        </div>
                        {payment.payment_method && (
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            <span>{payment.payment_method}</span>
                          </div>
                        )}
                        {payment.transaction_id && (
                          <div className="flex items-center gap-1 sm:col-span-2">
                            <Receipt className="h-3 w-3" />
                            <span className="truncate">{t.transactionId}: {payment.transaction_id}</span>
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPortal;