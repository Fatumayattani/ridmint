import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Circle } from 'lucide-react';
import { formatAddress } from '../utils/format';

interface WalletDropdownProps {
  account: string;
  onDisconnect: () => void;
}

export function WalletDropdown({ account, onDisconnect }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDisconnect = () => {
    setIsOpen(false);
    onDisconnect();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#8AC185] text-[#2D2D2D] font-semibold illustrated-button-sm"
      >
        <Circle className="w-2 h-2 fill-[#2D2D2D] text-[#2D2D2D]" />
        <span>{formatAddress(account)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-[16px] border-[3px] border-[#2D2D2D] shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] py-2 z-50">
          <div className="px-4 py-3 border-b-[2px] border-[#E5E5E5]">
            <p className="text-xs text-gray-600 mb-1 font-semibold">Connected Account</p>
            <p className="text-sm font-medium text-[#2D2D2D] break-all">{account}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-[#8AC185] text-[#8AC185]" />
                <span className="text-xs text-gray-700 font-medium">Connected</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-700 font-medium">Base Sepolia</span>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-[#FEF5ED] transition-colors duration-150"
          >
            <LogOut className="w-4 h-4 text-[#2D2D2D]" />
            <span className="text-sm font-semibold text-[#2D2D2D]">Disconnect Wallet</span>
          </button>
        </div>
      )}
    </div>
  );
}
