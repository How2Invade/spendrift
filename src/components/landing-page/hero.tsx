'use client';

import React from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Target, 
  Shield, 
  Zap,
  TrendingUp,
  MessageCircle,
  Trophy,
  Bell,
  BarChart3,
  Bot,
  DollarSign,
  Wallet,
  Star,
  ChevronDown,
  Play,
  Code,
  Cpu,
  Database,
  Globe,
  Users,
  Heart,
  Coffee,
  Gamepad2,
  Rocket,
  Flame,
  Gift,
  Crown,
  Coins,
  Smartphone,
  Wifi,
  Music,
  Camera,
  Headphones,
  Palette
} from 'lucide-react';

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Floating elements data
  const floatingElements = [
    { icon: DollarSign, x: '10%', y: '20%', delay: 0, color: 'text-green-400' },
    { icon: Coins, x: '85%', y: '15%', delay: 0.5, color: 'text-yellow-400' },
    { icon: Wallet, x: '15%', y: '70%', delay: 1, color: 'text-orange-400' },
    { icon: TrendingUp, x: '80%', y: '65%', delay: 1.5, color: 'text-emerald-400' },
    { icon: Target, x: '20%', y: '45%', delay: 2, color: 'text-blue-400' },
    { icon: BarChart3, x: '90%', y: '40%', delay: 0.3, color: 'text-purple-400' },
    { icon: Trophy, x: '5%', y: '50%', delay: 0.8, color: 'text-amber-400' },
    { icon: Shield, x: '75%', y: '25%', delay: 1.2, color: 'text-cyan-400' },
    { icon: Brain, x: '25%', y: '80%', delay: 1.8, color: 'text-pink-400' },
    { icon: Smartphone, x: '70%', y: '80%', delay: 0.7, color: 'text-indigo-400' }
  ];

  // Animated emoji/text elements
  const genZWords = [
    { text: '�', x: '12%', y: '25%', delay: 0.2 },
    { text: '💸', x: '88%', y: '30%', delay: 0.9 },
    { text: 'stonks', x: '18%', y: '60%', delay: 1.3 },
    { text: '�', x: '82%', y: '55%', delay: 0.6 },
    { text: 'bussin', x: '8%', y: '75%', delay: 1.7 },
    { text: '�', x: '92%', y: '70%', delay: 0.4 },
    { text: 'HODL', x: '25%', y: '35%', delay: 1.1 },
    { text: '💯', x: '78%', y: '45%', delay: 1.5 },
    { text: '📈', x: '14%', y: '50%', delay: 0.8 },
    { text: '$$$', x: '86%', y: '20%', delay: 1.6 },
    { text: 'rich', x: '22%', y: '15%', delay: 0.4 },
    { text: '💳', x: '90%', y: '85%', delay: 1.9 }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced AI analyzes your spending patterns and provides personalized financial advice in Gen-Z language",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Chat Expense Parsing",
      description: "Just type 'spent 50 on coffee' and our AI automatically categorizes and tracks your expenses",
      color: "text-accent"
    },
    {
      icon: BarChart3,
      title: "Smart Statement Analysis",
      description: "Upload bank statements and get instant insights on spending habits with beautiful visualizations",
      color: "text-secondary"
    },
    {
      icon: Trophy,
      title: "Gamified Goals",
      description: "Turn savings into achievements with streaks, challenges, and rewards that actually motivate",
      color: "text-chart-4"
    },
    {
      icon: Bell,
      title: "Parent Alert System",
      description: "Mock SMS notifications to parents when you're being financially responsible (or not)",
      color: "text-destructive"
    },
    {
      icon: TrendingUp,
      title: "Financial Forecasting",
      description: "Predict your future financial state with AI-powered forecasting and trend analysis",
      color: "text-chart-2"
    }
  ];

  const stats = [
    { label: "AI Models", value: "3+", suffix: "", icon: Bot, color: "text-primary" },
    { label: "Expense Categories", value: "15", suffix: "+", icon: Target, color: "text-accent" },
    { label: "$ Analyzed", value: "1M", suffix: "+", icon: DollarSign, color: "text-green-400" },
    { label: "Savings Goals", value: "10K", suffix: "+", icon: Trophy, color: "text-yellow-400" }
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated background grid */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,199,117,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,199,117,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </motion.div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute z-5 ${element.color} opacity-20 pointer-events-none`}
          style={{ left: element.x, top: element.y }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1], 
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 6,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.icon size={24} />
        </motion.div>
      ))}

      {/* Floating Currency Symbols */}
      {['$', '€', '£', '¥', '₿', '₹', '₩', '₽'].map((currency, index) => (
        <motion.div
          key={currency}
          className="absolute z-5 text-6xl font-bold text-primary/10 pointer-events-none select-none"
          style={{ 
            left: `${(index * 12 + 5) % 95}%`, 
            top: `${(index * 15 + 10) % 80}%` 
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 360],
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0]
          }}
          transition={{
            duration: 12 + index * 2,
            delay: index * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {currency}
        </motion.div>
      ))}

      {/* Financial Chart Lines */}
      <motion.div
        className="absolute top-1/3 left-1/5 w-32 h-16 opacity-20"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <motion.path
            d="M 10 30 Q 30 10 50 25 Q 70 40 90 15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 right-1/5 w-28 h-12 opacity-20"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <motion.path
            d="M 10 40 L 25 25 L 40 35 L 55 15 L 70 30 L 85 10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-accent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      {genZWords.map((word, index) => (
        <motion.div
          key={index}
          className="absolute z-5 text-sm font-bold text-primary/30 pointer-events-none select-none"
          style={{ left: word.x, top: word.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            y: [0, -30, -60],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            delay: word.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {word.text}
        </motion.div>
      ))}

      {/* Money Particle Effects */}
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute z-5 text-2xl pointer-events-none select-none opacity-20"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            y: [0, -100],
            rotate: [0, 360]
          }}
          transition={{
            duration: 6 + index,
            delay: index * 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          {['💰', '💸', '💳', '📊', '📈', '💎', '🎯', '⚡'][index]}
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-secondary/20 to-chart-4/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 hero-center px-4"
        style={{ opacity }}
      >
        <div className="hero-content max-w-6xl mx-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="font-mono text-xs bg-primary/10 text-primary border-primary/30 px-4 py-2">
              <Sparkles className="w-3 h-3 mr-2" />
              v2.0.25 • Gen-Z Finance Revolution
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Title with animated sparkles */}
            <div className="relative flex items-center justify-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-retro text-primary tracking-wider text-center relative px-4">
                SpenDrift
              </h1>
              
              {/* Animated financial icons around title - positioned absolutely to not affect centering */}
              <motion.div
                className="absolute -top-8 -right-16 text-green-400 pointer-events-none"
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <DollarSign size={36} />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-16 text-yellow-400 pointer-events-none"
                animate={{
                  rotate: [360, 0],
                  scale: [1.2, 0.8, 1.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Coins size={32} />
              </motion.div>
              
              <motion.div
                className="absolute top-1/4 -right-20 text-emerald-400 pointer-events-none"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 20, -20, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <TrendingUp size={28} />
              </motion.div>
              
              <motion.div
                className="absolute -top-4 -left-20 text-orange-400 pointer-events-none"
                animate={{
                  x: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Wallet size={30} />
              </motion.div>
              
              <motion.div
                className="absolute bottom-2 -left-12 text-blue-400 pointer-events-none"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              >
                <Shield size={26} />
              </motion.div>
            </div>
              
            {/* Glowing underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, delay: 1 }}
              style={{
                boxShadow: "0 0 20px rgba(120, 199, 117, 0.5)"
              }}
            />
            
            <div className="max-w-3xl mx-auto text-center px-4">
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-mono leading-relaxed">
                Your AI-powered Gen-Z finance buddy that actually gets it. 
                <motion.span 
                  className="text-primary inline-block"
                  whileHover={{ scale: 1.05, color: "#78c775" }}
                  transition={{ type: "spring", stiffness: 300 }}
                > Master your money</motion.span> with insights, 
                <motion.span 
                  className="text-accent inline-block"
                  whileHover={{ scale: 1.05, color: "#f59e0b" }}
                  transition={{ type: "spring", stiffness: 300 }}
                > gamified goals</motion.span>, and 
                <motion.span 
                  className="text-secondary inline-block"
                  whileHover={{ scale: 1.05, color: "#8b5cf6" }}
                  transition={{ type: "spring", stiffness: 300 }}
                > zero financial stress</motion.span>.
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button 
                asChild 
                size="lg" 
                className="font-retro text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden"
              >
                <Link href="/dashboard">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Enter Dashboard
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Link>
              </Button>
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-md border-2 border-primary/50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="font-mono text-lg px-8 py-4 border-primary/30 hover:bg-primary/10 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="h-5 w-5" />
                  </motion.div>
                  Live Demo
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center relative group cursor-pointer"
                whileHover={{ scale: 1.05, y: -3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10 p-4 bg-card/20 rounded-lg border border-border/20 backdrop-blur-sm">
                  {/* Animated icon */}
                  <motion.div
                    className={`mx-auto mb-2 w-fit p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 ${stat.color}`}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <stat.icon size={20} />
                  </motion.div>
                  
                  <motion.div 
                    className={`font-retro text-xl md:text-2xl mb-1 ${stat.color}`}
                    animate={{ 
                      textShadow: [
                        "0 0 0px currentColor",
                        "0 0 8px currentColor",
                        "0 0 0px currentColor"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.value}<span className="text-accent">{stat.suffix}</span>
                  </motion.div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                
                {/* Money rain effect on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-green-400 text-xs"
                      style={{ 
                        left: `${30 + i * 20}%`,
                        top: '10%'
                      }}
                      animate={{
                        y: [0, 60],
                        opacity: [1, 0]
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1.5
                      }}
                    >
                      💰
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll Indicator - positioned absolutely outside the centered content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-muted-foreground/80"
          >
            <span className="font-mono text-xs mb-3 uppercase tracking-widest opacity-60">Scroll to explore</span>
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1, color: "#78c775" }}
            >
              <ChevronDown size={18} className="opacity-80" />
              <ChevronDown size={18} className="-mt-1 opacity-50" />
              <ChevronDown size={18} className="-mt-1 opacity-30" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="font-mono text-xs bg-accent/10 text-accent border-accent/30 px-4 py-2 mb-6">
              <Bot className="w-3 h-3 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-retro text-foreground mb-6">
              Finance.
              <span className="text-primary">exe</span>
            </h2>
            <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto">
              Built with cutting-edge AI and designed for the Instagram generation. 
              Because managing money shouldn't be as boring as your parents made it seem.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className={`p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4 ${feature.color}`}>
        <feature.icon className="w-6 h-6" />
      </div>
      <h3 className="font-retro text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground font-mono text-sm leading-relaxed">
        {feature.description}
      </p>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </motion.div>
  );
};

const TechStackSection = () => {
  const techStack = [
    { name: "Next.js 15", category: "Framework" },
    { name: "Google Genkit", category: "AI/ML" },
    { name: "Gemini 2.0", category: "LLM" },
    { name: "Firebase", category: "Backend" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Framer Motion", category: "Animation" },
    { name: "Shadcn/ui", category: "Components" }
  ];

  return (
    <section className="relative z-10 py-32 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Badge className="font-mono text-xs bg-secondary/10 text-secondary border-secondary/30 px-4 py-2 mb-6">
            <Shield className="w-3 h-3 mr-2" />
            Tech Stack
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-retro text-foreground mb-6">
            Built with the
            <span className="text-primary"> latest tech</span>
          </h2>
          <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
            Powered by cutting-edge technologies to deliver a seamless, fast, and intelligent experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/30 transition-colors group"
            >
              <div className="font-retro text-sm text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                {tech.category}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="relative z-10 py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold font-retro text-foreground mb-6">
            Ready to level up your
            <span className="text-primary"> finance game</span>?
          </h2>
          <p className="text-xl text-muted-foreground font-mono mb-12 max-w-2xl mx-auto">
            Join the financial revolution that actually speaks your language. 
            No cap, this is the future of money management.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="font-retro text-xl px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              <Link href="/dashboard">
                Start Your Journey
                <Sparkles className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;