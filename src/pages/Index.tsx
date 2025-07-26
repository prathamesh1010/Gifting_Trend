import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ArticlesList } from '@/components/ArticlesList';
import { FilterPanel, FilterOptions } from '@/components/FilterPanel';
import { GiftingTrends } from '@/components/GiftingTrends';
import { GiftSuggestions } from '@/components/GiftSuggestions';
import { TrendingGifts } from '@/components/TrendingGifts';
import { GiftingTrend } from '@/components/GiftingTrend';
import { TrendingWords } from '@/components/TrendingWords';
import { TrendingAnalysis } from '@/components/TrendingAnalysis';
import { GoogleTrendsService, TrendingWord } from '@/services/GoogleTrendsService';
import {
  ArticlesBySourceChart,
  TopKeywordsChart,
  PublicationTimelineChart,
  TrendCategoriesChart
} from '@/components/DataVisualization';
import { ArticleData } from '@/types/article';
import { ScrapingService } from '@/services/ScrapingService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Hash } from 'lucide-react';

const Index = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingWords, setTrendingWords] = useState<TrendingWord[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    source: 'all',
    dateRange: 'all',
    keywords: [],
  });

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const scrapedArticles = await ScrapingService.scrapeAllSources();
        setArticles(scrapedArticles);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTrendingWords = async () => {
      try {
        const trendingData = await GoogleTrendsService.getTrendingWords();
        setTrendingWords(trendingData.trendingWords);
      } catch (error) {
        console.error('Failed to load trending words:', error);
      }
    };

    loadArticles();
    loadTrendingWords();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.summary.toLowerCase().includes(term) ||
        article.source.toLowerCase().includes(term)
      );
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(article => article.source === filters.source);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch (filters.dateRange) {
        case '2025':
          filtered = filtered.filter(article => {
            const date = new Date(article.publishedDate || '');
            return date.getFullYear() === 2025;
          });
          break;
        case '2024':
          filtered = filtered.filter(article => {
            const date = new Date(article.publishedDate || '');
            return date.getFullYear() === 2024;
          });
          break;
        case 'last30':
          filterDate.setDate(now.getDate() - 30);
          filtered = filtered.filter(article =>
            new Date(article.publishedDate || '') >= filterDate
          );
          break;
        case 'last90':
          filterDate.setDate(now.getDate() - 90);
          filtered = filtered.filter(article =>
            new Date(article.publishedDate || '') >= filterDate
          );
          break;
        case 'last180':
          filterDate.setDate(now.getDate() - 180);
          filtered = filtered.filter(article =>
            new Date(article.publishedDate || '') >= filterDate
          );
          break;
      }
    }

    // Keywords filter
    if (filters.keywords.length > 0) {
      console.log('Filtering by keywords:', filters.keywords);
      console.log('Articles before keyword filtering:', filtered.length);
      
      filtered = filtered.filter(article => {
        // Check if any of the selected keywords match the article
        const matches = filters.keywords.some(selectedKeyword => {
          const selectedKeywordLower = selectedKeyword.toLowerCase().trim();
          
          // Check title
          if (article.title.toLowerCase().includes(selectedKeywordLower)) {
            console.log(`Match found in title: "${selectedKeyword}" in "${article.title}"`);
            return true;
    }

          // Check summary
          if (article.summary.toLowerCase().includes(selectedKeywordLower)) {
            console.log(`Match found in summary: "${selectedKeyword}" in summary`);
            return true;
          }
          
          // Check article keywords (exact match or partial match)
          if (article.keywords && article.keywords.length > 0) {
            const keywordMatch = article.keywords.some(articleKeyword => {
              const articleKeywordLower = articleKeyword.toLowerCase().trim();
              return articleKeywordLower.includes(selectedKeywordLower) || 
                     selectedKeywordLower.includes(articleKeywordLower) ||
                     articleKeywordLower === selectedKeywordLower;
            });
            if (keywordMatch) {
              console.log(`Match found in keywords: "${selectedKeyword}" in article keywords:`, article.keywords);
            }
            return keywordMatch;
          }
          
          return false;
        });
        
        if (!matches) {
          console.log(`No match for article: "${article.title}" with keywords:`, article.keywords);
        }
        
        return matches;
      });
      
      console.log('Articles after keyword filtering:', filtered.length);
    }



    return filtered;
  }, [articles, filters]);

  const DashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] rounded-lg" />
        ))}
      </div>
    </div>
  );

  // Calculate summary stats
  const sources = Array.from(new Set(filteredArticles.map(article => article.source)));
  const keywords = Array.from(new Set(filteredArticles.flatMap(article => article.keywords || [])));
  const dateRange = filteredArticles.reduce((range, article) => {
    const date = article.publishedDate ? new Date(article.publishedDate) : null;
    if (!date) return range;
    if (!range.start || date < range.start) range.start = date;
    if (!range.end || date > range.end) range.end = date;
    return range;
  }, { start: null as Date | null, end: null as Date | null });

  const summaryStats = [
    {
      title: 'Total Articles',
      value: filteredArticles.length,
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      title: 'Sources',
      value: sources.length,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      title: 'Keywords',
      value: keywords.length,
      icon: Hash,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10'
    },
    {
      title: 'Trending Words',
      value: 'Live',
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <Header />
      </div>
      <main className="container mx-auto px-4 py-8 space-y-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h2>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, index) => (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Charts */}
              <section id="pdf-visualizations" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ArticlesBySourceChart articles={filteredArticles} />
                <TopKeywordsChart articles={filteredArticles} />
                <PublicationTimelineChart articles={filteredArticles} />
                <TrendCategoriesChart articles={filteredArticles} />
              </section>
            </div>
          )}
        </div>

        <section className="mb-10">
          <FilterPanel 
            articles={articles} 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </section>

        <section className="mb-10">
          <GiftingTrends articles={filteredArticles} isLoading={isLoading} />
        </section>

        <section className="mb-10">
          <GiftSuggestions articles={filteredArticles} />
        </section>

        <section className="mb-10">
          <TrendingGifts articles={filteredArticles} />
        </section>

        <section className="mb-10">
          <TrendingWords />
        </section>

        <section className="mb-10">
          <TrendingAnalysis />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
                          <ArticlesList articles={filteredArticles} selectedKeywords={filters.keywords} />
          </div>
          <div>
            <GiftingTrend articles={filteredArticles} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
