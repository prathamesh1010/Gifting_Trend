import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles } from 'lucide-react';
import { ArticleData } from '@/types/article';

interface TrendingGiftsProps {
  articles: ArticleData[];
}

export const TrendingGifts = ({ articles }: TrendingGiftsProps) => {
  const trendingGifts = [
    {
      name: "Sustainable & Eco-Friendly Gifts",
      description: "Environmentally conscious gifts made from recycled materials and sustainable sources",
      popularity: 95,
      keywords: ["sustainable", "eco-friendly", "green", "recycled"]
    },
    {
      name: "Personalized Tech Gadgets",
      description: "Custom tech accessories and smart devices with personalized branding",
      popularity: 88,
      keywords: ["tech", "personalized", "smart", "custom"]
    },
    {
      name: "Wellness & Self-Care Packages",
      description: "Health-focused gifts promoting mental and physical well-being",
      popularity: 82,
      keywords: ["wellness", "health", "self-care", "mindfulness"]
    },
    {
      name: "Experience-Based Gifts",
      description: "Vouchers and subscriptions for memorable experiences rather than physical items",
      popularity: 79,
      keywords: ["experience", "subscription", "voucher", "virtual"]
    },
    {
      name: "Artisan & Handmade Items",
      description: "Locally crafted and handmade gifts supporting small businesses",
      popularity: 75,
      keywords: ["artisan", "handmade", "local", "craft"]
    },
    {
      name: "Premium Corporate Gift Sets",
      description: "High-end bundled gifts for important clients and stakeholders",
      popularity: 71,
      keywords: ["premium", "luxury", "corporate", "branded"]
    }
  ];

  const getRelatedArticles = (keywords: string[]) => {
    return articles.filter(article => {
      const articleText = `${article.title} ${article.summary}`.toLowerCase();
      const articleKeywords = article.keywords?.map(k => k.toLowerCase()) || [];
      
      return keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Check if keyword is in article keywords
        const keywordMatch = articleKeywords.some(articleKeyword => 
          articleKeyword === keywordLower || 
          articleKeyword.includes(keywordLower) || 
          keywordLower.includes(articleKeyword)
        );
        
        // Check if keyword is in title or summary
        const textMatch = articleText.includes(keywordLower);
        
        // Check for compound words
        const compoundMatch = keywordLower.includes('-') ? 
          keywordLower.split('-').some(part => 
            articleText.includes(part) || 
            articleKeywords.some(ak => ak.includes(part))
          ) : false;
        
        return keywordMatch || textMatch || compoundMatch;
      });
    }).slice(0, 3);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Trending Gifts
        </CardTitle>
        <CardDescription>
          Most popular gift categories based on industry analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingGifts.map((gift, index) => {
            const relatedArticles = getRelatedArticles(gift.keywords);
            return (
              <div key={index} className="p-6 rounded-lg bg-muted/30 border border-muted/40 hover:bg-muted/50 transition-all duration-200 min-h-[280px] flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <Gift className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{gift.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{gift.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-muted/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${gift.popularity}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">{gift.popularity}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  {relatedArticles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Related Articles:</p>
                      <div className="space-y-1">
                        {relatedArticles.map((article, articleIndex) => (
                          <a
                            key={articleIndex}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-primary hover:underline line-clamp-1"
                            title={article.title}
                          >
                            {article.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {gift.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                      <Badge key={keywordIndex} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};