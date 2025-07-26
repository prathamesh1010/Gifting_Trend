import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Calendar, MapPin, ArrowUpDown, Hash } from 'lucide-react';
import { ArticleData } from '@/types/article';
import { useState, useMemo } from 'react';

interface ArticlesListProps {
  articles: ArticleData[];
  selectedKeywords?: string[];
}

export const ArticlesList = ({ articles, selectedKeywords = [] }: ArticlesListProps) => {
  const [sortBy, setSortBy] = useState('date');

  const sortedArticles = useMemo(() => {
    const sorted = [...articles];
    
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => 
          new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime()
        );
      case 'date-asc':
        return sorted.sort((a, b) => 
          new Date(a.publishedDate || 0).getTime() - new Date(b.publishedDate || 0).getTime()
        );
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'source':
        return sorted.sort((a, b) => a.source.localeCompare(b.source));
      case 'keywords':
        return sorted.sort((a, b) => 
          (b.keywords?.length || 0) - (a.keywords?.length || 0)
        );
      case 'keyword-relevance':
        if (selectedKeywords.length > 0) {
          return sorted.sort((a, b) => {
            const aScore = calculateKeywordRelevance(a, selectedKeywords);
            const bScore = calculateKeywordRelevance(b, selectedKeywords);
            return bScore - aScore; // Higher score first
          });
        }
        return sorted.sort((a, b) => (b.keywords?.length || 0) - (a.keywords?.length || 0));
      default:
        return sorted;
    }
  }, [articles, sortBy, selectedKeywords]);

  const calculateKeywordRelevance = (article: ArticleData, keywords: string[]): number => {
    let score = 0;
    const articleText = `${article.title} ${article.summary}`.toLowerCase();
    const articleKeywords = article.keywords?.map(k => k.toLowerCase()) || [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Title match (highest weight)
      if (article.title.toLowerCase().includes(keywordLower)) {
        score += 10;
      }
      
      // Summary match (medium weight)
      if (article.summary.toLowerCase().includes(keywordLower)) {
        score += 5;
      }
      
      // Exact keyword match (high weight)
      if (articleKeywords.includes(keywordLower)) {
        score += 8;
      }
      
      // Partial keyword match
      articleKeywords.forEach(articleKeyword => {
        if (articleKeyword.includes(keywordLower) || keywordLower.includes(articleKeyword)) {
          score += 3;
        }
      });
    });
    
    return score;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
                Showing {sortedArticles.length} articles
          </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                  <SelectItem value="keywords">Keyword Count</SelectItem>
                  {selectedKeywords.length > 0 && (
                    <SelectItem value="keyword-relevance">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3" />
                        Keyword Relevance
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedArticles.map((article) => (
              <article
                key={article.id}
                className="p-6 rounded-lg border bg-background/50 hover:bg-background/80 transition-all duration-200 hover:shadow-md"
              >
                <header className="mb-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-bold text-xl leading-tight text-foreground">
                      {article.title}
                    </h2>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/10"
                      aria-label="Read full article"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary" className="font-medium">
                        {article.source}
                      </Badge>
                    </div>
                    {article.publishedDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={article.publishedDate}>
                          {new Date(article.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    )}
                  </div>
                </header>
                
                <div className="mb-4">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {article.summary}
                  </p>
                </div>
                
                {article.keywords && article.keywords.length > 0 && (
                  <footer className="flex flex-wrap gap-2 pt-3 border-t border-muted/20">
                    {article.keywords.slice(0, 8).map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        #{keyword}
                      </Badge>
                    ))}
                    {article.keywords.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.keywords.length - 8} more
                      </Badge>
                    )}
                  </footer>
                )}
              </article>
            ))}
            {sortedArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found.</p>
                <p className="text-sm text-muted-foreground/80">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};