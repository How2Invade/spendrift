# 💸 Spendrift — The Gen Z Wallet Vibe Coach

<div align="center">

![Spendrift Logo](./public/logo.png)

**Your wallet's vibe coach — not just a finance tracker.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://spendrift.vercel.app) • [Documentation](./docs) • [Report Bug](https://github.com/your-username/spendrift/issues)

</div>

---

## ✨ What is Spendrift?

**Spendrift** is a next-generation, AI-powered personal finance platform designed specifically for Gen Z and Millennials. It transforms traditional expense tracking into an engaging, gamified experience that makes financial responsibility actually enjoyable.

Unlike boring spreadsheets or complex finance apps, Spendrift speaks your language, understands your lifestyle, and helps you build healthy money habits through:

- 🤖 **AI-powered insights** that actually make sense
- 🎮 **Gamified goals** that keep you motivated  
- 💬 **Natural language input** - just talk to it normally
- 📊 **Beautiful analytics** that don't require a finance degree
- 🏆 **Reward system** with real benefits

---

## 🚀 Features

### 💬 **AI-Powered Expense Management**
- **Natural Language Input**: "Spent 500 on coffee with friends" → Automatically categorized
- **Bank Statement Analysis**: Upload CSV/PDF statements for instant parsing
- **Smart Categorization**: AI identifies patterns and suggests better spending habits
- **Emotional Spending Tracking**: Links expenses to moods and triggers

### 🎯 **Gamified Goal System**
- **AI Goal Suggestions**: Personalized challenges based on your spending patterns
- **Zen Points Rewards**: Earn points for completing goals and maintaining streaks
- **Visual Progress Tracking**: Beautiful progress bars and achievement celebrations
- **Streak Bonuses**: Extra rewards for consistency

### 📊 **Intelligent Analytics**
- **Spending Insights**: Understand where your money really goes
- **Trend Analysis**: Spot patterns before they become problems
- **Predictive Alerts**: Get warned about potential overspending
- **Monthly Reports**: Automated insights delivered to your inbox

### 🎨 **Gen Z-Focused Design**
- **Retro-Dark Aesthetic**: Modern dark mode with neon green accents
- **Glassmorphism UI**: Smooth, translucent cards with backdrop blur
- **Emoji-Enhanced UX**: Expressive interface that's actually fun to use
- **Mobile-First**: Optimized for the way you actually use your phone

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Supabase (PostgreSQL), Row Level Security |
| **Authentication** | Supabase Auth (Google OAuth + Email/Password) |
| **AI/ML** | Google Gemini API, Natural Language Processing |
| **Real-time** | Supabase Realtime subscriptions |
| **Deployment** | Vercel (Frontend), Supabase (Backend) |
| **Styling** | Tailwind CSS, Radix UI Components |
| **Forms** | React Hook Form, Zod validation |

---

## 📱 Screenshots

<div align="center">
  <img src="./public/screenshots/landing.png" alt="Landing Page" width="30%" />
  <img src="./public/screenshots/dashboard.png" alt="Dashboard" width="30%" />
  <img src="./public/screenshots/goals.png" alt="Goals Page" width="30%" />
</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Google Cloud Console project (for OAuth)
- A Google AI Studio account (for Gemini API)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spendrift.git
cd spendrift
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor
3. Configure authentication providers in the Supabase dashboard

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running!

---

## 📚 Detailed Setup Guides

- 📘 [**Supabase Setup Guide**](./SUPABASE_SETUP.md) - Complete database and auth configuration
- 🤖 [**Gemini API Setup**](./GEMINI_API_SETUP.md) - AI features configuration
- 📧 [**Email Authentication**](./EMAIL_AUTH_ADDED.md) - Email/password auth setup
- ⚡ [**Performance Optimizations**](./LOADING_OPTIMIZATIONS.md) - Speed improvements applied

---

## 🏗 Project Structure

```
spendrift/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── goals/            # Goals management
│   │   ├── analytics/        # Spending analytics
│   │   └── api/              # API routes
│   ├── components/           # Reusable components
│   │   ├── ui/              # Base UI components
│   │   ├── goals/           # Goal-specific components
│   │   └── landing-page/    # Landing page sections
│   ├── context/             # React Context providers
│   │   ├── auth-context.tsx # Authentication state
│   │   └── data-context.tsx # App data management
│   ├── lib/                 # Utilities and configurations
│   │   ├── supabase.ts     # Supabase client
│   │   └── types.ts        # TypeScript definitions
│   └── ai/                  # AI integration
│       └── flows/          # AI workflow definitions
├── public/                  # Static assets
├── docs/                   # Documentation
└── supabase-setup.sql     # Database schema
```

---

## 🎮 How to Use

### 1. **Sign Up & Get Started**
- Choose Google OAuth or email/password signup
- Your profile is automatically created with 100 starter Zen Points

### 2. **Set Your First Goal**
- Visit the Goals page
- Accept an AI-suggested goal or create your own
- Watch your progress and earn points for completion

### 3. **Track Expenses**
- Use the natural language chat: "Bought lunch for ₹200"
- Upload bank statements for automatic parsing
- Review categorized expenses in Analytics

### 4. **Earn Rewards**
- Complete goals to earn Zen Points
- Maintain streaks for bonus points
- Redeem points for real-world rewards

### 5. **Get AI Insights**
- Visit the Guidance page for personalized advice
- Receive predictive alerts about spending patterns
- Get monthly email reports with insights

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation when needed
- Make sure the build passes: `npm run build`

---

## 📋 Roadmap

### 🔄 **Current Phase**
- [x] Core expense tracking
- [x] AI-powered goal suggestions
- [x] Gamification system
- [x] Real-time data sync
- [x] Custom toast notifications

### 🚀 **Next Phase (Q2 2025)**
- [ ] Bank account linking (Open Banking API)
- [ ] Advanced AI insights dashboard
- [ ] Social features (friend challenges)
- [ ] Investment tracking
- [ ] Subscription management

### 🌟 **Future Phase (Q3-Q4 2025)**
- [ ] Cryptocurrency tracking
- [ ] Financial education content
- [ ] Advanced analytics with ML predictions
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

1. **"Missing Supabase configuration"**
   - Ensure environment variables are set correctly
   - Check that Supabase project is properly configured

2. **Google OAuth not working**
   - Verify redirect URIs in Google Cloud Console
   - Ensure OAuth is enabled in Supabase dashboard

3. **AI features not responding**
   - Check that GEMINI_API_KEY is set correctly
   - Verify API key has proper permissions

For more detailed troubleshooting, see our [troubleshooting guides](./docs/).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Google AI** for the powerful Gemini API
- **Vercel** for seamless deployment
- **The Gen Z community** for inspiration and feedback

---

## 📞 Support & Contact

- 📧 **Email**: support@spendrift.app
- 💬 **Discord**: [Join our community](https://discord.gg/spendrift)
- 🐦 **Twitter**: [@SpendriftApp](https://twitter.com/SpendriftApp)
- 📖 **Documentation**: [docs.spendrift.app](https://docs.spendrift.app)

---

<div align="center">

**Made with 💚 for the future of finance**

[⭐ Star us on GitHub](https://github.com/your-username/spendrift) • [🚀 Try the Live Demo](https://spendrift.vercel.app)

</div>
