import { X, Wallet } from 'lucide-react';
import { useEffect } from 'react';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: 'coinbase' | 'metamask' | 'core') => void;
  isConnecting: boolean;
}

export function WalletSelectionModal({ isOpen, onClose, onSelectWallet, isConnecting }: WalletSelectionModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'coinbase' as const,
      name: 'Coinbase Wallet',
      description: 'Recommended for Base network',
      color: 'bg-[#0052FF]',
      textColor: 'text-white',
      recommended: true,
    },
    {
      id: 'metamask' as const,
      name: 'MetaMask',
      description: 'Most popular Web3 wallet',
      color: 'bg-[#F6851B]',
      textColor: 'text-white',
      recommended: false,
    },
    {
      id: 'core' as const,
      name: 'Core',
      description: 'Multi-chain wallet solution',
      color: 'bg-[#2D2D2D]',
      textColor: 'text-white',
      recommended: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[24px] border-[3px] border-[#2D2D2D] shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-[22px] border-b-[3px] border-[#2D2D2D] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-3xl font-black text-[#2D2D2D]">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#E3F2FD] transition-colors"
            disabled={isConnecting}
          >
            <X className="w-5 h-5 text-[#2D2D2D]" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[#2D2D2D] mb-6 text-sm font-medium">
            Choose your preferred wallet to connect to Ridmint. All wallets support Base network.
          </p>

          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => onSelectWallet(wallet.id)}
                disabled={isConnecting}
                className="w-full p-4 rounded-[16px] border-[3px] border-[#2D2D2D] bg-white hover:bg-[#E3F2FD] transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(45,45,45,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-[3px_3px_0px_0px_rgba(45,45,45,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-[12px] ${wallet.color} border-[2px] border-[#2D2D2D] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]`}>
                    <Wallet className={`w-6 h-6 ${wallet.textColor}`} />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-[#2D2D2D]">{wallet.name}</h3>
                      {wallet.recommended && (
                        <span className="px-2 py-0.5 bg-[#64B5F6] text-white text-xs font-bold rounded-full">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-base text-[#2D2D2D] font-semibold">{wallet.description}</p>
                  </div>

                  <div className="text-[#2D2D2D]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-[12px] bg-[#E3F2FD] border-[2px] border-[#64B5F6]">
            <p className="text-sm text-[#2D2D2D] font-semibold leading-relaxed">
              <span className="font-bold">New to Web3?</span> A wallet is required to interact with blockchain applications. We recommend starting with Coinbase Wallet for the best experience on Base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
