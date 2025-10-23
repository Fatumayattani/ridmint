import { useState, useEffect } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { Header } from './components/Header';
import { PaymentCard } from './components/PaymentCard';
import { CreatePaymentModal, PaymentFormData } from './components/CreatePaymentModal';
import { useWallet } from './hooks/useWallet';
import { usePayments } from './hooks/usePayments';
import { supabase } from './lib/supabase';
import { Contract, parseUnits } from 'ethers';
import { CONTRACTS, CONTRACT_ABI, ERC20_ABI, NETWORKS } from './config/contracts';

function App() {
  const { account, signer, connectWallet, disconnect, isConnecting, switchNetwork } = useWallet();
  const { payments, loading: paymentsLoading, refetch } = usePayments(account);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    if (signer && CONTRACTS.CONDITIONAL_ESCROW !== '0x0000000000000000000000000000000000000000') {
      const contractInstance = new Contract(CONTRACTS.CONDITIONAL_ESCROW, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
  }, [signer]);

  const handleCreatePayment = async (formData: PaymentFormData) => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    if (CONTRACTS.CONDITIONAL_ESCROW === '0x0000000000000000000000000000000000000000') {
      throw new Error('Smart contract not deployed. Please deploy the contract first and update the address in src/config/contracts.ts');
    }

    await switchNetwork(NETWORKS.BASE_SEPOLIA.chainId);

    const contractInstance = new Contract(CONTRACTS.CONDITIONAL_ESCROW, CONTRACT_ABI, signer);

    const decimals = formData.token === 'USDC' ? 6 : 18;
    const amountWei = parseUnits(formData.amount, decimals);

    let tx;

    if (formData.token === 'ETH') {
      const conditionValue = formData.conditionType === 'time_delay'
        ? formData.conditionValue
        : formData.conditionValue;

      tx = await contractInstance.createPayment(
        formData.recipient,
        '0x0000000000000000000000000000000000000000',
        formData.conditionType === 'time_delay' ? 0 : 1,
        conditionValue,
        { value: amountWei }
      );
    } else {
      const usdcAddress = CONTRACTS.USDC_BASE_SEPOLIA;
      const usdcContract = new Contract(usdcAddress, ERC20_ABI, signer);

      const allowance = await usdcContract.allowance(account, CONTRACTS.CONDITIONAL_ESCROW);

      if (allowance < amountWei) {
        const approveTx = await usdcContract.approve(CONTRACTS.CONDITIONAL_ESCROW, amountWei);
        await approveTx.wait();
      }

      const conditionValue = formData.conditionType === 'time_delay'
        ? formData.conditionValue
        : formData.conditionValue;

      tx = await contractInstance.createPayment(
        formData.recipient,
        usdcAddress,
        formData.conditionType === 'time_delay' ? 0 : 1,
        conditionValue
      );
    }

    const receipt = await tx.wait();

    const conditionValue = formData.conditionType === 'time_delay'
      ? (Math.floor(Date.now() / 1000) + parseInt(formData.conditionValue)).toString()
      : formData.conditionValue;

    await supabase.from('payments').insert({
      creator_address: account.toLowerCase(),
      recipient_address: formData.recipient.toLowerCase(),
      amount: amountWei.toString(),
      token: formData.token,
      condition_type: formData.conditionType,
      condition_value: conditionValue,
      status: 'pending',
      transaction_hash: receipt.hash,
      contract_address: CONTRACTS.CONDITIONAL_ESCROW,
      network: 'base-sepolia',
    });

    await refetch();
  };

  const handleReleasePayment = async (paymentId: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await contract.releasePayment(0);
    await tx.wait();

    await supabase
      .from('payments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', paymentId);

    await refetch();
  };

  const handleCancelPayment = async (paymentId: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await contract.cancelPayment(0);
    await tx.wait();

    await supabase
      .from('payments')
      .update({ status: 'cancelled' })
      .eq('id', paymentId);

    await refetch();
  };

  const sentPayments = payments.filter(p =>
    p.creator_address.toLowerCase() === account?.toLowerCase()
  );

  const receivedPayments = payments.filter(p =>
    p.recipient_address.toLowerCase() === account?.toLowerCase()
  );

  const displayedPayments = activeTab === 'sent' ? sentPayments : receivedPayments;

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      <Header
        account={account}
        isConnecting={isConnecting}
        onConnectWallet={connectWallet}
        onDisconnect={disconnect}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!account ? (
          <div className="text-center py-24 px-8 illustrated-card max-w-3xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-[20px] bg-[#1E88E5] border-[3px] border-[#2D2D2D] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]">
              <Inbox className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#2D2D2D] mb-6">
              Welcome to Ridmint
            </h2>
            <p className="text-[#2D2D2D] text-xl font-semibold max-w-md mx-auto leading-relaxed">
              Create conditional payments on Base network. Set time delays or custom conditions for automatic fund release.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-4xl font-black text-[#2D2D2D] mb-2">Your Payments</h2>
                <p className="text-[#2D2D2D] text-lg font-semibold">Manage your conditional payments on Base</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-[#1E88E5] text-white text-lg font-black illustrated-button flex items-center space-x-2 hover:bg-[#1976D2]"
              >
                <Plus className="w-6 h-6" />
                <span>Create Payment</span>
              </button>
            </div>

            <div className="mb-6">
              <div className="border-b-[3px] border-[#2D2D2D]">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`pb-4 px-1 border-b-[3px] font-bold text-sm transition-colors ${
                      activeTab === 'sent'
                        ? 'border-[#1E88E5] text-[#2D2D2D]'
                        : 'border-transparent text-[#2D2D2D] hover:text-[#1E88E5]'
                    }`}
                  >
                    Sent ({sentPayments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`pb-4 px-1 border-b-[3px] font-bold text-sm transition-colors ${
                      activeTab === 'received'
                        ? 'border-[#26A69A] text-[#2D2D2D]'
                        : 'border-transparent text-[#2D2D2D] hover:text-[#26A69A]'
                    }`}
                  >
                    Received ({receivedPayments.length})
                  </button>
                </nav>
              </div>
            </div>

            {paymentsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-[3px] border-[#1E88E5] mx-auto"></div>
                <p className="text-[#2D2D2D] mt-4 font-medium">Loading payments...</p>
              </div>
            ) : displayedPayments.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-[16px] bg-white border-[3px] border-[#2D2D2D] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]">
                  <Inbox className="w-8 h-8 text-[#2D2D2D]" />
                </div>
                <h3 className="text-xl font-black text-[#2D2D2D] mb-2">
                  No {activeTab} payments yet
                </h3>
                <p className="text-[#2D2D2D] text-base font-semibold">
                  {activeTab === 'sent'
                    ? 'Create your first conditional payment to get started'
                    : 'Payments you receive will appear here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    currentAddress={account}
                    onRelease={handleReleasePayment}
                    onCancel={handleCancelPayment}
                    contract={contract}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <CreatePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePayment}
      />
    </div>
  );
}

export default App;
