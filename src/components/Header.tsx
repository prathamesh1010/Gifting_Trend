import { Gift, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export const Header = () => {
  return (
    <header className="relative z-10 py-16 text-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Gift className="w-16 h-16 mr-4 animate-pulse-glow" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-white to-white/90 bg-clip-text">
            Gifting Trends Hub
          </h1>
          <TrendingUp className="w-16 h-16 ml-4 animate-pulse-glow" />
        </div>
        <p className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
          Discover the latest gifting trends and industry insights
        </p>
      </div>
    </header>
  );
};