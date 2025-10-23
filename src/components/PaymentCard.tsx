import { Clock, CheckCircle2, XCircle, ArrowRight, Calendar } from 'lucide-react';
import { Payment } from '../lib/supabase';
import { formatAddress, formatAmount, formatDate, formatTimeRemaining } from '../utils/format';
import { Contract } from 'ethers';
import { useState } from 'react';

interface PaymentCardProps {
  payment: Payment;
  currentAddress: string;
  onRelease: (paymentId: string) => Promise<void>;
  onCancel: (paymentId: string) => Promise<void>;
  contract: Contract | null;
}

export function PaymentCard({ payment, currentAddress, onRelease, onCancel, contract }: PaymentCardProps) {
  const [canRelease, setCanRelease] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCreator = payment.creator_address.toLowerCase() === currentAddress.toLowerCase();
  const isRecipient = payment.recipient_address.toLowerCase() === currentAddress.toLowerCase();

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-[#2D2D2D]',
      bgColor: 'bg-[#64B5F6]',
      borderColor: 'border-[#2D2D2D]',
      label: 'Pending',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-white',
      bgColor: 'bg-[#26A69A]',
      borderColor: 'border-[#2D2D2D]',
      label: 'Completed',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-white',
      bgColor: 'bg-[#5C6BC0]',
      borderColor: 'border-[#2D2D2D]',
      label: 'Cancelled',
    },
  };

  const status = statusConfig[payment.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const checkCanRelease = async () => {
    if (!contract || payment.status !== 'pending') return;

    try {
      const result = await contract.canRelease(0);
      setCanRelease(result);
    } catch (error) {
      console.error('Error checking release status:', error);
    }
  };

  useState(() => {
    checkCanRelease();
  });

  const handleRelease = async () => {
    setLoading(true);
    try {
      await onRelease(payment.id);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await onCancel(payment.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="illustrated-card p-6 hover:shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-[10px] ${status.bgColor} ${status.borderColor} border-[2px]`}>
          <StatusIcon className={`w-5 h-5 ${status.color}`} />
          <span className={`text-base font-black ${status.color}`}>{status.label}</span>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black text-[#2D2D2D]">
            {formatAmount(payment.amount, payment.token === 'USDC' ? 6 : 18)} {payment.token}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-base">
          <span className="text-[#2D2D2D] font-black">From</span>
          <span className="font-mono font-black text-[#2D2D2D]">{formatAddress(payment.creator_address)}</span>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-[#2D2D2D]" />
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-[#2D2D2D] font-black">To</span>
          <span className="font-mono font-black text-[#2D2D2D]">{formatAddress(payment.recipient_address)}</span>
        </div>
      </div>

      <div className="border-t-[2px] border-[#E5E5E5] pt-4 space-y-3">
        <div className="flex items-center justify-between text-base">
          <span className="text-[#2D2D2D] flex items-center space-x-2 font-black">
            <Calendar className="w-5 h-5" />
            <span>Created</span>
          </span>
          <span className="text-[#2D2D2D] font-bold">{formatDate(payment.created_at)}</span>
        </div>

        {payment.condition_type === 'time_delay' && payment.status === 'pending' && (
          <div className="flex items-center justify-between text-base">
            <span className="text-[#2D2D2D] flex items-center space-x-2 font-black">
              <Clock className="w-5 h-5" />
              <span>Release Time</span>
            </span>
            <span className="text-[#2D2D2D] font-black">
              {formatTimeRemaining(parseInt(payment.condition_value))}
            </span>
          </div>
        )}

        {payment.condition_type === 'event' && payment.status === 'pending' && (
          <div className="bg-[#BBDEFB] border-[2px] border-[#2D2D2D] rounded-[10px] p-3 text-base font-semibold text-[#2D2D2D]">
            <strong>Condition:</strong> Manual release required by creator
          </div>
        )}
      </div>

      {payment.status === 'pending' && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {((payment.condition_type === 'time_delay' && canRelease) || isRecipient) && (
            <button
              onClick={handleRelease}
              disabled={loading}
              className="flex-1 px-5 py-3 bg-[#26A69A] text-white text-base font-black illustrated-button-sm disabled:opacity-50 hover:bg-[#00897B]"
            >
              {loading ? 'Processing...' : 'Release Payment'}
            </button>
          )}

          {isCreator && (
            <>
              {payment.condition_type === 'event' && (
                <button
                  onClick={handleRelease}
                  disabled={loading}
                  className="flex-1 px-5 py-3 bg-[#26A69A] text-white text-base font-black illustrated-button-sm disabled:opacity-50 hover:bg-[#00897B]"
                >
                  {loading ? 'Processing...' : 'Release Payment'}
                </button>
              )}
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-3 bg-[#E3F2FD] text-[#5C6BC0] border-[2px] border-[#5C6BC0] rounded-[10px] text-base font-black hover:bg-[#5C6BC0] hover:text-white transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
