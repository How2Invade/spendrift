# Email Verification Troubleshooting Guide

This guide helps resolve common issues with email verification in your Supabase + Next.js application.

## The "No API key found" Error

### Symptoms
- User receives email verification link
- Clicking the link shows: `{"message":"No API key found in request","hint":"No 'apikey' request header or url param was found."}`
- Browser redirects to an error page or callback page fails

### Root Causes
1. **Environment Variables Not Set**: Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Vercel Deployment Missing Env Vars**: Environment variables not configured in Vercel dashboard
3. **Incorrect Redirect URL**: Supabase email template using wrong callback URL
4. **PKCE Flow Issues**: Auth flow configuration problems

## Solutions

### 1. Check Environment Variables

**Local Development:**
```bash
# Check your .env.local file
cat .env.local

# Should contain:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Vercel Deployment:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Redeploy your application

### 2. Configure Supabase Email Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication → Email Templates**
3. Edit the **Confirm signup** template
4. Ensure the redirect URL is correct:

**For Local Development:**
```
{{ .SiteURL }}/auth/callback
```

**For Production:**
```
https://your-domain.vercel.app/auth/callback
```

### 3. Update Site URL in Supabase

1. In Supabase Dashboard, go to **Settings → General**
2. Update **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app`

### 4. Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication → URL Configuration**
2. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-domain.vercel.app/auth/callback` (production)

### 5. Check Email Template Variables

Ensure your email template includes the proper callback URL:

```html
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
```

The `{{ .ConfirmationURL }}` should automatically include the correct callback URL.

## Testing Steps

### Local Testing
1. Clear browser cache and cookies
2. Start your development server: `npm run dev`
3. Navigate to `/auth`
4. Sign up with a new email
5. Check your email and click the verification link
6. Should redirect to `/auth/callback` then to `/dashboard`

### Production Testing
1. Deploy to Vercel with environment variables
2. Test the same flow on your production domain
3. Check Vercel deployment logs if issues persist

## Debugging Tools

### 1. Check Console Logs
Open browser developer tools and check for:
- Environment variable warnings
- Supabase client errors
- Network request failures

### 2. Inspect Email Links
Before clicking the verification link, inspect it:
- Should contain `code=` parameter
- Should redirect to your correct domain
- Should include `/auth/callback` path

### 3. Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs your-project-name
```

## Common Fixes

### Fix 1: Environment Variables Missing in Vercel
```bash
# Check current deployment
vercel env ls

# Add missing variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy
vercel --prod
```

### Fix 2: Update Callback Page
Ensure your `/auth/callback/page.tsx` handles the code exchange:

```typescript
const code = searchParams.get('code');
if (code) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  // Handle result...
}
```

### Fix 3: PKCE Flow Configuration
Update your Supabase client config:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'  // Ensure PKCE is enabled
  }
});
```

## Still Having Issues?

1. **Check Supabase Dashboard Logs**: Go to Authentication → Logs
2. **Verify Email Provider**: Ensure your email provider (SMTP) is configured
3. **Test with Different Email**: Try with Gmail, Outlook, etc.
4. **Contact Support**: Include your project URL and exact error message

## Prevention

1. **Use Environment Validation**: Add checks in your app startup
2. **Test Both Environments**: Always test local and production separately  
3. **Monitor Logs**: Set up error monitoring (Sentry, LogRocket, etc.)
4. **Documentation**: Keep track of your environment variables and URLs

This should resolve most email verification issues. If you're still experiencing problems, check the specific error messages in your browser console and Supabase dashboard logs.
