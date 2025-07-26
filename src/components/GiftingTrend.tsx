import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { ArticleData } from '@/types/article';

interface TrendAnalysisProps {
  articles: ArticleData[];
}

export const GiftingTrend = ({ articles }: TrendAnalysisProps) => {
  // Define trending topics based on keywords
  const trendingTopics = [
    {
      name: "Sustainable Gifting",
      count: articles.filter(article => 
        article.keywords.some(keyword => 
          ['sustainable', 'eco-friendly', 'green'].includes(keyword)
        )
      ).length,
      keywords: ["sustainable", "eco-friendly", "green"],
      description: "Environmentally conscious gift solutions"
    },
    {
      name: "Personalized Gifts",
      count: articles.filter(article => 
        article.keywords.some(keyword => 
          ['personalized', 'custom', 'branded'].includes(keyword)
        )
      ).length,
      keywords: ["personalized", "custom", "branded"],
      description: "Customized and branded gift options"
    },
    {
      name: "Tech Gadgets",
      count: articles.filter(article => 
        article.keywords.some(keyword => 
          ['tech', 'technology'].includes(keyword)
        )
      ).length,
      keywords: ["tech", "technology"],
      description: "Technology-enabled gift solutions"
    },
    {
      name: "Wellness Products",
      count: articles.filter(article => 
        article.keywords.some(keyword => 
          ['wellness', 'health'].includes(keyword)
        )
      ).length,
      keywords: ["wellness", "health"],
      description: "Health and wellness focused gifts"
    },
    {
      name: "Experience Gifts",
      count: articles.filter(article => 
        article.keywords.some(keyword => 
          ['experience', 'subscription'].includes(keyword)
        )
      ).length,
      keywords: ["experience", "subscription"],
      description: "Experience-based and subscription gifts"
    }
  ];

  // Sort by count (popularity)
  const sortedTopics = trendingTopics.sort((a, b) => b.count - a.count);

  const getRelatedArticles = (keywords: string[]) => {
    return articles.filter(article => 
      keywords.some(keyword => 
        article.keywords.includes(keyword) || 
        article.title.toLowerCase().includes(keyword)
      )
    ).slice(0, 3);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Gifting Trend Analysis
        </CardTitle>
        <CardDescription>
          Top trending topics based on article analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTopics.map((topic, index) => {
          const relatedArticles = getRelatedArticles(topic.keywords);
          return (
            <div key={index} className="p-4 rounded-lg bg-muted/30 border border-muted/40 hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{topic.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {topic.count} articles
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{topic.description}</p>
              
              {relatedArticles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Related Articles:</p>
                  {relatedArticles.map((article, articleIndex) => (
                    <a
                      key={articleIndex}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 p-2 rounded bg-background/50 hover:bg-background/80 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.source}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};