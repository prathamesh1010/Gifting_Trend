import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Tag, Globe } from 'lucide-react';
import { ArticleData } from '@/types/article';

interface DataVisualizationProps {
  articles: ArticleData[];
}

// Standalone ArticlesBySourceChart component
export const ArticlesBySourceChart = ({ articles }: { articles: ArticleData[] }) => {
  const sourceData = articles.reduce((acc, article) => {
    acc[article.source] = (acc[article.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceData).map(([source, count]) => ({
    source: source.length > 15 ? source.substring(0, 15) + '...' : source,
    articles: count,
    fullName: source
  }));

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Articles by Source
        </CardTitle>
        <CardDescription>Distribution of content across different sources</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sourceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis
              dataKey="source"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              formatter={(value) => [value, 'Articles']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="articles" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Standalone TopKeywordsChart component
export const TopKeywordsChart = ({ articles }: { articles: ArticleData[] }) => {
  const exclude = new Set(['gift', 'corporate', 'gifting']);
  const keywordData = articles
    .flatMap(article => article.keywords || [])
    .filter(keyword => !exclude.has(keyword.toLowerCase()))
    .reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const keywordChartData = Object.entries(keywordData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      count
    }));

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-500" />
          Top Keywords
        </CardTitle>
        <CardDescription>See the most frequently occurring keywords in articles</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              dataKey="keyword"
              type="category"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              width={80}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Standalone PublicationTimelineChart component
export const PublicationTimelineChart = ({ articles }: { articles: ArticleData[] }) => {
  const timelineData = articles.reduce((acc, article) => {
    if (article.publishedDate) {
      const date = new Date(article.publishedDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const timelineChartData = Object.entries(timelineData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      articles: count
    }));

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Publication Timeline
        </CardTitle>
        <CardDescription>Article publication frequency over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timelineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="articles"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Standalone TrendCategoriesChart component
export const TrendCategoriesChart = ({ articles }: { articles: ArticleData[] }) => {
  const trendCategories = {
    'Sustainable': ['sustainable', 'eco-friendly', 'green'],
    'Technology': ['tech', 'technology', 'digital'],
    'Wellness': ['wellness', 'health'],
    'Personalized': ['personalized', 'custom', 'branded'],
    'Experience': ['experience', 'subscription'],
    'Premium': ['luxury', 'premium']
  };

  const trendData = Object.entries(trendCategories).map(([category, keywords]) => {
    const count = articles.filter(article =>
      keywords.some(keyword =>
        article.keywords?.includes(keyword) ||
        article.title.toLowerCase().includes(keyword)
      )
    ).length;
    return { name: category, value: count };
  });

  const COLORS = [
    '#6366F1', '#10B981', '#F59E42', '#F43F5E', '#3B82F6',
    '#FBBF24', '#14B8A6', '#8B5CF6', '#EF4444', '#22D3EE'
  ];

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Trend Categories Distribution
        </CardTitle>
        <CardDescription>Distribution of articles across trend categories</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trendData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
            >
              {trendData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, 'Articles']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Main DataVisualization component (now unused, can be removed)
export const DataVisualization = ({ articles }: DataVisualizationProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArticlesBySourceChart articles={articles} />
        <TopKeywordsChart articles={articles} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PublicationTimelineChart articles={articles} />
        <TrendCategoriesChart articles={articles} />
      </div>
    </div>
  );
};