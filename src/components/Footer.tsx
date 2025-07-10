import React from 'react';
import { X, Github, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/ridmlogo.png" alt="Ridmint" className="w-12 h-12" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">
                Ridmint
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering storytellers to monetize creativity through blockchain technology and community support.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/rid_mint" className="text-gray-400 hover:text-pink-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <X className="w-5 h-5" />
              </a>
              <a href="https://github.com/Fatumayattani/ridmint" className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-pink-400">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a></li>
              <li><a href="/stories" className="text-gray-400 hover:text-white transition-colors text-sm">Library</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-green-400">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center">
            Made with <Heart className="w-4 h-4 text-pink-500 mx-1" /> for storytellers worldwide
          </p>
          <p className="text-gray-500 text-xs mt-2">&copy; 2025 Ridmint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;