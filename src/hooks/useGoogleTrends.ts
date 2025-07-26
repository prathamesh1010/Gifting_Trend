import { useState, useEffect, useCallback } from 'react';
import { GoogleTrendsService, TrendingData } from '@/services/GoogleTrendsService';

interface UseGoogleTrendsOptions {
  timeRange?: string;
  geo?: string;
  autoFetch?: boolean;
}

export const useGoogleTrends = (options: UseGoogleTrendsOptions = {}) => {
  const {
    timeRange = 'today 12-m',
    geo = 'IN',
    autoFetch = true
  } = options;

  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrendingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await GoogleTrendsService.getTrendingWords(timeRange, geo);
      setTrendingData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch trending data. Please try again later.');
      console.error('Error fetching trending data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, geo]);

  const fetchInterestOverTime = useCallback(async (keyword: string) => {
    try {
      const data = await GoogleTrendsService.getInterestOverTime(keyword, timeRange, geo);
      return data;
    } catch (err) {
      console.error('Error fetching interest over time:', err);
      return null;
    }
  }, [timeRange, geo]);

  const fetchInterestByRegion = useCallback(async (keyword: string) => {
    try {
      const data = await GoogleTrendsService.getInterestByRegion(keyword, geo);
      return data;
    } catch (err) {
      console.error('Error fetching interest by region:', err);
      return null;
    }
  }, [geo]);

  useEffect(() => {
    if (autoFetch) {
      fetchTrendingData();
    }
  }, [fetchTrendingData, autoFetch]);

  return {
    trendingData,
    isLoading,
    error,
    lastUpdated,
    fetchTrendingData,
    fetchInterestOverTime,
    fetchInterestByRegion,
    refetch: fetchTrendingData
  };
}; 