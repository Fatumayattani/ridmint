import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, DollarSign, BarChart3, Users } from 'lucide-react';

const ForCreators = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: PenTool,
      title: "Creative Freedom",
      description: "Own your IP while monetizing your work."
    },
    {
      icon: DollarSign,
      title: "Multiple Revenue",
      description: "Earn from sales, trading, and engagement."
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track performance and community metrics."
    },
    {
      icon: Users,
      title: "Direct Connection",
      description: "Build relationships with invested readers."
    }
  ];

  return (
    <section id="creators" className="py-16 bg-gradient-to-br from-green-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              For 
              <span className="bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent"> Storytellers</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Transform your passion into sustainable income. Build a community of dedicated supporters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white/60 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/create-story')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-pink-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Creating Today
            </button>
          </div>
          
          <div className="mt-12 lg:mt-0">
            <div className="bg-gradient-to-br from-green-100 to-pink-100 rounded-3xl p-8 relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Dashboard</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Stories Published</span>
                    <span className="font-bold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-gray-600">Token Value</span>
                    <span className="font-bold text-pink-600">$45,280</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-gray-600">Supporters</span>
                    <span className="font-bold text-emerald-600">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-pink-50 rounded-lg">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="font-bold bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">$3,890</span>
                  </div>
                </div>
              </div>
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-pink-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForCreators;