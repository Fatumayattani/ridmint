import React from 'react';
import { X, Wallet, ExternalLink } from 'lucide-react';
import { useConnect, Connector } from 'wagmi';

interface WalletOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletOptionsModal: React.FC<WalletOptionsModalProps> = ({ isOpen, onClose }) => {
  const { connectors, connect, isPending, error } = useConnect();

  if (!isOpen) return null;

  const getWalletIcon = (connector: Connector) => {
    // Use connector.name to determine the appropriate icon
    const name = connector.name.toLowerCase();
    
    if (name.includes('metamask')) return '🦊';
    if (name.includes('core')) return '⚡';
    if (name.includes('brave')) return '🦁';
    if (name.includes('coinbase')) return '🔵';
    if (name.includes('walletconnect')) return '🔗';
    
    // Default wallet icon for unknown wallets
    return '👛';
  };

  const getWalletName = (connector: Connector) => {
    // Return the connector name directly as wagmi already identifies wallets correctly
    return connector.name;
  };

  const getWalletDescription = (connector: Connector) => {
    const name = connector.name.toLowerCase();
    
    if (name.includes('metamask')) return 'Connect using MetaMask browser extension';
    if (name.includes('core')) return 'Connect using Core Wallet browser extension';
    if (name.includes('brave')) return 'Connect using Brave Wallet';
    if (name.includes('coinbase')) return 'Connect using Coinbase Wallet';
    if (name.includes('walletconnect')) return 'Connect using WalletConnect protocol';
    
    // Default description for unknown wallets
    return `Connect using ${connector.name}`;
  };

  const handleConnect = (connector: Connector) => {
    try {
      connect({ connector });
      onClose();
    } catch (error) {
      console.warn('Connection error:', error);
      // Continue anyway - the error might be recoverable
    }
  };

  // Filter out duplicate connectors and ensure we have unique options
  const uniqueConnectors = connectors.filter((connector, index, self) => 
    index === self.findIndex(c => c.name === connector.name)
  );

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-green-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
                <p className="text-sm text-gray-500">Choose your preferred wallet to continue</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wallet options */}
          <div className="space-y-3">
            {uniqueConnectors.map((connector) => (
              <button
                key={`${connector.id}-${connector.name}`}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getWalletIcon(connector)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 group-hover:text-pink-700">
                      {getWalletName(connector)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getWalletDescription(connector)}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600" />
              </button>
            ))}
          </div>

          {/* Connection Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-red-600">⚠️</span>
                <div className="text-xs text-red-800">
                  <p className="font-medium mb-1">Connection Error</p>
                  <p>{error.message}</p>
                  <p className="mt-1">Try refreshing the page or using a different wallet.</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>🔒</span>
              <span>Your wallet connection is secure and encrypted</span>
            </div>
          </div>

          {/* Info Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">ℹ️</span>
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Multiple Wallets Detected</p>
                <p>If you have multiple browser wallet extensions installed, each will appear as a separate option above.</p>
                <p className="mt-1">Select the wallet you want to use for creating and minting stories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletOptionsModal;