# Gemini API Setup Guide

This guide will help you set up the Google Gemini API key for your Spendrift application to enable AI-powered features like expense parsing, financial guidance, and spending analysis.

## Prerequisites

- A Google account
- Access to Google AI Studio

## Step 1: Get Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account

2. **Create an API Key**
   - Click "Create API Key"
   - Choose "Create API key in new project" (recommended) or select an existing Google Cloud project
   - Your API key will be generated and displayed

3. **Copy Your API Key**
   - Copy the generated API key (it starts with `AIzaSy...`)
   - **Important**: Keep this key secure and never commit it to version control

## Step 2: Add the API Key to Your Environment

### Local Development

1. **Open your `.env.local` file** in the project root
2. **Replace the placeholder** with your actual API key:
   ```bash
   # Replace "your_gemini_api_key_here" with your actual API key
   GEMINI_API_KEY=AIzaSyYourActualAPIKeyHere
   ```

3. **Save the file**

### Vercel Deployment

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add a new environment variable:**
   - Name: `GEMINI_API_KEY`
   - Value: Your actual API key (starts with `AIzaSy...`)
   - Environment: Production, Preview, Development (select all)

5. **Redeploy your application** for the changes to take effect

## Step 3: Verify the Setup

### Local Testing

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test AI features** in your application:
   - Go to Add Expense → Try the chat parser
   - Go to Guidance → Try the financial guidance chat
   - Check if AI-powered features work without errors

### Production Testing

1. **Visit your deployed application**
2. **Test the same AI features** to ensure they work in production

## Environment Variable Details

- **Variable Name**: `GEMINI_API_KEY`
- **Required**: Yes (for AI features)
- **Format**: String starting with `AIzaSy...`
- **Scope**: Server-side only (not exposed to client)

## API Usage and Limits

- **Free Tier**: Google AI Studio provides a generous free tier
- **Rate Limits**: Check [Google AI pricing](https://ai.google.dev/pricing) for current limits
- **Monitoring**: Monitor usage in [Google AI Studio](https://aistudio.google.com/)

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all API keys
3. **Regularly rotate** your API keys
4. **Monitor usage** for unexpected spikes
5. **Restrict API key usage** to specific domains/IPs in production

## Troubleshooting

### Common Issues

1. **"No API key found" Error**
   - Ensure `GEMINI_API_KEY` is set in your environment
   - Restart your development server after adding the key
   - Check for typos in the variable name

2. **"Invalid API key" Error**
   - Verify the API key is copied correctly
   - Ensure the key is active in Google AI Studio
   - Check if the key has the necessary permissions

3. **Rate Limit Errors**
   - Check your usage in Google AI Studio
   - Consider upgrading to a paid plan if needed
   - Implement request throttling in your application

4. **Environment Not Loading**
   - Ensure `.env.local` is in the project root
   - Restart your development server
   - Check that the file is not `.env.local.txt` or similar

### Debug Steps

1. **Check environment loading**:
   ```bash
   # In your terminal, run:
   echo $GEMINI_API_KEY
   ```

2. **Test API connectivity**:
   - Use the debug tools in your application
   - Check browser developer console for errors
   - Monitor network requests to Gemini API

## AI Features in Spendrift

Once configured, the following features will be available:

- **Expense Chat Parser**: Natural language expense entry
- **Financial Guidance Chat**: AI-powered financial advice
- **Spending Pattern Analysis**: Intelligent spending insights
- **Bank Statement Parsing**: Automated transaction extraction
- **Financial Forecasting**: Predictive financial modeling

## Support

If you encounter issues:

1. Check the [Google AI documentation](https://ai.google.dev/docs)
2. Review your API usage in [Google AI Studio](https://aistudio.google.com/)
3. Ensure your API key has the necessary permissions
4. Verify your environment variables are set correctly

## Next Steps

After setting up your Gemini API key:

1. Test all AI features thoroughly
2. Monitor API usage and costs
3. Consider implementing caching for frequently used prompts
4. Explore advanced Gemini features like context caching
5. Set up monitoring and alerting for API errors

---

**Note**: The Gemini API is powerful but comes with usage costs. Monitor your usage regularly and implement appropriate safeguards to prevent unexpected charges.
