import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Search, Hash, Globe, RefreshCw } from 'lucide-react';
import { StaticDataService } from '@/services/StaticDataService';

interface TrendingWord {
  term: string;
  value: number;
  category: string;
}

interface TrendingData {
  trendingWords: TrendingWord[];
  relatedQueries: TrendingWord[];
  relatedTopics: TrendingWord[];
  timeRange: string;
  geo: string;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TrendingWordsProps {
  className?: string;
}

export const TrendingWords = ({ className }: TrendingWordsProps) => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geo, setGeo] = useState('IN');
  const [timeRange, setTimeRange] = useState('today 12-m');

  const fetchTrendingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await StaticDataService.getTrendingWords();
      setTrendingData(data);
    } catch (err) {
      setError('Failed to load trending data. Please try again later.');
      console.error('Error loading trending data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
  }, [geo, timeRange]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trending':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'gifting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'topic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'gifting':
        return <Search className="w-4 h-4" />;
      case 'topic':
        return <Hash className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const TrendingWordsList = ({ words, title, icon }: { words: TrendingWord[]; title: string; icon: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {words.length > 0 ? (
          words.map((word, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <span className="font-medium">{word.term}</span>
                {word.category && (
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(word.category)}`}>
                    {word.category}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">{word.value}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No trending data available</p>
          </div>
        )}
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-6" />
          </div>
          <Skeleton className="w-12 h-4" />
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Google Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchTrendingData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Google Trends
            </CardTitle>
            <CardDescription>
              Real-time trending search terms and related queries from multiple sources
            </CardDescription>
          </div>
          <Button
            onClick={fetchTrendingData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
                      <Select value={geo} onValueChange={setGeo}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
              </SelectContent>
            </Select>
          
                      <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today 1-m">Past month</SelectItem>
                <SelectItem value="today 3-m">Past 3 months</SelectItem>
                <SelectItem value="today 12-m">Past year</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2025-01">January 2025</SelectItem>
                <SelectItem value="2025-Q1">Q1 2025</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="gifting">Gifting</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="mt-6">
              <TrendingWordsList
                words={trendingData?.trendingWords || []}
                title="Trending Searches"
                icon={<TrendingUp className="w-4 h-4" />}
              />
            </TabsContent>
            
            <TabsContent value="gifting" className="mt-6">
              <TrendingWordsList
                words={trendingData?.relatedQueries || []}
                title="Gifting Related Queries"
                icon={<Search className="w-4 h-4" />}
              />
            </TabsContent>
            
            <TabsContent value="topics" className="mt-6">
              <TrendingWordsList
                words={trendingData?.relatedTopics || []}
                title="Related Topics"
                icon={<Hash className="w-4 h-4" />}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {trendingData && (
          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p>Static data from curated sources • Last updated: {new Date().toLocaleString()}</p>
            <p>Region: India • Time range: Past year</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 