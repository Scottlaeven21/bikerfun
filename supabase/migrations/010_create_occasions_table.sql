-- Create occasions table
CREATE TABLE IF NOT EXISTS occasions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  is_active BOOLEAN DEFAULT true,
  
  -- Technical Details
  mileage INTEGER NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  fuel VARCHAR(50) NOT NULL,
  power VARCHAR(50) NOT NULL,
  color VARCHAR(100),
  category VARCHAR(50),
  
  -- Detailed Specs (JSONB for flexibility)
  specs JSONB DEFAULT '{}'::jsonb,
  
  -- Condition & History
  condition VARCHAR(50),
  owners INTEGER,
  service_history VARCHAR(200),
  warranty VARCHAR(200),
  
  -- Features & Extras
  features TEXT[] DEFAULT '{}',
  extras TEXT[] DEFAULT '{}',
  
  -- Description
  description TEXT,
  
  -- Images (array of URLs)
  images TEXT[] DEFAULT '{}',
  main_image TEXT,
  
  -- SEO
  slug VARCHAR(300) UNIQUE NOT NULL,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Admin/User tracking
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_occasions_status ON occasions(status);
CREATE INDEX idx_occasions_is_active ON occasions(is_active);
CREATE INDEX idx_occasions_brand ON occasions(brand);
CREATE INDEX idx_occasions_category ON occasions(category);
CREATE INDEX idx_occasions_slug ON occasions(slug);
CREATE INDEX idx_occasions_created_at ON occasions(created_at DESC);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_occasions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER occasions_updated_at
  BEFORE UPDATE ON occasions
  FOR EACH ROW
  EXECUTE FUNCTION update_occasions_updated_at();

-- Enable Row Level Security
ALTER TABLE occasions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can view active occasions
CREATE POLICY "Public can view active occasions"
  ON occasions
  FOR SELECT
  USING (is_active = true AND status = 'available');

-- Admins can view all occasions
CREATE POLICY "Admins can view all occasions"
  ON occasions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can insert occasions
CREATE POLICY "Admins can insert occasions"
  ON occasions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can update occasions
CREATE POLICY "Admins can update occasions"
  ON occasions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can delete occasions
CREATE POLICY "Admins can delete occasions"
  ON occasions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
