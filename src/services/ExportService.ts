import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ArticleData } from '@/types/article';
import html2canvas from 'html2canvas';

export class ExportService {
  public static async exportToPDF(articles: ArticleData[]): Promise<void> {
    if (!articles || articles.length === 0) {
      throw new Error('No articles provided for PDF export');
    }

    try {
      console.log('Starting PDF generation...');
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 6;
      let yPosition = margin;

      // Title
      console.log('Adding title...');
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gifting Trends Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += lineHeight * 2;

      // Subtitle
      console.log('Adding subtitle...');
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      pdf.text(`Total Articles: ${articles.length}`, pageWidth / 2, yPosition + lineHeight, { align: 'center' });
      yPosition += lineHeight * 4;

      // Capture and add visualizations
      try {
        console.log('Capturing visualizations...');
        const visualizationsElement = document.getElementById('pdf-visualizations');
        if (visualizationsElement) {
          // Wait for charts to be fully rendered
          await new Promise(resolve => setTimeout(resolve, 1000));

          const canvas = await html2canvas(visualizationsElement, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: true,
            allowTaint: true,
            backgroundColor: null,
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add new page for visualizations if needed
          if (yPosition + imgHeight > pageHeight) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + lineHeight * 2;
        } else {
          console.warn('Visualizations element not found');
        }
      } catch (visualError) {
        console.error('Error capturing visualizations:', visualError);
      }

      // Add a new page before starting articles
      pdf.addPage();
      yPosition = margin;

      // Analytics Summary
      console.log('Adding analytics summary...');
      const sources = Array.from(new Set(articles.map(article => article.source)));
      const keywords = Array.from(new Set(articles.flatMap(article => article.keywords || [])));
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Summary', margin, yPosition);
      yPosition += lineHeight * 1.5;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Sources: ${sources.length}`, margin, yPosition);
      pdf.text(`Keywords: ${keywords.length}`, pageWidth / 2, yPosition);
      yPosition += lineHeight;
      
      // Source distribution
      console.log('Adding source distribution...');
      const sourceData = articles.reduce((acc, article) => {
        acc[article.source] = (acc[article.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      pdf.text('Top Sources:', margin, yPosition);
      yPosition += lineHeight;
      Object.entries(sourceData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([source, count]) => {
          pdf.text(`• ${source}: ${count} articles`, margin + 10, yPosition);
          yPosition += lineHeight * 0.8;
        });
      
      yPosition += lineHeight * 2;

      // Articles
      console.log('Adding articles...');
      articles.forEach((article, index) => {
        try {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${article.title}`, margin, yPosition);
          yPosition += lineHeight * 1.5;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          let info = `Source: ${article.source}`;
          if (article.publishedDate) {
            info += ` | Date: ${new Date(article.publishedDate).toLocaleDateString()}`;
          }
          pdf.text(info, margin, yPosition);
          yPosition += lineHeight;

          pdf.setTextColor(0, 0, 255);
          pdf.text(`URL: ${article.url}`, margin, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += lineHeight * 1.5;

          pdf.setFontSize(10);
          const summaryLines = pdf.splitTextToSize(article.summary, pageWidth - margin * 2);
          pdf.text(summaryLines, margin, yPosition);
          yPosition += summaryLines.length * lineHeight + lineHeight;

          if (article.keywords && article.keywords.length > 0) {
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Keywords: ${article.keywords.join(', ')}`, margin, yPosition);
            pdf.setFont('helvetica', 'normal');
            yPosition += lineHeight * 2;
          } else {
            yPosition += lineHeight;
          }
        } catch (articleError) {
          console.error(`Error processing article ${index}:`, articleError);
        }
      });

      console.log('Saving PDF...');
      const filename = `gifting-trends-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF report: ${error.message}`);
    }
  }

  public static async exportToExcel(articles: ArticleData[]): Promise<void> {
    try {
      // Prepare data for Excel
      const excelData = articles.map((article, index) => ({
        'No.': index + 1,
        'Title': article.title,
        'Source': article.source,
        'Published Date': article.publishedDate 
          ? new Date(article.publishedDate).toLocaleDateString() 
          : 'Not available',
        'URL': article.url,
        'Summary': article.summary,
        'Keywords': article.keywords ? article.keywords.join(', ') : '',
        'Scraped On': new Date().toLocaleDateString()
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 5 },   // No.
        { wch: 50 },  // Title
        { wch: 20 },  // Source
        { wch: 15 },  // Published Date
        { wch: 50 },  // URL
        { wch: 60 },  // Summary
        { wch: 30 },  // Keywords
        { wch: 15 }   // Scraped On
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gifting Trends Articles');

      // Create summary sheet
      const summaryData = [
        { Metric: 'Total Articles', Value: articles.length },
        { Metric: 'Sources', Value: Array.from(new Set(articles.map(a => a.source))).join(', ') },
        { Metric: 'Date Range', Value: this.getDateRange(articles) },
        { Metric: 'Generated On', Value: new Date().toLocaleDateString() },
        { Metric: 'Top Keywords', Value: this.getTopKeywords(articles) }
      ];
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Convert to binary and save
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'gifting-trends-articles.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error('Failed to generate Excel report');
    }
  }

  private static getDateRange(articles: ArticleData[]): string {
    const dates = articles
      .filter(a => a.publishedDate)
      .map(a => new Date(a.publishedDate!))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) return 'No dates available';
    if (dates.length === 1) return dates[0].toLocaleDateString();

    const earliest = dates[0].toLocaleDateString();
    const latest = dates[dates.length - 1].toLocaleDateString();
    return `${earliest} to ${latest}`;
  }

  private static getTopKeywords(articles: ArticleData[]): string {
    const keywordCount: { [key: string]: number } = {};
    
    articles.forEach(article => {
      if (article.keywords) {
        article.keywords.forEach(keyword => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        });
      }
    });

    const sortedKeywords = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keyword, count]) => `${keyword} (${count})`);

    return sortedKeywords.join(', ') || 'None';
  }
}