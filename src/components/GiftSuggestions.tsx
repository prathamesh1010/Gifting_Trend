import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, TrendingUp, Users, Briefcase, Heart, Leaf } from 'lucide-react';
import { ArticleData } from '@/types/article';

interface GiftSuggestionsProps {
  articles: ArticleData[];
}

export const GiftSuggestions = ({ articles }: GiftSuggestionsProps) => {
  const giftCategories = [
    {
      name: "Sustainable & Eco-Friendly",
      icon: <Leaf className="w-6 h-6" />,
      keywords: ["sustainable", "eco-friendly", "green", "recycled"],
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      suggestions: [
        "Bamboo desk organizers with company branding",
        "Recycled material tote bags",
        "Solar-powered portable chargers",
        "Organic cotton apparel",
        "Plantable seed paper notebooks",
        "Reusable water bottles with filters"
      ]
    },
    {
      name: "Corporate & Professional",
      icon: <Briefcase className="w-6 h-6" />,
      keywords: ["corporate", "business", "professional", "branded"],
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      suggestions: [
        "Custom leather portfolios",
        "Branded wireless charging stations",
        "Executive pen sets",
        "Premium coffee gift sets",
        "Personalized desk accessories",
        "High-quality business card holders"
      ]
    },
    {
      name: "Tech & Innovation",
      icon: <TrendingUp className="w-6 h-6" />,
      keywords: ["tech", "technology", "smart", "digital"],
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      suggestions: [
        "Smart home devices",
        "Bluetooth speakers with branding",
        "Wireless earbuds",
        "Portable power banks",
        "Smart watches or fitness trackers",
        "Virtual reality headsets"
      ]
    },
    {
      name: "Wellness & Self-Care",
      icon: <Heart className="w-6 h-6" />,
      keywords: ["wellness", "health", "self-care", "mindfulness"],
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      suggestions: [
        "Meditation and mindfulness kits",
        "Essential oil diffusers",
        "Yoga mats with company logo",
        "Stress relief items",
        "Ergonomic office accessories",
        "Healthy snack boxes"
      ]
    },
    {
      name: "Experience & Subscription",
      icon: <Users className="w-6 h-6" />,
      keywords: ["experience", "subscription", "voucher", "virtual"],
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      suggestions: [
        "Online learning platform subscriptions",
        "Virtual team building experiences",
        "Monthly coffee or tea subscriptions",
        "Digital magazine subscriptions",
        "Streaming service gift cards",
        "Virtual cooking or wine tasting classes"
      ]
    },
    {
      name: "Luxury & Premium",
      icon: <Gift className="w-6 h-6" />,
      keywords: ["luxury", "premium", "high-end", "exclusive"],
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      suggestions: [
        "Premium leather goods",
        "High-end wine or whiskey sets",
        "Luxury spa packages",
        "Custom artwork or sculptures",
        "Premium electronics accessories",
        "Exclusive event access or tickets"
      ]
    }
  ];

  const getCategoryMetrics = (keywords: string[]) => {
    const relatedArticles = articles.filter(article =>
      keywords.some(keyword =>
        article.keywords?.includes(keyword) ||
        article.title.toLowerCase().includes(keyword) ||
        article.summary.toLowerCase().includes(keyword)
      )
    );

    const trendScore = Math.min(100, Math.max(20, relatedArticles.length * 15));
    
    return {
      articleCount: relatedArticles.length,
      trendScore,
      popularity: trendScore > 70 ? 'High' : trendScore > 40 ? 'Medium' : 'Low',
      articles: relatedArticles.slice(0, 3)
    };
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          Gift Suggestions by Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCategories.map((category, index) => {
            const metrics = getCategoryMetrics(category.keywords);
            return (
              <div
                key={index}
                className={`rounded-lg border p-6 transition-all duration-200 hover:shadow-lg ${category.bgColor}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={category.color}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {metrics.articleCount} articles
                      </Badge>
                      <Badge 
                        variant={metrics.popularity === 'High' ? 'default' : 'outline'} 
                        className="text-xs"
                      >
                        {metrics.popularity} trend
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Trend Score</span>
                    <span className="text-sm font-bold">{metrics.trendScore}%</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.trendScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Top Gift Ideas:</h4>
                  <ul className="space-y-2">
                    {category.suggestions.slice(0, 4).map((suggestion, suggestionIndex) => (
                      <li key={suggestionIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {metrics.articles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-muted/40">
                    <h4 className="font-medium text-sm mb-2">Related Articles:</h4>
                    <div className="space-y-1">
                      {metrics.articles.map((article, articleIndex) => (
                        <a
                          key={articleIndex}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-primary hover:underline line-clamp-1"
                        >
                          {article.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};