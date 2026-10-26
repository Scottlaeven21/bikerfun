-- Exacte totalen: de REST API stopt na 1000 rijen, COUNT niet.

CREATE OR REPLACE FUNCTION get_analytics_totals(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  total_views bigint,
  unique_visitors bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint AS total_views,
    COUNT(DISTINCT ip_address)::bigint AS unique_visitors
  FROM page_views
  WHERE created_at >= start_date AND created_at <= end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_analytics_totals(timestamptz, timestamptz) TO authenticated, service_role;
