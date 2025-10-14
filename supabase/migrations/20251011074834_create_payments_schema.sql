/*
  # Ridmint Conditional Payments Schema

  1. New Tables
    - `payments`
      - `id` (uuid, primary key) - Unique payment identifier
      - `creator_address` (text) - Wallet address of payment creator
      - `recipient_address` (text) - Wallet address of recipient
      - `amount` (text) - Payment amount in wei (stored as string for large numbers)
      - `token` (text) - Token type (ETH or USDC)
      - `condition_type` (text) - Type of condition (time_delay or event)
      - `condition_value` (text) - Condition parameter (timestamp or event description)
      - `status` (text) - Payment status (pending, completed, cancelled)
      - `transaction_hash` (text) - On-chain transaction hash
      - `contract_address` (text) - Escrow contract address
      - `created_at` (timestamptz) - Creation timestamp
      - `completed_at` (timestamptz, nullable) - Completion timestamp
      - `network` (text) - Network identifier (base or base-sepolia)
  
  2. Security
    - Enable RLS on `payments` table
    - Add policies for public access (DApp context)
  
  3. Indexes
    - Index on creator_address for fast lookup
    - Index on recipient_address for fast lookup
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_address text NOT NULL,
  recipient_address text NOT NULL,
  amount text NOT NULL,
  token text NOT NULL DEFAULT 'ETH',
  condition_type text NOT NULL,
  condition_value text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_hash text,
  contract_address text,
  network text NOT NULL DEFAULT 'base',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payments_creator ON payments(creator_address);
CREATE INDEX IF NOT EXISTS idx_payments_recipient ON payments(recipient_address);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON payments
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert access"
  ON payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access"
  ON payments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);