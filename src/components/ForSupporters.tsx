import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trophy, Star, Zap } from 'lucide-react';

const ForSupporters = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Heart,
      title: "Support Authors",
      description: "Invest in creators you love."
    },
    {
      icon: Trophy,
      title: "Exclusive Access",
      description: "Early content and special rewards."
    },
    {
      icon: Star,
      title: "Potential Returns",
      description: "Token value may increase over time."
    },
    {
      icon: Zap,
      title: "Community",
      description: "Connect with fellow supporters."
    }
  ];

  return (
    <section id="supporters" className="py-16 bg-gradient-to-br from-pink-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              For 
              <span className="bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent"> Supporters</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover amazing stories and invest in creators you believe in. Support helps storytellers thrive.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white/60 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/stories')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Explore Stories
            </button>
          </div>
          
          <div className="mt-12 lg:mt-0 lg:order-1">
            <div className="bg-gradient-to-br from-pink-100 to-green-100 rounded-3xl p-8 relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Stories</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">The Digital Frontier</p>
                      <p className="text-sm text-green-600">+24% this week</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-300"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Echoes of Tomorrow</p>
                      <p className="text-sm text-pink-600">+18% this week</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse delay-700"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Quantum Hearts</p>
                      <p className="text-sm text-emerald-600">+15% this week</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating decoration */}
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-r from-pink-400 to-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForSupporters;