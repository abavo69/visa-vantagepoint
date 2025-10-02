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
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  ];
};