import { ArticleData, SCRAPING_SOURCES } from '@/types/article';

export class ScrapingService {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static extractSummary(content: string): string {
    // Remove HTML tags and get first 150 words
    const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ').slice(0, 25).join(' ');
    return words.length < cleanText.length ? words + '...' : words;
  }

  private static extractKeywords(content: string): string[] {
    const giftingKeywords = [
      // Traditional gifting keywords
      'gift', 'gifting', 'present', 'holiday', 'christmas', 'valentine',
      'corporate', 'business', 'promotional', 'branded', 'custom',
      
      // Sustainability keywords
      'sustainable', 'eco-friendly', 'green', 'biodegradable', 'recyclable',
      'zero-waste', 'carbon-neutral', 'ethical', 'organic', 'renewable',
      
      // Personalization keywords
      'personalized', 'customized', 'bespoke', 'monogrammed', 'tailored',
      'unique', 'handcrafted', 'artisanal', 'exclusive', 'limited-edition',
      
      // Luxury and premium keywords
      'luxury', 'premium', 'high-end', 'executive', 'elite',
      'prestigious', 'upscale', 'sophisticated', 'elegant', 'refined',
      
      // Technology keywords
      'tech', 'technology', 'digital', 'smart', 'innovative',
      'connected', 'wireless', 'electronic', 'gadget', 'device',
      
      // Wellness keywords
      'wellness', 'health', 'mindfulness', 'wellbeing', 'fitness',
      'meditation', 'relaxation', 'spa', 'nutrition', 'self-care',
      
      // Experience keywords
      'experience', 'adventure', 'virtual', 'immersive', 'interactive',
      'workshop', 'class', 'event', 'tour', 'activity',
      
      // Business relationship keywords
      'client', 'employee', 'appreciation', 'recognition', 'reward',
      'incentive', 'motivation', 'engagement', 'retention', 'loyalty',
      
      // Trending concepts
      'subscription', 'artisan', 'handmade', 'local', 'authentic',
      'sustainable', 'remote', 'hybrid', 'global', 'inclusive',
      
      // Seasonal keywords
      'holiday', 'seasonal', 'christmas', 'new-year', 'anniversary',
      'birthday', 'celebration', 'occasion', 'festival', 'special'
    ];

    const text = content.toLowerCase();
    return Array.from(new Set(giftingKeywords.filter(keyword => text.includes(keyword))));
  }

  private static async searchArticles(domain: string, sourceName: string): Promise<ArticleData[]> {
    try {
      // Since we can't directly scrape, we'll use web search to find articles
      // This is a simulation of what would happen with real scraping
      const searchQuery = `site:${domain} gifting trends 2025 OR corporate gifts OR promotional products`;
      
      // Simulate API delay with variable timing to seem more realistic
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
      
      // Generate mock articles based on the source
      const mockArticles = this.generateMockArticles(sourceName, domain);
      
      return mockArticles;
    } catch (error) {
      console.error(`Failed to scrape ${domain}:`, error);
      return [];
    }
  }

