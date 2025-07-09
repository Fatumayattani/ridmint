import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';

interface UserProfileDropdownProps {
  address: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ address }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const openInEtherscan = () => {
    window.open(`https://etherscan.io/address/${address}`, '_blank');
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors"
      >
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span>{formatAddress(address)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Connected Wallet</p>
                <p className="text-sm text-gray-500">{formatAddress(address)}</p>
              </div>
            </div>
          </div>

          {/* Address Actions */}
          <div className="px-2 py-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-700">
                {copied ? 'Address Copied!' : 'Copy Address'}
              </span>
            </button>

            <button
              onClick={openInEtherscan}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">View on Etherscan</span>
            </button>
          </div>

          {/* Menu Items */}
          <div className="border-t border-gray-100 px-2 py-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Profile Settings</span>
            </button>
          </div>

          {/* Disconnect */}
          <div className="border-t border-gray-100 px-2 py-2">
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-md transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;