import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, TrendingUp, Users, Briefcase, Heart, Leaf } from 'lucide-react';
import { ArticleData } from '@/types/article';

interface GiftSuggestionsProps {
  articles: ArticleData[];
}

export const GiftSuggestions = ({ articles }: GiftSuggestionsProps) => {
  // Debug function to check article matching
  const debugArticleMatching = (keywords: string[]) => {
    console.log(`\n=== Debugging category with keywords: [${keywords.join(', ')}] ===`);
    console.log(`Total articles: ${articles.length}`);
    
    const matchingArticles = articles.filter(article => {
      const articleText = `${article.title} ${article.summary}`.toLowerCase();
      const articleKeywords = article.keywords?.map(k => k.toLowerCase()) || [];
      
      const matches = keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        const keywordMatch = articleKeywords.some(articleKeyword => 
          articleKeyword === keywordLower || 
          articleKeyword.includes(keywordLower) || 
          keywordLower.includes(articleKeyword)
        );
        
        const textMatch = articleText.includes(keywordLower);
        
        const compoundMatch = keywordLower.includes('-') ? 
          keywordLower.split('-').some(part => 
            articleText.includes(part) || 
            articleKeywords.some(ak => ak.includes(part))
          ) : false;
        
        // Additional check for partial matches in keywords
        const partialMatch = articleKeywords.some(articleKeyword => 
          keywords.some(keyword => 
            articleKeyword.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(articleKeyword)
          )
        );
        
        // Check for word variations and synonyms
        const wordVariations = {
          'corporate': ['business', 'company', 'enterprise', 'professional', 'workplace', 'office'],
          'gift': ['gifting', 'present', 'giveaway', 'swag', 'corporate gift'],
          'sustainable': ['eco', 'green', 'environmental', 'recycled', 'eco-friendly', 'sustainability'],
          'tech': ['technology', 'digital', 'smart', 'wireless', 'innovation', 'gadget'],
          'wellness': ['health', 'fitness', 'self-care', 'mindfulness', 'wellbeing', 'lifestyle'],
          'remote': ['hybrid', 'work-from-home', 'virtual', 'online', 'workplace'],
          'luxury': ['premium', 'high-end', 'exclusive', 'premium', 'luxury'],
          'personalized': ['custom', 'branded', 'customized', 'personal', 'tailored'],
          'experience': ['subscription', 'service', 'activity', 'event', 'adventure'],
          'professional': ['business', 'corporate', 'executive', 'office', 'workplace']
        };
        
        const synonymMatch = Object.entries(wordVariations).some(([mainWord, synonyms]) => {
          if (keywordLower === mainWord || synonyms.includes(keywordLower)) {
            return articleText.includes(mainWord) || 
                   synonyms.some(synonym => articleText.includes(synonym)) ||
                   articleKeywords.some(ak => ak.includes(mainWord) || synonyms.some(synonym => ak.includes(synonym)));
          }
          return false;
        });
        
        return keywordMatch || textMatch || compoundMatch || partialMatch || synonymMatch;
      });
      
      if (matches) {
        console.log(`✓ MATCH: "${article.title}"`);
        console.log(`  Keywords: [${articleKeywords.join(', ')}]`);
        console.log(`  Text: ${articleText.substring(0, 100)}...`);
      }
      
      return matches;
    });
    
    console.log(`Found ${matchingArticles.length} matching articles`);
    
    // Also log some non-matching articles for debugging
    const nonMatchingArticles = articles.filter(article => {
      const articleText = `${article.title} ${article.summary}`.toLowerCase();
      const articleKeywords = article.keywords?.map(k => k.toLowerCase()) || [];
      
      return !keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        const keywordMatch = articleKeywords.some(articleKeyword => 
          articleKeyword === keywordLower || 
          articleKeyword.includes(keywordLower) || 
          keywordLower.includes(articleKeyword)
        );
        const textMatch = articleText.includes(keywordLower);
        const compoundMatch = keywordLower.includes('-') ? 
          keywordLower.split('-').some(part => 
            articleText.includes(part) || 
            articleKeywords.some(ak => ak.includes(part))
          ) : false;
        const partialMatch = articleKeywords.some(articleKeyword => 
          keywords.some(keyword => 
            articleKeyword.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(articleKeyword)
          )
        );
        
        // Check for word variations and synonyms
        const wordVariations = {
          'corporate': ['business', 'company', 'enterprise', 'professional', 'workplace', 'office'],
          'gift': ['gifting', 'present', 'giveaway', 'swag', 'corporate gift'],
          'sustainable': ['eco', 'green', 'environmental', 'recycled', 'eco-friendly', 'sustainability'],
          'tech': ['technology', 'digital', 'smart', 'wireless', 'innovation', 'gadget'],
          'wellness': ['health', 'fitness', 'self-care', 'mindfulness', 'wellbeing', 'lifestyle'],
          'remote': ['hybrid', 'work-from-home', 'virtual', 'online', 'workplace'],
          'luxury': ['premium', 'high-end', 'exclusive', 'premium', 'luxury'],
          'personalized': ['custom', 'branded', 'customized', 'personal', 'tailored'],
          'experience': ['subscription', 'service', 'activity', 'event', 'adventure'],
          'professional': ['business', 'corporate', 'executive', 'office', 'workplace']
        };
        
        const synonymMatch = Object.entries(wordVariations).some(([mainWord, synonyms]) => {
          if (keywordLower === mainWord || synonyms.includes(keywordLower)) {
            return articleText.includes(mainWord) || 
                   synonyms.some(synonym => articleText.includes(synonym)) ||
                   articleKeywords.some(ak => ak.includes(mainWord) || synonyms.some(synonym => ak.includes(synonym)));
          }
          return false;
        });
        
        return keywordMatch || textMatch || compoundMatch || partialMatch || synonymMatch;
      });
    });
    
    if (nonMatchingArticles.length > 0) {
      console.log(`\nNon-matching articles (first 3):`);
      nonMatchingArticles.slice(0, 3).forEach(article => {
        console.log(`✗ NO MATCH: "${article.title}"`);
        console.log(`  Keywords: [${article.keywords?.join(', ') || 'none'}]`);
      });
    }
    
    return matchingArticles;
  };
  const giftCategories = [
    {
      name: "Sustainable & Eco-Friendly",
      icon: <Leaf className="w-6 h-6" />,
      keywords: ["sustainable", "eco-friendly", "green", "recycled", "bamboo", "organic", "plantable", "reusable"],
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
      keywords: ["corporate", "business", "professional", "branded", "executive", "premium", "leather", "office"],
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
      keywords: ["tech", "technology", "smart", "digital", "wireless", "bluetooth", "portable", "gadget"],
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
      keywords: ["wellness", "health", "self-care", "mindfulness", "meditation", "yoga", "stress", "ergonomic"],
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
      keywords: ["experience", "subscription", "voucher", "virtual", "online", "digital", "streaming", "learning"],
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
      keywords: ["luxury", "premium", "high-end", "exclusive", "spa", "wine", "whiskey", "artwork"],
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
    const relatedArticles = articles.filter(article => {
      const articleText = `${article.title} ${article.summary}`.toLowerCase();
      const articleKeywords = article.keywords?.map(k => k.toLowerCase()) || [];
      
      // Check if any keyword matches in article keywords or text
      return keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Check if keyword is in article keywords (exact match or contains)
        const keywordMatch = articleKeywords.some(articleKeyword => 
          articleKeyword === keywordLower || 
          articleKeyword.includes(keywordLower) || 
          keywordLower.includes(articleKeyword)
        );
        
        // Check if keyword is in title or summary
        const textMatch = articleText.includes(keywordLower);
        
        // Also check for compound words (e.g., "eco-friendly" should match "eco" or "friendly")
        const compoundMatch = keywordLower.includes('-') ? 
          keywordLower.split('-').some(part => 
            articleText.includes(part) || 
            articleKeywords.some(ak => ak.includes(part))
          ) : false;
        
        // Additional check for partial matches in keywords
        const partialMatch = articleKeywords.some(articleKeyword => 
          keywords.some(keyword => 
            articleKeyword.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(articleKeyword)
          )
        );
        
        // Check for word variations and synonyms
        const wordVariations = {
          'corporate': ['business', 'company', 'enterprise', 'professional', 'workplace', 'office'],
          'gift': ['gifting', 'present', 'giveaway', 'swag', 'corporate gift'],
          'sustainable': ['eco', 'green', 'environmental', 'recycled', 'eco-friendly', 'sustainability'],
          'tech': ['technology', 'digital', 'smart', 'wireless', 'innovation', 'gadget'],
          'wellness': ['health', 'fitness', 'self-care', 'mindfulness', 'wellbeing', 'lifestyle'],
          'remote': ['hybrid', 'work-from-home', 'virtual', 'online', 'workplace'],
          'luxury': ['premium', 'high-end', 'exclusive', 'premium', 'luxury'],
          'personalized': ['custom', 'branded', 'customized', 'personal', 'tailored'],
          'experience': ['subscription', 'service', 'activity', 'event', 'adventure'],
          'professional': ['business', 'corporate', 'executive', 'office', 'workplace']
        };
        
        const synonymMatch = Object.entries(wordVariations).some(([mainWord, synonyms]) => {
          if (keywordLower === mainWord || synonyms.includes(keywordLower)) {
            return articleText.includes(mainWord) || 
                   synonyms.some(synonym => articleText.includes(synonym)) ||
                   articleKeywords.some(ak => ak.includes(mainWord) || synonyms.some(synonym => ak.includes(synonym)));
          }
          return false;
        });
        
        return keywordMatch || textMatch || compoundMatch || partialMatch || synonymMatch;
      });
    });

    // Calculate trend score based on article count and keyword relevance
    const totalArticles = articles.length;
    const articlePercentage = (relatedArticles.length / totalArticles) * 100;
    const trendScore = Math.min(100, Math.max(20, articlePercentage * 2 + relatedArticles.length * 10));
    
    return {
      articleCount: relatedArticles.length,
      trendScore: Math.round(trendScore),
      popularity: trendScore > 70 ? 'High' : trendScore > 40 ? 'Medium' : 'Low',
      articles: relatedArticles.slice(0, 5) // Show more related articles
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
            // Debug all categories to help identify issues
            console.log(`\n=== ${category.name} Category ===`);
            debugArticleMatching(category.keywords);
            
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