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

## 2. Configure Google OAuth

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com)
   - **Client Secret**: Get from Google Cloud Console
   - **Redirect URL**: Copy the one provided by Supabase

### Setting up Google OAuth in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Add **Authorized redirect URIs**:
   - `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
   - `http://localhost:9002/auth/callback` (for local development)
7. Copy the **Client ID** and **Client Secret**

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
4. Test Google OAuth flow
5. Verify user profile is created in Supabase dashboard

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

**Issue**: "Invalid redirect URL"
- **Solution**: Make sure redirect URLs are added in both Google Cloud Console and Supabase

**Issue**: "User not created in database"
- **Solution**: Check if the trigger function was created properly in SQL editor

**Issue**: "Environment variables not found"
- **Solution**: Make sure `.env.local` is in project root and restart dev server
