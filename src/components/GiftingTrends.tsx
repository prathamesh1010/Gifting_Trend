import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { ArticleData } from '@/types/article';
import { ExportService } from '@/services/ExportService';

interface GiftingTrendsProps {
  articles: ArticleData[];
  isLoading: boolean;
}

export const GiftingTrends = ({ articles, isLoading }: GiftingTrendsProps) => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (articles.length === 0) {
      toast({
        title: "No data",
        description: "Please wait for articles to load before exporting",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your report...",
      });

      await ExportService.exportToPDF(articles);
      
      toast({
        title: "PDF exported",
        description: "Your report has been downloaded successfully",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = async () => {
    if (articles.length === 0) {
      toast({
        title: "No data",
        description: "Please wait for articles to load before exporting",
        variant: "destructive",
      });
      return;
    }

    try {
      await ExportService.exportToExcel(articles);
      toast({
        title: "Excel exported",
        description: "Articles downloaded as Excel file successfully",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Gifting Trends
        </CardTitle>
        <CardDescription>
          Latest gifting industry insights and trends for 2024-2025
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Info */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium">Articles Analyzed</p>
            <p className="text-2xl font-bold text-primary">{articles.length}</p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={articles.length === 0 || isLoading}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportExcel}
            disabled={articles.length === 0 || isLoading}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>

        {isLoading && (
          <div className="p-4 rounded-lg bg-muted/50 border border-muted">
            <p className="text-sm text-muted-foreground">
              Loading latest gifting trends...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};