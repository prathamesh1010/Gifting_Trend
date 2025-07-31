import { ArticleData } from '@/types/article';

export interface StaticArticleData {
  Heading?: string;
  Title?: string;
  Content?: string;
  Date: string;
  "Article URL"?: string;
  URL?: string;
  Source: string;
  "Extracted Topics"?: string;
}

export interface StaticDataSource {
  source_file: string;
  data: StaticArticleData[];
}

export class StaticDataService {
  private static articles: ArticleData[] | null = null;

  public static async loadArticles(): Promise<ArticleData[]> {
    if (this.articles) {
      return this.articles;
    }

    try {
      const response = await fetch('/data.json');
      const data: StaticDataSource[] = await response.json();
      
      this.articles = data.flatMap(source => 
        source.data.map(article => this.transformArticle(article, source.source_file))
      );

      // Sort by date (newest first)
      this.articles.sort((a, b) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateB - dateA;
      });

      return this.articles;
    } catch (error) {
      console.error('Failed to load static data:', error);
      return [];
    }
  }

  private static transformArticle(article: StaticArticleData, sourceFile: string): ArticleData {
    // Extract source name from file name
    const sourceName = this.extractSourceName(sourceFile);
    
    // Handle different field names
    const title = article.Heading || article.Title || 'Untitled';
    let url = article["Article URL"] || article.URL || '#';
    const content = article.Content || '';
    
    // Ensure URL is properly formatted
    if (url && url !== '#') {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
    }
    
    // Create a shorter summary from the content
    const summary = this.createSummary(content, title);
    
         // Extract keywords from "Extracted Topics" or generate from title/content
     let keywords: string[] = [];
     if (article["Extracted Topics"]) {
       keywords = article["Extracted Topics"]
         .split(',')
         .map(topic => topic.trim())
         .filter(topic => topic.length > 0);
     } else {
               // Generate keywords from title and content if not provided
        const text = (title + ' ' + content).toLowerCase();
        const commonKeywords = [
          'gift', 'gifting', 'corporate', 'business', 'employee', 'client',
          'trend', 'trending', '2025', 'luxury', 'premium', 'sustainable',
          'eco-friendly', 'eco', 'friendly', 'green', 'recycled', 'bamboo',
          'organic', 'plantable', 'reusable', 'personalized', 'custom', 'branded', 'wellness',
          'remote', 'hybrid', 'workplace', 'culture', 'retention', 'onboarding',
          'appreciation', 'recognition', 'loyalty', 'engagement', 'productivity',
          'technology', 'innovation', 'experience', 'quality', 'value',
          'digital', 'smart', 'wireless', 'portable', 'gadget', 'tech',
          'health', 'wellness', 'self-care', 'mindfulness', 'fitness',
          'travel', 'lifestyle', 'fashion', 'style', 'design', 'artistic',
          'food', 'gourmet', 'culinary', 'beverage', 'coffee', 'tea',
          'home', 'office', 'workspace', 'desk', 'stationery', 'accessories',
          'event', 'celebration', 'festival', 'holiday', 'seasonal', 'anniversary',
          'birthday', 'wedding', 'graduation', 'promotion', 'achievement'
        ];
        keywords = commonKeywords.filter(keyword => text.includes(keyword));
       
       // Also extract meaningful phrases from the title
       const titleWords = title.toLowerCase().split(/\s+/).filter(word => 
         word.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should'].includes(word)
       );
       keywords = [...keywords, ...titleWords.slice(0, 3)];
       
       // Extract compound words and phrases
       const compoundPhrases = text.match(/\b\w+(?:-\w+)*\b/g) || [];
       const meaningfulCompounds = compoundPhrases.filter(phrase => 
         phrase.length > 5 && phrase.includes('-') && 
         !['this-is', 'that-is', 'there-are', 'here-are'].includes(phrase)
       );
       keywords = [...keywords, ...meaningfulCompounds.slice(0, 2)];
     }
     
     // Filter out less relevant keywords and limit to most important ones
     const relevantKeywords = keywords.filter(keyword => 
       keyword.length > 2 && 
       !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall'].includes(keyword.toLowerCase())
     ).slice(0, 8); // Limit to top 8 most relevant keywords


    return {
      id: this.generateId(title + url),
      title,
      url,
      source: sourceName,
      summary,
      publishedDate: this.parseDate(article.Date),
      keywords: relevantKeywords
    };
  }

  private static extractSourceName(sourceFile: string): string {
    // Extract meaningful source name from file name
    const fileName = sourceFile.toLowerCase();
    
    if (fileName.includes('bundledgifting')) return 'Bundled Gifting';
    if (fileName.includes('bigimpex')) return 'Big Impex';
    if (fileName.includes('corporategift')) return 'Corporate Gift';
    if (fileName.includes('ppai')) return 'PPAI';
    if (fileName.includes('woodanytime')) return 'Wood Anytime';
    if (fileName.includes('consortiumgifts')) return 'Consortium Gifts';
    
    // Default: extract from file name
    return sourceFile
      .replace(/\.csv$/, '')
      .replace(/\.xlsx$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private static parseDate(dateString: string): string {
    try {
      // Handle different date formats
      if (dateString.includes('Published ')) {
        dateString = dateString.replace('Published ', '');
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, return current date
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch (error) {
      console.warn('Failed to parse date:', dateString);
      return new Date().toISOString();
    }
  }

  private static generateId(str: string): string {
    // Create a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private static createSummary(content: string, title: string): string {
    // If content is already short, use it as is
    if (content.length <= 200) {
      return content;
    }
    
    // Create a summary from the content
    let summary = content;
    
    // Remove HTML-like content and clean up
    summary = summary.replace(/<[^>]*>/g, '');
    summary = summary.replace(/\[.*?\]/g, '');
    summary = summary.replace(/\s+/g, ' ').trim();
    
    // If the content starts with the title, remove it
    if (summary.toLowerCase().startsWith(title.toLowerCase())) {
      summary = summary.substring(title.length).trim();
    }
    
    // Take first 150 characters and add ellipsis if longer
    if (summary.length > 150) {
      // Try to break at a sentence
      const sentences = summary.split(/[.!?]/);
      if (sentences.length > 1) {
        let truncated = '';
        for (const sentence of sentences) {
          if ((truncated + sentence).length <= 150) {
            truncated += sentence + '. ';
          } else {
            break;
          }
        }
        summary = truncated.trim();
      } else {
        summary = summary.substring(0, 150) + '...';
      }
    }
    
    return summary;
  }

  public static async getTrendingWords(): Promise<any> {
    // Generate trending words based on the static data
    const articles = await this.loadArticles();
    
    // Extract common keywords and create trending data
    const keywordCounts = new Map<string, number>();
    
    articles.forEach(article => {
      if (article.keywords) {
        article.keywords.forEach(keyword => {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
        });
      }
    });

    // Filter to show only relevant keywords (minimum 2 occurrences)
    const relevantKeywords = Array.from(keywordCounts.entries())
      .filter(([term, count]) => count >= 2) // Only keywords that appear at least 2 times
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30) // Show top 30 most relevant keywords
      .map(([term, count], index) => ({
        term,
        value: Math.max(20, 100 - (index * 3)), // Better value distribution
        category: index < 10 ? 'trending' : index < 20 ? 'gifting' : 'topic'
      }));

    return {
      trendingWords: relevantKeywords.slice(0, 15), // Show top 15 trending words
      relatedQueries: relevantKeywords.slice(15, 30), // Show remaining 15 as related queries
      relatedTopics: relevantKeywords.slice(0, 15), // Show top 15 as related topics
      timeRange: 'today 12-m',
      geo: 'IN'
    };
  }

  public static async getInterestOverTime(keyword: string): Promise<any> {
    // Generate mock interest over time data
    const months = 12;
    const data = [];
    const baseValue = Math.floor(Math.random() * 40) + 30;
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i - 1));
      
      // Add seasonal variation
      let seasonalMultiplier = 1;
      if (date.getMonth() === 10) seasonalMultiplier = 1.8; // November
      if (date.getMonth() === 7) seasonalMultiplier = 1.5;  // August
      if (date.getMonth() === 3) seasonalMultiplier = 1.3;  // April
      if (date.getMonth() === 0) seasonalMultiplier = 1.2;  // January
      
      const value = Math.floor((baseValue + Math.random() * 20) * seasonalMultiplier);
      data.push({
        time: date.getTime(),
        value: [Math.min(100, Math.max(0, value))]
      });
    }
    
    return {
      default: {
        timelineData: data
      }
    };
  }

  public static async getInterestByRegion(keyword: string): Promise<any> {
    // Generate mock regional data
    const regions = [
      "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana",
      "Gujarat", "West Bengal", "Uttar Pradesh", "Kerala", "Punjab"
    ];
    
    const geoMapData: { [key: string]: string } = {};
    
    regions.forEach((region, index) => {
      const baseValue = 95 - (index * 4);
      const randomValue = baseValue + Math.floor(Math.random() * 20) - 10;
      geoMapData[region] = Math.max(0, Math.min(100, randomValue)).toString();
    });
    
    return {
      default: {
        geoMapData
      }
    };
  }
} 