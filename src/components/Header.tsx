import { Wallet } from 'lucide-react';
import { WalletDropdown } from './WalletDropdown';

interface HeaderProps {
  account: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Header({ account, isConnecting, onConnect, onDisconnect }: HeaderProps) {
  return (
    <header className="bg-white border-b-[3px] border-[#2D2D2D] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#F4A261] border-[2px] border-[#2D2D2D] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]">
              <Wallet className="w-6 h-6 text-[#2D2D2D]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2D2D2D] tracking-tight">
              Ridmint
            </h1>
          </div>

          {account ? (
            <WalletDropdown account={account} onDisconnect={onDisconnect} />
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="px-6 py-2 bg-[#E9C46A] text-[#2D2D2D] font-semibold illustrated-button-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
