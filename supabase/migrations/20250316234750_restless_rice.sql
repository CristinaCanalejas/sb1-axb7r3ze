/*
  # Initial Database Schema

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `equipment`
      - `id` (uuid, primary key)
      - `internal_number` (text, unique)
      - `name` (text)
      - `type` (text)
      - `status` (text)
      - `department_id` (uuid, foreign key)
      - `technical_sheet_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `equipment_photos`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key)
      - `url` (text)
      - `created_at` (timestamp)

    - `personnel`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `department_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `personnel_roles`
      - `id` (uuid, primary key)
      - `personnel_id` (uuid, foreign key)
      - `role` (text)
      - `created_at` (timestamp)

    - `shifts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `personnel_shifts`
      - `id` (uuid, primary key)
      - `personnel_id` (uuid, foreign key)
      - `shift_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `equipment_status`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key)
      - `status` (text)
      - `exit_date` (timestamp)
      - `exit_time` (time)
      - `supervisor_id` (uuid, foreign key)
      - `mechanic_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `equipment_problems`
      - `id` (uuid, primary key)
      - `status_id` (uuid, foreign key)
      - `description` (text)
      - `created_at` (timestamp)

    - `equipment_spare_parts`
      - `id` (uuid, primary key)
      - `status_id` (uuid, foreign key)
      - `name` (text)
      - `quantity` (integer)
      - `created_at` (timestamp)

    - `working_equipment`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key)
      - `operator_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `estimated_end_time` (timestamp)
      - `location` (text)
      - `activity` (text)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `fuel_records`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key)
      - `operator_id` (uuid, foreign key)
      - `supervisor_id` (uuid, foreign key)
      - `date` (timestamp)
      - `odometer` (numeric)
      - `fuel_type` (text)
      - `liters` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Indexes
    - Add indexes for frequently queried columns
    - Add foreign key constraints
*/

-- Departments
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON departments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON departments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Equipment
CREATE TABLE equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_number text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  department_id uuid REFERENCES departments(id),
  technical_sheet_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX equipment_department_id_idx ON equipment(department_id);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON equipment
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Equipment Photos
CREATE TABLE equipment_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX equipment_photos_equipment_id_idx ON equipment_photos(equipment_id);

ALTER TABLE equipment_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON equipment_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON equipment_photos
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Personnel
CREATE TABLE personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  department_id uuid REFERENCES departments(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX personnel_department_id_idx ON personnel(department_id);

ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON personnel
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON personnel
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Personnel Roles
CREATE TABLE personnel_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personnel_id uuid REFERENCES personnel(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX personnel_roles_personnel_id_idx ON personnel_roles(personnel_id);

ALTER TABLE personnel_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON personnel_roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON personnel_roles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Shifts
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON shifts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON shifts
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Personnel Shifts
CREATE TABLE personnel_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personnel_id uuid REFERENCES personnel(id) ON DELETE CASCADE,
  shift_id uuid REFERENCES shifts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX personnel_shifts_personnel_id_idx ON personnel_shifts(personnel_id);
CREATE INDEX personnel_shifts_shift_id_idx ON personnel_shifts(shift_id);

ALTER TABLE personnel_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON personnel_shifts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to admin users"
  ON personnel_shifts
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Equipment Status
CREATE TABLE equipment_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  status text NOT NULL,
  exit_date date,
  exit_time time,
  supervisor_id uuid REFERENCES personnel(id),
  mechanic_id uuid REFERENCES personnel(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX equipment_status_equipment_id_idx ON equipment_status(equipment_id);
CREATE INDEX equipment_status_supervisor_id_idx ON equipment_status(supervisor_id);
CREATE INDEX equipment_status_mechanic_id_idx ON equipment_status(mechanic_id);

ALTER TABLE equipment_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON equipment_status
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON equipment_status
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  );

-- Equipment Problems
CREATE TABLE equipment_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status_id uuid REFERENCES equipment_status(id) ON DELETE CASCADE,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX equipment_problems_status_id_idx ON equipment_problems(status_id);

ALTER TABLE equipment_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON equipment_problems
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON equipment_problems
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  );

-- Equipment Spare Parts
CREATE TABLE equipment_spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status_id uuid REFERENCES equipment_status(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX equipment_spare_parts_status_id_idx ON equipment_spare_parts(status_id);

ALTER TABLE equipment_spare_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON equipment_spare_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON equipment_spare_parts
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor' OR
    auth.jwt() ->> 'role' = 'mechanic'
  );

-- Working Equipment
CREATE TABLE working_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  operator_id uuid REFERENCES personnel(id),
  start_time timestamptz NOT NULL,
  estimated_end_time timestamptz NOT NULL,
  location text NOT NULL,
  activity text NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX working_equipment_equipment_id_idx ON working_equipment(equipment_id);
CREATE INDEX working_equipment_operator_id_idx ON working_equipment(operator_id);

ALTER TABLE working_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON working_equipment
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON working_equipment
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor'
  );

-- Fuel Records
CREATE TABLE fuel_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  operator_id uuid REFERENCES personnel(id),
  supervisor_id uuid REFERENCES personnel(id),
  date timestamptz NOT NULL,
  odometer numeric NOT NULL,
  fuel_type text NOT NULL,
  liters numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX fuel_records_equipment_id_idx ON fuel_records(equipment_id);
CREATE INDEX fuel_records_operator_id_idx ON fuel_records(operator_id);
CREATE INDEX fuel_records_supervisor_id_idx ON fuel_records(supervisor_id);

ALTER TABLE fuel_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON fuel_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert/update access to authorized users"
  ON fuel_records
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'supervisor'
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON personnel
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_working_equipment_updated_at
  BEFORE UPDATE ON working_equipment
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();