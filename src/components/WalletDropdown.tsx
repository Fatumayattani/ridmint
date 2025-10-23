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
        className="flex items-center space-x-2 px-5 py-3 bg-[#26A69A] text-white text-base font-black illustrated-button-sm hover:bg-[#00897B]"
      >
        <Circle className="w-2 h-2 fill-white text-white" />
        <span>{formatAddress(account)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-[16px] border-[3px] border-[#2D2D2D] shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] py-2 z-50">
          <div className="px-4 py-3 border-b-[2px] border-[#E5E5E5]">
            <p className="text-sm text-gray-600 mb-1 font-bold">Connected Account</p>
            <p className="text-base font-bold text-[#2D2D2D] break-all">{account}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-[#26A69A] text-[#26A69A]" />
                <span className="text-sm text-gray-700 font-bold">Connected</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm text-gray-700 font-bold">Base Sepolia</span>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-[#E3F2FD] transition-colors duration-150"
          >
            <LogOut className="w-4 h-4 text-[#2D2D2D]" />
            <span className="text-base font-black text-[#2D2D2D]">Disconnect Wallet</span>
          </button>
        </div>
      )}
    </div>
  );
}
