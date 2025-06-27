# Supabase Setup Guide for SpenDrift

## 1. Create a Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: SpenDrift
   - **Database Password**: Choose a secure password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. **Enable Email provider** (enabled by default)
3. **Enable Google provider** and add your Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com)
   - **Client Secret**: Get from Google Cloud Console
   - **Redirect URL**: Copy the one provided by Supabase

### Email Authentication Setup:

Email authentication is enabled by default in Supabase. You can configure:
1. **Confirm email**: Whether users need to confirm their email (recommended)
2. **Secure email change**: Require email confirmation when changing email
3. **Double confirm email change**: Extra security for email changes

### Setting up Google OAuth in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google Identity API** (formerly Google+ API)
4. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Give it a name (e.g., "SpenDrift OAuth")
7. **IMPORTANT**: Add **Authorized JavaScript origins** (NO paths, NO trailing slashes):
   - `https://your-project-ref.supabase.co`
   - `http://localhost:9002`
8. **IMPORTANT**: Add **Authorized redirect URIs** (get the exact URL from Supabase):
   - Go to your Supabase dashboard → **Authentication** → **Providers** → **Google**
   - Copy the **Redirect URL** (e.g., `https://abcdefghijk.supabase.co/auth/v1/callback`)
   - Add this EXACT URL to Google Cloud Console
   - **For local development**: `http://localhost:9002` (NOT `/auth/callback`)
   - **IMPORTANT**: Remove any other incorrect redirect URIs from the list
9. Copy the **Client ID** and **Client Secret**
10. **Configure OAuth Consent Screen** if prompted (set to Internal for testing)

## 3. Set up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Run the SQL script to create tables and security policies

## 4. Configure Environment Variables

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Configure Site URL

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to:
   - Production: `https://yourdomain.com`
   - Development: `http://localhost:9002`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/dashboard`
   - `http://localhost:9002/dashboard`

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:9002`
3. Click "Get Started" or "Sign In"
4. Test both authentication methods:
   - **Email/Password**: Sign up with email, check confirmation email, sign in
   - **Google OAuth**: Test Google OAuth flow
5. Verify user profile is created in Supabase dashboard
6. Test sign out and sign in again

## 7. Database Schema

The setup creates a `user_profiles` table with:

- `id` (UUID, references auth.users)
- `email` (TEXT)
- `display_name` (TEXT)
- `photo_url` (TEXT, optional)
- `points` (INTEGER, default 100)
- `created_at` (TIMESTAMP)
- `provider` (TEXT, default 'google')

## 8. Security Features

- Row Level Security (RLS) enabled
- Users can only access their own data
- Automatic profile creation on signup
- Secure authentication flow

## Troubleshooting

**Issue**: "Check your email!" message after signup
- **Expected Behavior**: This is normal - users need to confirm their email address
- **Solution**: 
  1. Check the user's email inbox (including spam folder)
  2. Click the confirmation link in the email
  3. User will be redirected to your app and automatically signed in

**Issue**: Email confirmation not working in development
- **Solution**: 
  1. In Supabase dashboard: **Authentication** → **URL Configuration**
  2. Make sure **Site URL** is set to `http://localhost:9002`
  3. The confirmation link will redirect to your local development server

**Issue**: "Invalid Origin: URIs must not contain a path or end with '/'"
- **Root Cause**: The JavaScript origins in Google Cloud Console have incorrect formatting
- **Solution**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
  2. Click on your OAuth 2.0 Client ID
  3. In **Authorized JavaScript origins**, make sure you have:
     - `https://your-project-ref.supabase.co` (NO trailing slash, NO path)
     - `http://localhost:9002` (NO trailing slash, NO path)
  4. **Do NOT include**: `/auth`, `/callback`, or any path
  5. Save the changes

**Issue**: "Error 400: redirect_uri_mismatch" 
- **Root Cause**: The redirect URI in Google Cloud Console doesn't match what Supabase is sending
- **Solution**: 
  1. Go to your Supabase dashboard → **Authentication** → **Providers** → **Google**
  2. Copy the exact **Redirect URL** shown there (it should look like: `https://[project-ref].supabase.co/auth/v1/callback`)
  3. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
  4. Click on your OAuth 2.0 Client ID
  5. In **Authorized redirect URIs**, add the EXACT URL from Supabase
  6. Also add: `http://localhost:9002/auth/callback` for local development
  7. Save the changes and wait 5-10 minutes for Google to update

**Issue**: "Invalid redirect URL"
- **Solution**: Make sure redirect URLs are added in both Google Cloud Console and Supabase

**Issue**: "User not created in database"
- **Solution**: Check if the trigger function was created properly in SQL editor

**Issue**: "Environment variables not found"
- **Solution**: Make sure `.env.local` is in project root and restart dev server

**Issue**: Still getting OAuth errors after fixing redirect URIs
- **Solution**: 
  1. Clear your browser cache and cookies
  2. Try in an incognito/private window
  3. Make sure you've enabled the Google Identity API in Google Cloud Console
  4. Verify your Google Cloud project has the correct OAuth consent screen configured
