import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Wallet } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import UserProfileDropdown from './UserProfileDropdown';

interface HeaderProps {
  setShowWalletOptions: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowWalletOptions }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Redirect to create story page when wallet is connected
  useEffect(() => {
    if (isConnected) {
      navigate('/create-story');
    }
  }, [isConnected, navigate]);

  const handleConnectClick = () => {
    setShowWalletOptions(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gray-200/90 backdrop-blur-md border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/ridmlogo.png" alt="Ridmint" className="w-[130px] h-[130px]" />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => navigate('/')} className="text-gray-900 font-semibold hover:text-pink-600 transition-colors">Home</button>
            <button onClick={() => navigate('/stories')} className="text-gray-900 font-semibold hover:text-pink-600 transition-colors">Library</button>
            <a href="/#features" className="text-gray-900 font-semibold hover:text-pink-600 transition-colors">Features</a>
            <a href="/#how-it-works" className="text-gray-900 font-semibold hover:text-pink-600 transition-colors">How It Works</a>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <UserProfileDropdown address={address!} />
            ) : (
              <button 
                onClick={handleConnectClick}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg hover:from-pink-600 hover:to-green-600 transition-all transform hover:scale-105"
              >
                <Wallet className="w-4 h-4 inline mr-2" />
                Connect Wallet
              </button>
            )}
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="px-2 pt-2 pb-3 space-y-1 bg-gray-200/90">
              <button onClick={() => navigate('/')} className="block w-full text-left px-3 py-2 text-gray-900 font-semibold hover:text-pink-600">Home</button>
              <button onClick={() => navigate('/stories')} className="block w-full text-left px-3 py-2 text-gray-900 font-semibold hover:text-pink-600">Library</button>
              <a href="/#features" className="block px-3 py-2 text-gray-900 font-semibold hover:text-pink-600">Features</a>
              <a href="/#how-it-works" className="block px-3 py-2 text-gray-900 font-semibold hover:text-pink-600">How It Works</a>
              <div className="pt-4 space-y-2">
                {isConnected ? (
                  <UserProfileDropdown address={address!} />
                ) : (
                  <button 
                    onClick={handleConnectClick}
                    className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;