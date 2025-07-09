import React from 'react';
import { Coins, Users, Shield, Globe, Zap, Heart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Coins,
      title: "Story Tokens",
      description: "Transform stories into valuable ERC-20 tokens on the blockchain.",
      bgImage: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Users,
      title: "Fan Investment",
      description: "Let supporters invest in your stories and share your success.",
      bgImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Built on Ethereum with transparent smart contracts.",
      bgImage: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with readers worldwide through Web3.",
      bgImage: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Zap,
      title: "Instant Earnings",
      description: "Start earning as readers purchase your tokens.",
      bgImage: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Heart,
      title: "Community",
      description: "Build deeper connections with invested fans.",
      bgImage: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-br from-green-50 to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/10 to-green-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative z-10">
            Why Choose 
            <span className="bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent"> Ridmint</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto relative z-10">
            Powerful features for Web3 storytelling and monetization.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-pink-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Background image overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-cover bg-center"
                style={{ backgroundImage: `url(${feature.bgImage})` }}
              ></div>
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-pink-600 group-hover:text-green-600 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-700 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
              </div>
              
              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* Additional decorative elements */}
        <div className="mt-16 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Powered by blockchain technology</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;