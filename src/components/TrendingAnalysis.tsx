import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Search, BarChart3, Globe, RefreshCw, Calendar } from 'lucide-react';
import { StaticDataService } from '@/services/StaticDataService';

interface TrendingData {
  trendingWords: any[];
  relatedQueries: any[];
  relatedTopics: any[];
  timeRange: string;
  geo: string;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface TrendingAnalysisProps {
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const TrendingAnalysis = ({ className }: TrendingAnalysisProps) => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geo, setGeo] = useState('IN');
  const [timeRange, setTimeRange] = useState('today 12-m');
  const [searchKeyword, setSearchKeyword] = useState('AI gifts 2025');
  const [interestData, setInterestData] = useState<any>(null);
  const [regionData, setRegionData] = useState<any>(null);

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

  const fetchInterestData = async () => {
    try {
      const data = await StaticDataService.getInterestOverTime(searchKeyword);
      setInterestData(data);
    } catch (err) {
      console.error('Error loading interest data:', err);
    }
  };

  const fetchRegionData = async () => {
    try {
      const data = await StaticDataService.getInterestByRegion(searchKeyword);
      setRegionData(data);
    } catch (err) {
      console.error('Error loading region data:', err);
    }
  };

  useEffect(() => {
    fetchTrendingData();
  }, [geo, timeRange]);

  useEffect(() => {
    if (searchKeyword) {
      fetchInterestData();
      fetchRegionData();
    }
  }, [searchKeyword, geo]);

  const prepareInterestChartData = () => {
    if (!interestData?.default?.timelineData) return [];
    
    return interestData.default.timelineData.map((item: any) => ({
      date: new Date(item.time).toLocaleDateString(),
      value: item.value[0]
    }));
  };

  const prepareRegionChartData = () => {
    if (!regionData?.default?.geoMapData) return [];
    
    return Object.entries(regionData.default.geoMapData)
      .map(([region, value]: [string, any]) => ({
        region,
        value: parseInt(value)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const prepareCategoryData = () => {
    if (!trendingData) return [];
    
    const categories = {
      trending: trendingData.trendingWords.length,
      gifting: trendingData.relatedQueries.length,
      topics: trendingData.relatedTopics.length
    };

    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Trending Analysis
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
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Trending Analysis
              </CardTitle>
              <CardDescription>
                Advanced analytics and visualizations with real-time data
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
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="geo">Region:</Label>
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
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="timeRange">Time Range:</Label>
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
            
            <div className="flex items-center gap-2">
              <Label htmlFor="keyword">Search Keyword:</Label>
              <Input
                id="keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Enter keyword..."
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                        <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trending Searches</p>
                        <p className="text-2xl font-bold">{trendingData?.trendingWords.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gifting Queries</p>
                        <p className="text-2xl font-bold">{trendingData?.relatedQueries.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                        <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Related Topics</p>
                        <p className="text-2xl font-bold">{trendingData?.relatedTopics.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interest Over Time Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interest Over Time</CardTitle>
                    <CardDescription>Search interest for "{searchKeyword}" over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={prepareInterestChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Distribution</CardTitle>
                    <CardDescription>Distribution of trending data by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Regional Interest Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regional Interest</CardTitle>
                  <CardDescription>Interest by region for "{searchKeyword}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={prepareRegionChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Trending Words */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Trending Words</CardTitle>
                  <CardDescription>Most popular trending search terms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingData?.trendingWords.slice(0, 9).map((word, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium text-sm">{word.term}</span>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {trendingData && (
            <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
              <p>Real-time data from multiple APIs • Last updated: {new Date().toLocaleString()}</p>
              <p>Region: {geo} • Time range: {timeRange} • Keyword: {searchKeyword}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 