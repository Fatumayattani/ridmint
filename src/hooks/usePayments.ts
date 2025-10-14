import { useState, useEffect } from 'react';
import { supabase, Payment } from '../lib/supabase';

export function usePayments(address: string | null) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setPayments([]);
      setLoading(false);
      return;
    }

    fetchPayments();

    const subscription = supabase
      .channel('payments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `creator_address=eq.${address.toLowerCase()},recipient_address=eq.${address.toLowerCase()}`,
        },
        () => {
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [address]);

  async function fetchPayments() {
    if (!address) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(`creator_address.eq.${address.toLowerCase()},recipient_address.eq.${address.toLowerCase()}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }

  return { payments, loading, refetch: fetchPayments };
}
