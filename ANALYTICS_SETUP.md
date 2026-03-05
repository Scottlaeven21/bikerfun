# Analytics Setup - Bikerfun

## 📊 Status: Bijna Klaar!

De analytics tracking code is al geïmplementeerd en actief op de website. Je hoeft alleen nog de database migratie uit te voeren.

## ✅ Wat er al werkt:

1. **Tracking is actief** - Elk bezoek wordt automatisch getrackt
2. **IP adressen worden opgeslagen** - Voor unieke bezoeker telling
3. **Device type detectie** - Mobiel, desktop, tablet
4. **Referrer tracking** - Van waar bezoekers komen
5. **Occasion views** - Welke occasions het meest bekeken worden

## 🔧 Wat je moet doen:

### Stap 1: Voer Database Migratie Uit

Ga naar **Supabase Dashboard** → **SQL Editor** en voer deze SQL uit:

```sql
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
```

### Stap 2: Verifieer dat Analytics Werkt

1. **Bezoek de website** (bijv. homepage, occasions, webshop)
2. **Check de data** via: `https://bikerfun.nl/api/analytics/test`
3. **Ga naar admin dashboard** → `/admin/statistics`

Je zou nu data moeten zien verschijnen!

## 📈 Wat je ziet in /admin/statistics:

### Grafieken:
- **Line Chart** - Totaal views vs unieke bezoekers over tijd
- **Pie Chart** - Apparaat breakdown (mobiel, desktop, tablet)
- **Bar Chart** - Meest uitgevoerde events

### Tabellen:
- **Populairste Pagina's** - Met views, unieke bezoekers, en ratio
- **Traffic Bronnen** - Direct traffic, Google, andere referrers
- **Dagelijkse Breakdown** - Per dag met Nederlandse datums

### Filters:
- Quick presets: Laatste 7/30/90 dagen, Deze week
- Custom datum range: Kies specifieke periode

## 🔍 Troubleshooting

### Als je nog steeds 0 unieke bezoekers ziet:

1. **Verifieer dat tracking werkt:**
   ```sql
   SELECT COUNT(*), COUNT(DISTINCT ip_address) 
   FROM page_views 
   WHERE created_at > NOW() - INTERVAL '7 days';
   ```

2. **Check IP adressen:**
   ```sql
   SELECT ip_address, COUNT(*) 
   FROM page_views 
   GROUP BY ip_address 
   ORDER BY COUNT(*) DESC 
   LIMIT 10;
   ```

3. **Als IP adressen NULL zijn**, check Vercel deployment settings voor `X-Forwarded-For` header

## 📝 Database Schema

De analytics gebruiken deze tabellen (al aangemaakt):
- `page_views` - Alle pagina views met IP, device, referrer
- `analytics_events` - Custom events (contact forms, etc)
- `occasion_views` - Specifieke occasion views
- `get_daily_analytics()` - SQL functie voor aggregatie (nog uit te voeren)

## ✨ Ready to Use!

Na het uitvoeren van de migratie is alles klaar. De statistieken worden automatisch bijgewerkt bij elk bezoek!
