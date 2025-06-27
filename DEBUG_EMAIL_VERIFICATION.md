# Email Verification Loading Issue - Debug Guide

## Quick Debugging Steps

### 1. **Test the Debug Page**
I've created a special test page to help debug the issue:

```
http://localhost:3000/auth/callback/test
```

Or for your deployed app:
```
https://your-app.vercel.app/auth/callback/test
```

**How to use it:**
1. Sign up with a new email
2. When you get the verification email, copy the link
3. Replace `/auth/callback` with `/auth/callback/test` in the URL
4. Open this modified URL in your browser
5. You'll see detailed logs of what's happening

### 2. **Check Browser Console**
Open Developer Tools (F12) and check the Console tab for any errors:
- Red errors indicate problems
- Look for Supabase-related errors
- Check for network failures

### 3. **Verify Environment Variables**
The enhanced callback page now logs configuration status. Check if you see:
- `hasUrl: true`
- `hasKey: true`

If either is `false`, your environment variables aren't set correctly.

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set in Vercel

**Symptoms:**
- Page loads but never redirects
- Console shows "Missing Supabase configuration"

**Solution:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://zjcienfgkttllvoiiieu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
5. Redeploy the project

### Issue 2: Wrong Redirect URL in Supabase

**Symptoms:**
- Email verification link doesn't work
- "No API key found" error

**Solution:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: `zjcienfgkttllvoiiieu`
3. Authentication → URL Configuration
4. Add redirect URL: `https://your-app.vercel.app/auth/callback`
5. Settings → General → Set Site URL: `https://your-app.vercel.app`

### Issue 3: Email Template Issues

**Symptoms:**
- Email arrives but link is malformed
- Link redirects to wrong domain

**Solution:**
1. In Supabase Dashboard → Authentication → Email Templates
2. Edit "Confirm signup" template
3. Ensure it uses: `{{ .ConfirmationURL }}`
4. Make sure Site URL is set correctly

### Issue 4: Code Exchange Timing Issues

**Symptoms:**
- Page gets stuck on "Processing..." or "Verifying email..."

**Solution - Enhanced Callback:**
The new callback page includes:
- Better error handling
- Retry mechanism (up to 3 times)
- Support for both PKCE and legacy flows
- Detailed logging
- Timeout handling

## Testing Checklist

### Local Testing:
```bash
# 1. Start dev server
npm run dev

# 2. Test signup
# Go to: http://localhost:3000/auth
# Sign up with new email

# 3. Check email and click verification link
# Should redirect to: http://localhost:3000/auth/callback
# Then to: http://localhost:3000/dashboard?verified=true
```

### Production Testing:
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Test on live domain
# Go to: https://your-app.vercel.app/auth
# Complete signup flow

# 3. If stuck, try debug page:
# Replace /auth/callback with /auth/callback/test in email link
```

## Advanced Debugging

### Check Network Tab:
1. Open Developer Tools → Network tab
2. Click verification link
3. Look for failed requests (red entries)
4. Check if any requests to `supabase.co` are failing

### Check Supabase Dashboard Logs:
1. Go to Supabase Dashboard
2. Navigate to: Logs → Authentication
3. Look for recent entries around the time you tested
4. Check for any error messages

### Test Direct Session:
Open browser console and run:
```javascript
// Check current session
supabase.auth.getSession().then(console.log);

// Check auth state
supabase.auth.getUser().then(console.log);
```

## Manual Fix Options

### Option 1: Use Magic Link Instead
If email verification is problematic, you can temporarily switch to magic link:

1. In your auth page, add magic link option
2. Users get email with direct login link
3. No separate verification step needed

### Option 2: Skip Email Verification (Development Only)
In Supabase Dashboard:
1. Authentication → Settings
2. Disable "Enable email confirmations"
3. Users can sign in immediately after signup

**⚠️ Only use this for testing - re-enable for production!**

## Get Help

If you're still stuck, share:
1. The output from `/auth/callback/test` page
2. Any console errors
3. Your Vercel domain name
4. Whether it works locally but not in production

The enhanced callback page should resolve most timing and configuration issues. Try the debug page first to see exactly what's happening!
