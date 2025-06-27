# Complete Supabase Email Templates Configuration

This guide provides all the email templates and configurations needed for your Supabase authentication system.

## 1. Supabase Dashboard Configuration

### Step 1: Access Email Templates
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `zjcienfgkttllvoiiieu`
3. Navigate to **Authentication → Email Templates**

### Step 2: Configure Site URL
1. Go to **Settings → General**
2. Set **Site URL**:
   - **Local Development**: `http://localhost:3000`
   - **Production**: `https://your-vercel-domain.vercel.app`

### Step 3: Configure Redirect URLs
1. Go to **Authentication → URL Configuration**
2. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`

## 2. Email Templates

### Confirm Signup Template

**Subject**: `Confirm your signup for SpenDrift`

**HTML Body**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - SpenDrift</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0a0a;
            color: #78c775;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1a1a1a;
            border: 2px solid #78c775;
            border-radius: 8px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #78c775;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #78c775;
            text-shadow: 0 0 10px #78c775;
        }
        .subtitle {
            font-size: 14px;
            color: #888;
            margin-top: 5px;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #78c775;
            color: #0a0a0a;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
        }
        .button:hover {
            background-color: #a8e6a5;
            box-shadow: 0 0 15px #78c775;
        }
        .footer {
            border-top: 1px solid #78c775;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .code {
            background-color: #2a2a2a;
            border: 1px solid #78c775;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            color: #78c775;
            margin: 10px 0;
        }
        .highlight {
            color: #78c775;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SpenDrift</div>
            <div class="subtitle">Your AI-Powered Gen-Z Finance Buddy</div>
        </div>
        
        <div class="content">
            <h2>Welcome to the Future of Finance! 🚀</h2>
            
            <p>Hey there! Thanks for joining <span class="highlight">SpenDrift</span> - your new AI-powered finance companion that actually gets Gen-Z money vibes.</p>
            
            <p>To complete your account setup and start tracking your spending with style, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Confirm Your Account ✨
                </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">{{ .ConfirmationURL }}</div>
            
            <p><strong>What's next?</strong></p>
            <ul>
                <li>Set up your financial goals 🎯</li>
                <li>Connect your spending habits 💳</li>
                <li>Get AI-powered insights 🤖</li>
                <li>Earn points for good money decisions 🏆</li>
            </ul>
            
            <p>Ready to make your money work as hard as you do? Let's get started!</p>
        </div>
        
        <div class="footer">
            <p>This confirmation link will expire in 24 hours.</p>
            <p>If you didn't create an account with SpenDrift, you can safely ignore this email.</p>
            <p>© 2025 SpenDrift - Made with 💚 for the next generation</p>
        </div>
    </div>
</body>
</html>
```

### Magic Link Template

**Subject**: `Your SpenDrift Magic Link`

**HTML Body**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magic Link - SpenDrift</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0a0a;
            color: #78c775;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1a1a1a;
            border: 2px solid #78c775;
            border-radius: 8px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #78c775;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #78c775;
            text-shadow: 0 0 10px #78c775;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #78c775;
            color: #0a0a0a;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            border-top: 1px solid #78c775;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .code {
            background-color: #2a2a2a;
            border: 1px solid #78c775;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            color: #78c775;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SpenDrift</div>
        </div>
        
        <div class="content">
            <h2>Your Magic Link is Here! ✨</h2>
            
            <p>Click the button below to securely sign in to your SpenDrift account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Sign In to SpenDrift 🚀
                </a>
            </div>
            
            <p>Or copy and paste this link:</p>
            <div class="code">{{ .ConfirmationURL }}</div>
        </div>
        
        <div class="footer">
            <p>This magic link will expire in 1 hour for security.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>
