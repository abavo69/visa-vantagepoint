// Currency conversion utility using public API
// Free API: exchangerate-api.com (no key required for basic usage)

const CACHE_KEY = 'currency_rates_cache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CurrencyRates {
  base: string;
  rates: { [key: string]: number };
  timestamp: number;
}

let cachedRates: CurrencyRates | null = null;

export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<CurrencyRates> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsedCache: CurrencyRates = JSON.parse(cached);
    if (Date.now() - parsedCache.timestamp < CACHE_DURATION && parsedCache.base === baseCurrency) {
      cachedRates = parsedCache;
      return parsedCache;
    }
  }

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    
    const data = await response.json();
    const ratesData: CurrencyRates = {
      base: baseCurrency,
      rates: data.rates,
      timestamp: Date.now(),
    };

    // Cache the results
    localStorage.setItem(CACHE_KEY, JSON.stringify(ratesData));
    cachedRates = ratesData;
    
    return ratesData;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return default rates if API fails
    return {
      base: baseCurrency,
      rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.25,
        AUD: 1.35,
        JPY: 110,
        INR: 75,
      },
      timestamp: Date.now(),
    };
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;

  const rates = await fetchExchangeRates(fromCurrency);
  const rate = rates.rates[toCurrency];
  
  if (!rate) {
    console.warn(`Exchange rate not found for ${toCurrency}, returning original amount`);
    return amount;
  }

  return amount * rate;
};

export const getSupportedCurrencies = () => {
  return [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
    { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
    { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
    { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  ];
};