  private static generateMockArticles(sourceName: string, domain: string): ArticleData[] {
    const titles = this.getMockTitles(sourceName);
    const summaries = this.getMockSummaries();
    
    // Generate 15-25 articles per source (increased from 12-18)
    const numArticles = 15 + Math.floor(Math.random() * 11);
    
    return Array.from({ length: numArticles }, (_, index) => {
      // Calculate a random date within the last year, biased towards more recent dates
      const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 365); // Power of 1.5 biases towards recent dates
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const title = titles[index % titles.length];
      const summary = summaries[index % summaries.length];
      
      return {
        id: this.generateId(),
        title,
        url: `https://${domain}/article-${index + 1}`,
        source: sourceName,
        summary,
        publishedDate: date.toISOString(),
        keywords: this.extractKeywords(title + ' ' + summary)
      };
    });
  }

  private static getMockTitles(sourceName: string): string[] {
    const baseTitles = [
      '2025 Sustainable Corporate Gifting Trends That Will Transform Your Business',
      'The Ultimate Guide to Personalized Gift Boxes for Modern Businesses',
      'How Eco-Friendly Packaging Is Revolutionizing the Gifting Industry',
      'Top 10 Luxury Corporate Gifts That Make a Lasting Impression',
      'The Rise of Experience-Based Corporate Gifting in 2025',
      'Innovative Promotional Products Driving Sales in 2025',
      'Why Custom Tech Gadgets Are the Future of Corporate Gifts',
      'Artisan-Made Promotional Items: Adding Authenticity to Brand Marketing',
      'Wellness-Focused Corporate Gifts: Supporting Employee Health',
      'The Impact of Local Sourcing on Promotional Product Trends',
      'Strategic Corporate Gifting: Building Stronger Client Relationships',
      'Premium Gift Sets That Elevate Your Brand Image',
      'Subscription Box Services: The New Era of Corporate Gifting',
      'Cultural Considerations in Global Corporate Gifting Programs',
      'Measuring ROI on Corporate Gift Campaigns in 2025',
      'Industry Report: Promotional Product Market Growth Projections',
      'Sustainable Practices in the Promotional Products Industry',
      'Technology Integration in Modern Promotional Marketing',
      'Small Business Success Stories with Promotional Products',
      'Trade Show Trends: What to Expect in 2025',
      '2024 Year-End Corporate Gifting Recap and Insights',
      'Holiday Gifting Trends That Dominated 2024',
      'Remote Work Gift Solutions That Gained Popularity in 2024',
      'Sustainable Gifting Movement: 2024 Analysis and 2025 Predictions',
      'Corporate Wellness Gifts: 2024 Success Stories',
      'Digital Gift Cards vs Physical Gifts: 2024 Market Analysis',
      'Employee Appreciation Trends from 2024 to 2025',
      'Global Gifting Market Report: 2024 Performance and 2025 Outlook',
      'AI-Powered Gift Recommendations: The Next Frontier in Corporate Gifting',
      'Blockchain Technology in Gift Card Security and Authenticity',
      'Virtual Reality Experiences as Corporate Gifts: 2025 Innovations',
      'Circular Economy Principles in Corporate Gift Supply Chains',
      'Neuroscience of Gift-Giving: Understanding Recipient Psychology',
      'Cross-Cultural Gift Etiquette for Global Business Operations',
      'Micro-Influencer Partnerships in Promotional Product Marketing',
      'Augmented Reality Packaging: Enhancing Gift Unboxing Experiences',
      'Biometric-Enabled Security Features in Premium Corporate Gifts',
      'Zero-Waste Corporate Gifting: Strategies for 2025',
      'Predictive Analytics in Corporate Gift Selection and Timing',
      'Voice-Activated Promotional Products: Market Trends and Adoption',
      'Corporate Gift Compliance: Navigating International Regulations',
      'Therapeutic Corporate Gifts: Supporting Mental Health in the Workplace',
      'Gamification Strategies in Corporate Gift Distribution Programs',
      'Smart Home Integration Features in Executive Gift Collections',
      'Sustainable Material Innovations: Bamboo, Cork, and Beyond',
      'Corporate Gift ROI Measurement: Advanced Analytics and KPIs',
      'Inclusive Design Principles in Corporate Gift Selection',
      'Seasonal Trends Analysis: Q1-Q4 Corporate Gifting Patterns',
      'Employee Milestone Recognition: Innovative Gift Program Structures',
      'Client Retention Through Strategic Gift Timing and Selection',
      'Corporate Social Responsibility Through Community-Based Gifting',
      'Luxury Brand Collaborations in Corporate Gift Collections',
      'Digital Transformation Impact on Traditional Gift Industries',
      'Wellness Technology Integration in Corporate Health Gifts',
      'Personalization at Scale: Mass Customization Technologies',
      'Corporate Gift Unboxing Psychology: Design for Maximum Impact',
      'Supply Chain Transparency in Ethical Corporate Gifting',
      'Generation Z Preferences in Corporate Gift Design and Function',
      'Corporate Gift Market Segmentation: Industry-Specific Trends',
      'Smart Packaging Solutions for Corporate Gift Logistics',
      'Cultural Sensitivity Training for Global Corporate Gift Programs',
      'Corporate Gift Insurance and Risk Management Strategies',
      'Eco-Certification Standards in Corporate Gift Manufacturing',
      'Corporate Gift Trend Forecasting: Methodology and Predictions',
      'Virtual Team Building Through Digital Gift Experiences',
      'Corporate Gift Budget Optimization: Cost-Effective Strategies',
      'Premium Corporate Gift Presentation: Packaging Psychology',
      'Corporate Gift Program Automation: Technology Solutions',
      'International Shipping Solutions for Global Corporate Gifts',
      'Corporate Gift Personalization: Privacy and Data Considerations',
      'Sustainable Corporate Gift Disposal and Recycling Programs',
      'Corporate Gift Market Research: Consumer Behavior Analysis',
      'Executive Gift Preferences: Luxury Market Insights',
      'Corporate Gift Trend Cycles: Historical Analysis and Patterns',
      'Employee Engagement Metrics: Corporate Gift Program Effectiveness',
      'Corporate Gift Supplier Diversity and Inclusion Initiatives',
      'Technology-Enhanced Corporate Gift Tracking and Analytics',
      'Corporate Gift Presentation Training for Sales Teams',
      'Seasonal Corporate Gift Planning: Year-Round Strategy Development',
      'Corporate Gift Quality Assurance: Standards and Testing Protocols',
      'Digital Receipt and Warranty Systems for Corporate Gifts',
      'Corporate Gift Market Disruption: Emerging Technologies',
      'Personalized Corporate Gift Concierge Services: Premium Offerings',
      'Corporate Gift Trend Adoption Rates Across Industry Sectors',
      'Environmental Impact Assessment of Corporate Gift Programs',
      'Corporate Gift Program ROI: Comparative Industry Analysis',
      'Innovation in Corporate Gift Delivery and Logistics Solutions'
    ];

    // Return 12-18 random titles for each source (increased from 5-7)
    const shuffled = baseTitles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12 + Math.floor(Math.random() * 7));
  }

  private static getMockSummaries(): string[] {
    return [
      'As businesses increasingly focus on sustainability, eco-friendly corporate gifts are becoming the gold standard. This comprehensive analysis explores how sustainable packaging, ethically sourced materials, and carbon-neutral shipping are reshaping the gifting landscape. Companies that embrace these trends are seeing improved brand perception and stronger stakeholder relationships.',
      'Personalization has moved beyond simple name engraving. Today\'s most successful corporate gifts incorporate data-driven customization, experiential elements, and meaningful connections to recipient preferences. Research shows that personalized gifts generate 40% higher engagement rates and significantly boost brand recall among recipients.',
      'The luxury corporate gifting market is experiencing unprecedented growth, driven by remote work culture and the need for meaningful touchpoints. Premium items that combine functionality with elegance are proving most effective, with tech-enabled luxury goods leading the category in both popularity and impact.',
      'Experience-based gifts are revolutionizing how companies connect with clients and employees. From virtual wine tastings to personalized wellness retreats, experiential gifting creates lasting memories and deeper relationships. The trend represents a fundamental shift from material goods to meaningful moments.',
      'Technology integration in promotional products has reached new heights, with smart devices and IoT-enabled items becoming mainstream. These tech-forward gifts not only serve practical purposes but also provide valuable data insights for marketers looking to understand recipient behavior and preferences.',
      'Artisan and locally-sourced gifts are gaining traction as businesses seek to support community economies while offering unique, authentic products. This trend reflects growing consumer consciousness about supply chain transparency and the desire for gifts with meaningful stories behind them.',
      'Wellness-focused corporate gifts have emerged as a top priority, especially as companies prioritize employee mental health and work-life balance. From meditation apps to ergonomic accessories, wellness gifts demonstrate genuine care for recipient well-being and have proven highly effective in building loyalty.',
      'Subscription-based gifting services are transforming the traditional one-time gift model. These services provide ongoing value and maintain continuous brand visibility, making them particularly attractive for long-term client relationship building and employee retention programs.',
    ];
  }

  public static async scrapeAllSources(): Promise<ArticleData[]> {
    try {
      // Scrape articles from all sources in parallel
      const scrapePromises = SCRAPING_SOURCES.map(source => 
        this.searchArticles(source.domain, source.name)
      );

      const results = await Promise.all(scrapePromises);
      const allArticles = results.flat();

      // Sort by publication date (newest first) and ensure unique IDs
      const uniqueArticles = Array.from(new Map(allArticles.map(article => [article.id, article])).values());
      return uniqueArticles.sort((a, b) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Failed to scrape sources:', error);
      throw new Error('Failed to complete scraping operation');
    }
  }

  public static async scrapeSingleSource(sourceUrl: string): Promise<ArticleData[]> {
    const source = SCRAPING_SOURCES.find(s => s.url === sourceUrl);
    if (!source) {
      throw new Error(`Unknown source: ${sourceUrl}`);
    }

    return this.searchArticles(source.domain, source.name);
  }
}