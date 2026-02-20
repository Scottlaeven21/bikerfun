-- Analytics tracking tables for Bikerfun dashboard

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);

-- Events Table (for custom tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL, -- 'occasion_view', 'contact_form_submit', etc.
  event_data JSONB, -- Additional event data
  page_path TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);

-- Occasion Views (specific tracking)
CREATE TABLE IF NOT EXISTS occasion_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occasion_id TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_occasion FOREIGN KEY (occasion_id) REFERENCES occasions(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_occasion_views_occasion_id ON occasion_views(occasion_id);
CREATE INDEX IF NOT EXISTS idx_occasion_views_created_at ON occasion_views(created_at DESC);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE occasion_views ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for tracking)
CREATE POLICY "Allow public page view tracking" ON page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public event tracking" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public occasion view tracking" ON occasion_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads on page_views" ON page_views
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads on analytics_events" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads on occasion_views" ON occasion_views
  FOR SELECT TO authenticated
  USING (true);

-- Create view for analytics summary (easier querying)
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  date_trunc('day', created_at) AS date,
  COUNT(*) AS total_views,
  COUNT(DISTINCT ip_address) AS unique_visitors
FROM page_views
GROUP BY date_trunc('day', created_at)
ORDER BY date DESC;

-- Grant access to view
GRANT SELECT ON analytics_summary TO authenticated, anon;
