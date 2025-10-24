import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

type WalletType = 'coinbase' | 'metamask' | 'core' | null;

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);

  useEffect(() => {
    const initWallet = async () => {
      const savedWalletType = localStorage.getItem('walletType') as WalletType;
      if (typeof window === 'undefined') return;

      const injectedProvider = getWalletProvider(savedWalletType);
      if (!savedWalletType || !injectedProvider) {
        localStorage.removeItem('walletType');
        return;
      }

      try {
        // ✅ Attach event listeners only if .on() exists
        if (typeof injectedProvider.on === 'function') {
          injectedProvider.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            } else {
              handleDisconnect();
            }
          });

          injectedProvider.on('chainChanged', () => {
            window.location.reload();
          });
        }

        // ✅ Wrap provider for ethers usage
        const browserProvider = new BrowserProvider(injectedProvider);
        setProvider(browserProvider);
        setWalletType(savedWalletType);

        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setSigner(signer);
      } catch (error) {
        console.error('Error initializing wallet:', error);
        localStorage.removeItem('walletType');
      }
    };

    initWallet();

    return () => {
      const savedWalletType = localStorage.getItem('walletType') as WalletType;
      if (typeof window !== 'undefined' && savedWalletType) {
        const injectedProvider = getWalletProvider(savedWalletType);
        // ✅ Remove listeners only if supported
        if (injectedProvider && typeof injectedProvider.removeAllListeners === 'function') {
          injectedProvider.removeAllListeners('accountsChanged');
          injectedProvider.removeAllListeners('chainChanged');
        }
      }
    };
  }, []);

  const getWalletProvider = (type: WalletType) => {
    if (typeof window === 'undefined') return null;

    switch (type) {
      case 'coinbase':
        return (
          window.coinbaseWalletExtension ||
          (window.ethereum?.isCoinbaseWallet ? window.ethereum : null)
        );

      case 'metamask':
        if (window.ethereum?.providers) {
          const metamask = window.ethereum.providers.find(
            (p: any) => p.isMetaMask && !p.isAvalanche
          );
          if (metamask) return metamask;
        }
        if (window.ethereum?.isMetaMask && !window.ethereum?.isAvalanche) {
          return window.ethereum;
        }
        return null;

      case 'core':
        return (
          window.avalanche ||
          (window.ethereum?.isAvalanche ? window.ethereum : null)
        );

      default:
        return null;
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setWalletType(null);
    localStorage.removeItem('walletType');
  };

  const connectWallet = async (type: WalletType) => {
    if (!type) return;

    const injectedProvider = getWalletProvider(type);

    if (!injectedProvider) {
      const walletNames = {
        coinbase: 'Coinbase Wallet',
        metamask: 'MetaMask',
        core: 'Core Wallet'
      };
      alert(
        `Please install ${walletNames[type]} to continue. Visit the wallet's official website to download.`
      );
      return;
    }

    setIsConnecting(true);
    try {
      // ✅ Request accounts directly on the injected provider
      await injectedProvider.request({ method: 'eth_requestAccounts' });

      // ✅ Attach listeners if supported
      if (typeof injectedProvider.on === 'function') {
        injectedProvider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            handleDisconnect();
          }
        });

        injectedProvider.on('chainChanged', () => {
          window.location.reload();
        });
      }

      const browserProvider = new BrowserProvider(injectedProvider);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setAccount(address);
      setSigner(signer);
      setWalletType(type);
      localStorage.setItem('walletType', type);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    handleDisconnect();
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
    connectWallet,
    disconnect,
    switchNetwork,
    isConnected: !!account,
    walletType,
  };
}

declare global {
  interface Window {
    ethereum?: any;
    coinbaseWalletExtension?: any;
    avalanche?: any;
  }
}
