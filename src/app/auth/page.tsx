'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft, Chrome, Loader2, Sparkles, Mail, Lock, User } from 'lucide-react';

export default function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user && !loading) {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // Note: signInWithGoogle will redirect to Google's OAuth page
    } catch (error) {
      setIsSigningIn(false);
    }
  };

  const validateForm = (isSignUp = false) => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp) {
      if (!formData.displayName) {
        errors.displayName = 'Display name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSigningIn(true);
    try {
      await signInWithEmail(formData.email, formData.password);
    } catch (error) {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    
    setIsSigningIn(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName);
    } catch (error) {
      setIsSigningIn(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,199,117,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,199,117,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Floating elements */}
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10 pointer-events-none"
          style={{
            left: `${20 + index * 20}%`,
            top: `${20 + (index % 2) * 30}%`
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3
          }}
        >
          <Sparkles size={24} />
        </motion.div>
      ))}

      <div className="w-full max-w-md relative z-10">
        {/* Back to home link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto w-fit"
              >
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <h1 className="text-2xl font-retro font-bold text-primary">SpenDrift</h1>
                </div>
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl font-retro text-foreground">
                  Welcome to the Future
                </CardTitle>
                <CardDescription className="text-muted-foreground font-mono mt-2">
                  Your AI-powered Gen-Z finance buddy awaits
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="font-mono text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.email && <p className="text-sm text-destructive font-mono">{formErrors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="font-mono text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.password && <p className="text-sm text-destructive font-mono">{formErrors.password}</p>}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSigningIn}
                      size="lg"
                      className="w-full font-mono text-base"
                    >
                      {isSigningIn ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="font-mono text-sm">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your Name"
                          value={formData.displayName}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.displayName && <p className="text-sm text-destructive font-mono">{formErrors.displayName}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-mono text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.email && <p className="text-sm text-destructive font-mono">{formErrors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="font-mono text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.password && <p className="text-sm text-destructive font-mono">{formErrors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="font-mono text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 font-mono"
                          disabled={isSigningIn}
                        />
                      </div>
                      {formErrors.confirmPassword && <p className="text-sm text-destructive font-mono">{formErrors.confirmPassword}</p>}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSigningIn}
                      size="lg"
                      className="w-full font-mono text-base"
                    >
                      {isSigningIn ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-mono">or continue with</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  size="lg"
                  className="w-full font-mono text-base relative overflow-hidden group"
                  variant="outline"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10 flex items-center justify-center">
                    {isSigningIn ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Chrome className="mr-2 h-5 w-5 text-primary" />
                    )}
                    {isSigningIn ? 'Signing you in...' : 'Continue with Google'}
                  </div>
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    ✨ No spam, no stress, just pure financial enlightenment
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { emoji: '🤖', text: 'AI Insights' },
            { emoji: '🎯', text: 'Smart Goals' },
            { emoji: '📊', text: 'Live Analytics' }
          ].map((feature, index) => (
            <div key={index} className="space-y-2">
              <div className="text-2xl">{feature.emoji}</div>
              <p className="text-xs font-mono text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
