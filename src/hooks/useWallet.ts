import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        console.log('MetaMask not detected');
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setSigner(null);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          setAccount(accounts[0].address);
          setSigner(signer);
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initWallet();

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this DApp');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      setProvider(provider);
      setAccount(accounts[0]);
      setSigner(signer);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSigner(null);
  };

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        console.error('Network not added to MetaMask');
      } else {
        console.error('Failed to switch network:', error);
      }
    }
  };

  return {
    account,
    signer,
    provider,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    isConnected: !!account,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
