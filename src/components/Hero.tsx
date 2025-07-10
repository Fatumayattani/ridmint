import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, BookOpen, Users } from 'lucide-react';
import { useAccount } from 'wagmi';

interface HeroProps {
  setShowWalletOptions: (show: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({ setShowWalletOptions }) => {
  const { isConnected } = useAccount();

  const handleStartCreating = () => {
    if (isConnected) {
      window.location.href = '/create-story';
    } else {
      setShowWalletOptions(true);
    }
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-pink-50 via-green-50 to-yellow-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-200/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-200/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300/20 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-200 animate-fade-in">
                <Sparkles className="w-4 h-4 text-pink-600 animate-spin-slow" />
                <span className="text-sm font-medium bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Web3 Storytelling
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
              Turn Stories Into
              <span className="block bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent animate-gradient">
                Digital Gold
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-slide-up delay-200">
              Mint your stories as tokens using Zora Coins. Build a community that invests in your creativity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-400">
              <button 
                onClick={handleStartCreating}
                className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isConnected ? 'Start Creating' : 'Connect & Create'}
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => window.location.href = '/stories'}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 rounded-xl font-semibold hover:bg-white transition-all border border-gray-200 hover:shadow-lg"
              >
                Explore Library
              </button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative animate-float">
            <div className="relative bg-gradient-to-br from-pink-100 to-green-100 rounded-3xl p-8 shadow-2xl">
              {/* Mock story cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-md transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Digital Dreams</h3>
                      <p className="text-xs text-gray-500">Fantasy • 1,200 tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">+24% ↗</span>
                    <span className="text-xs text-gray-500">0.05 ETH</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quantum Hearts</h3>
                      <p className="text-xs text-gray-500">Sci-Fi • 800 tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">+18% ↗</span>
                    <span className="text-xs text-gray-500">0.03 ETH</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-green-400 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mystic Tales</h3>
                      <p className="text-xs text-gray-500">Mystery • 2,000 tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">+31% ↗</span>
                    <span className="text-xs text-gray-500">0.08 ETH</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;