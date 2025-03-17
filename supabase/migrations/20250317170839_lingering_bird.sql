/*
  # Fix Personnel RLS Policies

  1. Changes
    - Update personnel table RLS policies to allow self-registration
    - Add policy for users to manage their own records
    - Keep admin access policy

  2. Security
    - Maintain security while allowing necessary operations
    - Ensure users can only access their own data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to all users" ON personnel;
DROP POLICY IF EXISTS "Allow insert/update access to admin users" ON personnel;

-- Add new policies
CREATE POLICY "Allow users to read their own data and admins to read all"
  ON personnel
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow users to insert their own record"
  ON personnel
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow users to update their own record and admins to update all"
  ON personnel
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.uid() = id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow admins to delete records"
  ON personnel
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');