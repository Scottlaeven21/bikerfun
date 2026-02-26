# 🚨 URGENT: Fix Product Images - DNS Issue

## ⚠️ **ROOT CAUSE GEVONDEN!**

**Problem:** All 284 product images are broken (403 Forbidden errors)  
**Real Cause:** `admin.bikerfun.nl` DNS wijst naar Vercel, maar WordPress staat op Strato!  
**Solution:** Wijzig Vercel DNS A-record naar Strato server IP

**→ Zie: `VERCEL_DNS_FIX.md` voor complete stap-voor-stap handleiding**  
**→ Zie: `STRATO_CONTACT_SCRIPT.md` voor Strato support bel-script**

---

# 🚨 URGENT: Fix Product Images - Quick Start Guide (Originele Analyse)

---

## 🎯 Quick Fix (5 minutes)

### Step 1: Verify WordPress is Accessible

Open your browser and test these URLs:

1. **WordPress Admin:**
   ```
   https://admin.bikerfun.nl/wp-admin
   ```
   ✅ Should show WordPress login page

2. **Sample Image:**
   ```
   https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg
   ```
   ✅ Should show the bunny helmet cover image

**If both work:** → Continue to Step 2  
**If they don't work:** → See "WordPress Not Accessible" section below

---

### Step 2: Run the Fix Script

Open PowerShell/Terminal in your project folder and run:

```bash
npm run update:image-urls
```

**What this does:**
- Tests if images are accessible at admin.bikerfun.nl
- Updates all 284 image URLs in the database
- Changes: `bikerfun.nl` → `admin.bikerfun.nl`
- Takes ~30 seconds

**Expected output:**
```
✅ Images are accessible at admin.bikerfun.nl
✅ Found 124 products
✅ Updated 124 products
✅ Image URL update completed!
```

---

### Step 3: Test the Website

1. Open: https://bikerfun.nl
2. Press `Ctrl+Shift+R` (hard refresh to clear cache)
3. Check if product images are loading
4. Open browser console (F12) - should see NO red errors

**✅ Done!** Images should now be loading.

---

## ❌ WordPress Not Accessible?

If `admin.bikerfun.nl` is not working, you need to:

### Option A: Check Strato Configuration

1. Login to Strato: https://www.strato.nl
2. Go to: Domains → bikerfun.nl
3. Check subdomain: `admin.bikerfun.nl`
4. Verify it points to your WordPress hosting

### Option B: Check WordPress Configuration

1. Login to Strato File Manager or FTP
2. Navigate to: `admin.bikerfun.nl/public_html/`
3. Edit: `wp-config.php`
4. Add these lines before `/* That's all, stop editing! */`:

```php
define('WP_HOME', 'https://admin.bikerfun.nl');
define('WP_SITEURL', 'https://admin.bikerfun.nl');
```

5. Save and test again

### Option C: Contact Strato Support

If still not working:
- Call Strato support: Check their website for phone number
- Ask them to verify:
  1. Subdomain `admin.bikerfun.nl` is configured
  2. WordPress is installed and accessible
  3. DNS A record is correct

---

## 🔍 Diagnostic Tools

### Check Image Status
```bash
npm run check:images
```

Shows:
- How many images are in database
- Which domains they're using
- If they're accessible
- Sample URLs

### Manual URL Test (PowerShell)
```powershell
Invoke-WebRequest -Uri "https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg" -Method Head
```

Should return: `StatusCode: 200`

### Manual URL Test (Browser)
1. Open browser
2. Go to: `https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg`
3. Should see the image (not 403 error)

---

## 📊 What's Happening?

### Current State (BROKEN)
```
Database: https://bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg
                    ↓ (DNS points to Vercel - new site)
          bikerfun.nl → Next.js app (no /wp-content/ directory)
                    ↓
                  403 Forbidden ❌
```

### After Fix (WORKING)
```
Database: https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg
                    ↓ (DNS points to Strato - WordPress)
     admin.bikerfun.nl → WordPress site (/wp-content/ exists)
                    ↓
                  200 OK ✅
```

---

## 🎯 Alternative: Migrate to Supabase (Long-term)

**Why?**
- No dependency on WordPress
- Faster (CDN)
- Better control
- Single source of truth

**How?**
1. Create Supabase Storage bucket
2. Download all images from WordPress
3. Upload to Supabase
4. Update database URLs

**Time:** 1-2 hours  
**Guide:** See `IMAGE_LOADING_DIAGNOSTIC_REPORT.md` → Solution 2

---

## 📋 Checklist

Before running fix:
- [ ] Can access `https://admin.bikerfun.nl/wp-admin`
- [ ] Can see image at `https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg`
- [ ] Have `.env.local` file with Supabase credentials

After running fix:
- [ ] Script completed successfully (no errors)
- [ ] Tested bikerfun.nl in browser (hard refresh)
- [ ] Product images are loading
- [ ] No console errors (F12)

---

## 🆘 Still Having Issues?

### Check Console Errors
1. Open bikerfun.nl
2. Press F12 → Console tab
3. Look for red errors
4. Take screenshot
5. Share in support chat

### Check Network Tab
1. Open bikerfun.nl
2. Press F12 → Network tab
3. Filter: "Img"
4. Refresh page
5. Check which images are failing (red)
6. Click on failed image → see status code

### Common Issues

**403 Forbidden:**
- WordPress not accessible
- Hotlink protection enabled
- Wrong domain in URLs

**404 Not Found:**
- Images don't exist at that location
- WordPress not installed
- Wrong path

**CORS Error:**
- Need to add CORS headers in WordPress
- Add to `.htaccess`:
  ```apache
  Header set Access-Control-Allow-Origin "*"
  ```

---

## 📞 Support

**Created by:** Image diagnostic script  
**Date:** February 26, 2026

**Files created:**
- ✅ `scripts/check-image-urls.ts` - Diagnostic tool
- ✅ `scripts/update-image-urls.ts` - Fix script
- ✅ `IMAGE_LOADING_DIAGNOSTIC_REPORT.md` - Full analysis
- ✅ `FIX_IMAGES_NOW.md` - This guide

**Commands:**
```bash
npm run check:images        # Diagnose issues
npm run update:image-urls   # Fix URLs
```

---

**🚀 Ready? Run:** `npm run update:image-urls`
