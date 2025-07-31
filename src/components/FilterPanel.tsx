import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, X } from 'lucide-react';
import { ArticleData } from '@/types/article';
import { Button } from '@/components/ui/button';

export interface FilterOptions {
  searchTerm: string;
  source: string;
  dateRange: string;
  keywords: string[];
}

interface FilterPanelProps {
  articles: ArticleData[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterPanel = ({ articles, filters, onFiltersChange }: FilterPanelProps) => {
  const sources = Array.from(new Set(articles.map(article => article.source)));
  const allKeywords = Array.from(new Set(articles.flatMap(article => article.keywords || [])));
  
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleKeyword = (keyword: string) => {
    const newKeywords = filters.keywords.includes(keyword)
      ? filters.keywords.filter(k => k !== keyword)
      : [...filters.keywords, keyword];
    updateFilter('keywords', newKeywords);
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      source: 'all',
      dateRange: 'all',
      keywords: []
    });
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters & Search
          </CardTitle>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Source Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Source</label>
          <Select value={filters.source} onValueChange={(value) => updateFilter('source', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last90">Last 90 Days</SelectItem>
              <SelectItem value="last180">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>



        {/* Keywords Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Keywords</label>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {allKeywords.slice(0, 50).map(keyword => (
              <Badge
                key={keyword}
                variant={filters.keywords.includes(keyword) ? "default" : "secondary"}
                className="cursor-pointer text-xs hover:opacity-80 transition-opacity"
                onClick={() => toggleKeyword(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
          {filters.keywords.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Active filters:</p>
              <div className="flex flex-wrap gap-1">
                {filters.keywords.map(keyword => (
                  <Badge key={keyword} variant="default" className="text-xs">
                    {keyword}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => toggleKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};