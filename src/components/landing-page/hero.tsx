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
  Bot
} from 'lucide-react';

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

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
    { label: "AI Models", value: "3+", suffix: "" },
    { label: "Expense Categories", value: "15", suffix: "+" },
    { label: "Analysis Points", value: "50", suffix: "+" },
    { label: "Goal Types", value: "10", suffix: "+" }
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

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        style={{ opacity }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
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
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-retro text-primary mb-4 tracking-wider">
              SpenDrift
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground font-mono leading-relaxed">
                Your AI-powered Gen-Z finance buddy that actually gets it. 
                <span className="text-primary"> Master your money</span> with insights, 
                <span className="text-accent"> gamified goals</span>, and 
                <span className="text-secondary"> zero financial stress</span>.
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button 
              asChild 
              size="lg" 
              className="font-retro text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              <Link href="/dashboard">
                Enter Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-mono text-lg px-8 py-4 border-primary/30 hover:bg-primary/10"
            >
              <Zap className="mr-2 h-5 w-5" />
              Live Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-retro text-2xl md:text-3xl text-primary mb-1">
                  {stat.value}<span className="text-accent">{stat.suffix}</span>
                </div>
                <div className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
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
              Built with cutting-edge AI and designed for the TikTok generation. 
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
      <TechStackSection />

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