```

### Password Recovery Template

**Subject**: `Reset your SpenDrift password`

**HTML Body**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - SpenDrift</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0a0a;
            color: #78c775;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1a1a1a;
            border: 2px solid #78c775;
            border-radius: 8px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #78c775;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #78c775;
            text-shadow: 0 0 10px #78c775;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #78c775;
            color: #0a0a0a;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            border-top: 1px solid #78c775;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .code {
            background-color: #2a2a2a;
            border: 1px solid #78c775;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            color: #78c775;
            margin: 10px 0;
        }
        .warning {
            background-color: #2a1a1a;
            border: 1px solid #ff6b6b;
            padding: 15px;
            border-radius: 4px;
            color: #ff6b6b;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SpenDrift</div>
        </div>
        
        <div class="content">
            <h2>Password Reset Request 🔐</h2>
            
            <p>We received a request to reset your SpenDrift account password.</p>
            
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Reset Your Password 🔑
                </a>
            </div>
            
            <p>Or copy and paste this link:</p>
            <div class="code">{{ .ConfirmationURL }}</div>
            
            <div class="warning">
                <strong>Security Notice:</strong><br>
                • This link will expire in 1 hour<br>
                • If you didn't request this reset, please ignore this email<br>
                • Your current password will remain active until you set a new one
            </div>
        </div>
        
        <div class="footer">
            <p>For security, this reset link is single-use and will expire soon.</p>
            <p>© 2025 SpenDrift - Keeping your finances secure</p>
        </div>
    </div>
</body>
</html>
```

### Change Email Template

**Subject**: `Confirm your new email for SpenDrift`

**HTML Body**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Email Change - SpenDrift</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0a0a;
            color: #78c775;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1a1a1a;
            border: 2px solid #78c775;
            border-radius: 8px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #78c775;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #78c775;
            text-shadow: 0 0 10px #78c775;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #78c775;
            color: #0a0a0a;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            border-top: 1px solid #78c775;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .code {
            background-color: #2a2a2a;
            border: 1px solid #78c775;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            color: #78c775;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SpenDrift</div>
        </div>
        
        <div class="content">
            <h2>Confirm Your New Email 📧</h2>
            
            <p>You've requested to change your SpenDrift account email address.</p>
            
            <p>Click the button below to confirm your new email:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Confirm New Email ✅
                </a>
            </div>
            
            <p>Or copy and paste this link:</p>
            <div class="code">{{ .ConfirmationURL }}</div>
        </div>
        
        <div class="footer">
            <p>This confirmation link will expire in 24 hours.</p>
            <p>If you didn't request this change, please contact support.</p>
        </div>
    </div>
</body>
</html>
```

## 3. Configuration Steps

### In Supabase Dashboard:

1. **Go to Authentication → Email Templates**
2. **For each template above:**
   - Click on the template type (Confirm signup, Magic Link, etc.)
   - Replace the default content with the HTML provided above
   - Make sure the subject line matches
   - Click "Save"

3. **Critical Variables to Include:**
   - `{{ .ConfirmationURL }}` - This is automatically generated by Supabase
   - `{{ .SiteURL }}` - Your configured site URL
   - `{{ .Email }}` - User's email (if needed)

## 4. Testing the Templates

### Local Testing:
```bash
# Start your development server
npm run dev

# Test signup flow
# 1. Go to http://localhost:3000/auth
# 2. Sign up with a new email
# 3. Check your email for the confirmation
# 4. Click the link - should redirect to /auth/callback then /dashboard
```

### Production Testing:
1. Deploy to Vercel with environment variables set
2. Test the same flow on your live domain
3. Verify all links work correctly

## 5. Environment Variables Reminder

Make sure these are set in both local (.env.local) and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zjcienfgkttllvoiiieu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 6. Troubleshooting

If emails aren't working:

1. **Check SMTP Settings** in Supabase Dashboard → Settings → General
2. **Verify Site URL** matches your deployed domain
3. **Check Redirect URLs** include `/auth/callback`
4. **Test with different email providers** (Gmail, Outlook, etc.)

The templates above are styled to match your Gen-Z/retro theme with:
- Dark background (#0a0a0a)
- Green accent color (#78c775)
- Monospace font for retro feel
- Modern button styling
- Mobile-responsive design

Copy and paste each template exactly as shown into your Supabase dashboard, and your email verification should work perfectly!
