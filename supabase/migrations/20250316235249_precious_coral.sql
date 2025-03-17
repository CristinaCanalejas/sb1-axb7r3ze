/*
  # Add Warehouse Management Tables

  1. New Tables
    - `warehouse_items`
    - `warehouse_withdrawals`
    - `withdrawal_items`
    - `workshop_deliveries`
    - `workshop_delivery_items`

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Indexes
    - Add indexes for frequently queried columns
    - Add foreign key constraints
*/

-- Warehouse Items
CREATE TABLE IF NOT EXISTS warehouse_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  unit text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  max_stock integer NOT NULL DEFAULT 0,
  location text,
  supplier text,
  last_purchase_date timestamptz,
  last_purchase_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON warehouse_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON warehouse_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'warehouse'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'warehouse'));

-- Warehouse Withdrawals
CREATE TABLE IF NOT EXISTS warehouse_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  withdrawal_number text UNIQUE NOT NULL,
  date timestamptz NOT NULL,
  withdrawn_by text NOT NULL,
  department text NOT NULL,
  equipment_id uuid REFERENCES equipment(id),
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS warehouse_withdrawals_equipment_id_idx ON warehouse_withdrawals(equipment_id);

ALTER TABLE warehouse_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON warehouse_withdrawals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON warehouse_withdrawals
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'warehouse'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'warehouse'));

-- Withdrawal Items
CREATE TABLE IF NOT EXISTS withdrawal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  withdrawal_id uuid REFERENCES warehouse_withdrawals(id) ON DELETE CASCADE,
  item_id uuid REFERENCES warehouse_items(id),
  quantity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS withdrawal_items_withdrawal_id_idx ON withdrawal_items(withdrawal_id);
CREATE INDEX IF NOT EXISTS withdrawal_items_item_id_idx ON withdrawal_items(item_id);

ALTER TABLE withdrawal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON withdrawal_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON withdrawal_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'warehouse'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'warehouse'));

-- Workshop Deliveries
CREATE TABLE IF NOT EXISTS workshop_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_number text UNIQUE NOT NULL,
  date timestamptz NOT NULL,
  time time NOT NULL,
  received_by text NOT NULL,
  department text NOT NULL,
  equipment_id uuid REFERENCES equipment(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workshop_deliveries_equipment_id_idx ON workshop_deliveries(equipment_id);

ALTER TABLE workshop_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON workshop_deliveries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON workshop_deliveries
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'warehouse', 'mechanic'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'warehouse', 'mechanic'));

-- Workshop Delivery Items
CREATE TABLE IF NOT EXISTS workshop_delivery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES workshop_deliveries(id) ON DELETE CASCADE,
  item_id uuid REFERENCES warehouse_items(id),
  quantity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workshop_delivery_items_delivery_id_idx ON workshop_delivery_items(delivery_id);
CREATE INDEX IF NOT EXISTS workshop_delivery_items_item_id_idx ON workshop_delivery_items(item_id);

ALTER TABLE workshop_delivery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON workshop_delivery_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON workshop_delivery_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'warehouse', 'mechanic'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'warehouse', 'mechanic'));

-- Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add Updated At Trigger to Warehouse Items
CREATE TRIGGER update_warehouse_items_updated_at
  BEFORE UPDATE ON warehouse_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();