import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Your actual WalletConnect Project ID
const projectId = 'c519a8191b557e62523bc828fff4bccd'

export const config = createConfig({
  chains: [mainnet, sepolia, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Ridmint',
      appLogoUrl: 'https://ridmint.com/icon.png',
    }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Ridmint',
        description: 'Web3 Storytelling Platform',
        url: 'https://ridmint.com',
        icons: ['https://ridmint.com/icon.png']
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'light',
        themeVariables: {
          '--wcm-z-index': '1000'
        }
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false,
  multiInjectedProviderDiscovery: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}