export const CONTRACTS = {
  CONDITIONAL_ESCROW: '0x0000000000000000000000000000000000000000', // Replace with deployed contract address
  USDC_BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDC_BASE_SEPOLIA: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
};

export const NETWORKS = {
  BASE: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
  },
};

export const CONTRACT_ABI = [
  'function createPayment(address _recipient, address _token, uint8 _conditionType, uint256 _conditionValue) external payable returns (uint256)',
  'function releasePayment(uint256 _paymentId) external',
  'function cancelPayment(uint256 _paymentId) external',
  'function getPayment(uint256 _paymentId) external view returns (tuple(address creator, address recipient, uint256 amount, address token, uint8 conditionType, uint256 conditionValue, uint8 status, uint256 createdAt))',
  'function canRelease(uint256 _paymentId) external view returns (bool)',
  'function paymentCounter() external view returns (uint256)',
  'event PaymentCreated(uint256 indexed paymentId, address indexed creator, address indexed recipient, uint256 amount, address token, uint8 conditionType, uint256 conditionValue)',
  'event PaymentReleased(uint256 indexed paymentId, address indexed recipient, uint256 amount)',
  'event PaymentCancelled(uint256 indexed paymentId, address indexed creator, uint256 amount)',
];

export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];
