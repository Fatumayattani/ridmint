import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Coins, Users, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Edit,
      title: "Write",
      description: "Create your story with our intuitive editor."
    },
    {
      icon: Coins,
      title: "Mint",
      description: "Transform into ERC-20 tokens using Zora."
    },
    {
      icon: Users,
      title: "Share",
      description: "Build community around your work."
    },
    {
      icon: TrendingUp,
      title: "Earn",
      description: "Generate revenue as tokens gain value."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-pink-50 to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-40 h-40 bg-pink-200/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-green-200/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It 
            <span className="bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to monetize your creativity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-pink-600 shadow-md">
                  {index + 1}
                </div>
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-pink-300 to-green-300 transform translate-x-4"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/create-story')}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;