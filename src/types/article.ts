export interface ArticleData {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedDate?: string;
  content?: string;
  keywords?: string[];
}

export interface ScrapingResult {
  success: boolean;
  articles: ArticleData[];
  error?: string;
  source: string;
}

export interface TrendData {
  keyword: string;
  count: number;
  articles: ArticleData[];
  description: string;
}

export const SCRAPING_SOURCES = [
  { 
    name: 'Bundled Gifting', 
    url: 'https://bundledgifting.com/blog/',
    domain: 'bundledgifting.com'
  },
  { 
    name: 'Big Impex', 
    url: 'https://bigimpex.com/blog/',
    domain: 'bigimpex.com'
  },
  { 
    name: 'Corporate Gift', 
    url: 'https://corporategift.com/blog/',
    domain: 'corporategift.com'
  },
  { 
    name: 'PPAI', 
    url: 'https://ppai.org',
    domain: 'ppai.org'
  },
  {
    name: 'Gift Market Insights',
    url: 'https://giftmarketinsights.com',
    domain: 'giftmarketinsights.com'
  },
  {
    name: 'Luxury Gifting Today',
    url: 'https://luxurygiftingtoday.com',
    domain: 'luxurygiftingtoday.com'
  },
  {
    name: 'Corporate Trends Weekly',
    url: 'https://corporatetrendsweekly.com',
    domain: 'corporatetrendsweekly.com'
  },
  {
    name: 'Sustainable Gifts Hub',
    url: 'https://sustainablegiftshub.com',
    domain: 'sustainablegiftshub.com'
  },
  {
    name: 'Tech Gifting Review',
    url: 'https://techgiftingreview.com',
    domain: 'techgiftingreview.com'
  },
  {
    name: 'Global Gift Trends',
    url: 'https://globalgifttrends.com',
    domain: 'globalgifttrends.com'
  }
] as const;