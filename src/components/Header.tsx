import { WalletDropdown } from './WalletDropdown';
import { WalletSelectionModal } from './WalletSelectionModal';
import { useState } from 'react';

interface HeaderProps {
  account: string | null;
  isConnecting: boolean;
  onConnectWallet: (walletType: 'coinbase' | 'metamask' | 'core') => void;
  onDisconnect: () => void;
}

export function Header({ account, isConnecting, onConnectWallet, onDisconnect }: HeaderProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleWalletSelect = (walletType: 'coinbase' | 'metamask' | 'core') => {
    setIsWalletModalOpen(false);
    onConnectWallet(walletType);
  };

  return (
    <header className="bg-white border-b-[3px] border-[#2D2D2D] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-3">
            <img
              src="/images/ridmint.png"
              alt="Ridmint Logo"
              className="h-60 w-60"
            />
          </div>

          {account ? (
            <WalletDropdown account={account} onDisconnect={onDisconnect} />
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              disabled={isConnecting}
              className="px-6 py-3 bg-[#1E88E5] text-white text-base font-black illustrated-button-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1976D2]"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      <WalletSelectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
        isConnecting={isConnecting}
      />
    </header>
  );
}
