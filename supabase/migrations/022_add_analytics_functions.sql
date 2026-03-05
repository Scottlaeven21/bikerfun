-- Create function to get daily analytics aggregated by date
CREATE OR REPLACE FUNCTION get_daily_analytics(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  date text,
  total_views bigint,
  unique_visitors bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS date,
    COUNT(*)::bigint AS total_views,
    COUNT(DISTINCT ip_address)::bigint AS unique_visitors
  FROM page_views
  WHERE created_at >= start_date AND created_at <= end_date
  GROUP BY date_trunc('day', created_at)
  ORDER BY date_trunc('day', created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_daily_analytics(timestamptz, timestamptz) TO authenticated, service_role;
