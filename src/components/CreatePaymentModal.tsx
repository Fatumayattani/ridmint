import { useState } from 'react';
import { X, Clock, Zap } from 'lucide-react';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: PaymentFormData) => Promise<void>;
}

export interface PaymentFormData {
  recipient: string;
  amount: string;
  token: 'ETH' | 'USDC';
  conditionType: 'time_delay' | 'event';
  conditionValue: string;
}

export function CreatePaymentModal({ isOpen, onClose, onCreate }: CreatePaymentModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    recipient: '',
    amount: '',
    token: 'ETH',
    conditionType: 'time_delay',
    conditionValue: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.recipient || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.recipient)) {
      setError('Invalid recipient address');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (formData.conditionType === 'time_delay' && !formData.conditionValue) {
      setError('Please specify delay duration');
      return;
    }

    if (formData.conditionType === 'event' && !formData.conditionValue) {
      setError('Please specify event identifier');
      return;
    }

    setLoading(true);
    try {
      await onCreate(formData);
      setFormData({
        recipient: '',
        amount: '',
        token: 'ETH',
        conditionType: 'time_delay',
        conditionValue: '',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] border-[3px] border-[#2D2D2D] max-w-lg w-full shadow-[6px_6px_0px_0px_rgba(45,45,45,1)]">
        <div className="flex items-center justify-between p-6 border-b-[3px] border-[#E5E5E5]">
          <h2 className="text-3xl font-black text-[#2D2D2D]">
            Create Conditional Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FEF5ED] rounded-[10px] transition-colors"
          >
            <X className="w-5 h-5 text-[#2D2D2D]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-base font-black text-[#2D2D2D] mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="0x..."
              className="w-full px-4 py-2 border-[2px] border-[#2D2D2D] rounded-[10px] focus:ring-2 focus:ring-[#64B5F6] focus:border-[#64B5F6] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-black text-[#2D2D2D] mb-2">Amount</label>
              <input
                type="number"
                step="0.000001"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.0"
                className="w-full px-4 py-2 border-[2px] border-[#2D2D2D] rounded-[10px] focus:ring-2 focus:ring-[#64B5F6] focus:border-[#64B5F6] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-base font-black text-[#2D2D2D] mb-2">Token</label>
              <select
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value as 'ETH' | 'USDC' })}
                className="w-full px-4 py-2 border-[2px] border-[#2D2D2D] rounded-[10px] focus:ring-2 focus:ring-[#64B5F6] focus:border-[#64B5F6] outline-none transition-all bg-white"
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-black text-[#2D2D2D] mb-3">Condition Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, conditionType: 'time_delay', conditionValue: '' })}
                className={`p-4 rounded-[12px] border-[3px] transition-all ${
                  formData.conditionType === 'time_delay'
                    ? 'border-[#64B5F6] bg-[#64B5F6] shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]'
                    : 'border-[#2D2D2D] hover:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]'
                }`}
              >
                <Clock className={`w-7 h-7 mx-auto mb-2 ${formData.conditionType === 'time_delay' ? 'text-[#2D2D2D]' : 'text-[#64B5F6]'}`} />
                <div className="text-base font-black text-[#2D2D2D]">Time Delay</div>
                <div className="text-sm text-[#2D2D2D] font-bold mt-1">Auto-release after time</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, conditionType: 'event', conditionValue: '' })}
                className={`p-4 rounded-[12px] border-[3px] transition-all ${
                  formData.conditionType === 'event'
                    ? 'border-[#26A69A] bg-[#26A69A] shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]'
                    : 'border-[#2D2D2D] hover:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]'
                }`}
              >
                <Zap className={`w-7 h-7 mx-auto mb-2 ${formData.conditionType === 'event' ? 'text-[#2D2D2D]' : 'text-[#26A69A]'}`} />
                <div className="text-base font-black text-[#2D2D2D]">Event Based</div>
                <div className="text-sm text-[#2D2D2D] font-bold mt-1">Manual release</div>
              </button>
            </div>
          </div>

          {formData.conditionType === 'time_delay' && (
            <div>
              <label className="block text-base font-black text-[#2D2D2D] mb-2">
                Delay Duration
              </label>
              <select
                value={formData.conditionValue}
                onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                className="w-full px-4 py-2 border-[2px] border-[#2D2D2D] rounded-[10px] focus:ring-2 focus:ring-[#64B5F6] focus:border-[#64B5F6] outline-none transition-all bg-white"
              >
                <option value="">Select duration</option>
                <option value="300">5 minutes</option>
                <option value="3600">1 hour</option>
                <option value="86400">1 day</option>
                <option value="604800">1 week</option>
                <option value="2592000">30 days</option>
              </select>
            </div>
          )}

          {formData.conditionType === 'event' && (
            <div>
              <label className="block text-base font-black text-[#2D2D2D] mb-2">
                Event Identifier <span className="text-[#5C6BC0]">*</span>
              </label>
              <input
                type="text"
                value={formData.conditionValue}
                onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                placeholder="e.g., delivery-confirmed, milestone-reached"
                className="w-full px-4 py-2 border-[2px] border-[#2D2D2D] rounded-[10px] focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] outline-none transition-all"
                required
              />
              <p className="text-sm text-[#2D2D2D] font-semibold mt-2">
                A unique identifier that will be checked programmatically when the event occurs
              </p>
            </div>
          )}

          {error && (
            <div className="bg-[#E8EAF6] border-[2px] border-[#5C6BC0] text-[#5C6BC0] px-4 py-3 rounded-[10px] text-base font-bold">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border-[2px] border-[#2D2D2D] text-[#2D2D2D] rounded-[10px] text-base font-black hover:bg-[#E3F2FD] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 bg-[#1E88E5] text-white text-base font-black illustrated-button-sm disabled:opacity-50 hover:bg-[#1976D2]"
            >
              {loading ? 'Creating...' : 'Create Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
