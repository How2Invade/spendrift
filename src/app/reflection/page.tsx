'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useData } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { reflectOnSpending, type ReflectOnSpendingOutput } from '@/ai/flows/reflect-on-spending';
import { generateImage } from '@/ai/flows/generate-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type ResultState = ReflectOnSpendingOutput & {
    imageDataUri?: string;
};

export default function ReflectionPage() {
    const { transactions } = useData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [result, setResult] = useState<ResultState | null>(null);

    const handleReflection = async () => {
        if (transactions.length < 5) {
            toast({
                title: "Need more data!",
                description: "Add at least 5 transactions for an accurate reflection.",
                variant: "default",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const transactionHistory = transactions.map(t => `${t.category},${t.amount},${t.date},${t.type}`).join('\n');
            const userIncome = 75000; // Mock income for now

            // Get text-based reflection first
            const reflectionResult = await reflectOnSpending({ transactionHistory, userIncome });
            setResult(reflectionResult);
            setIsImageLoading(true);

            // Generate image in parallel
            const imageResult = await generateImage({ prompt: reflectionResult.imagePrompt });
            setResult(prev => prev ? { ...prev, imageDataUri: imageResult.imageDataUri } : null);

        } catch (error) {
            console.error(error);
            toast({
                title: "AI is having an off day.",
                description: "Couldn't generate your reflection. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setIsImageLoading(false);
        }
    };

    const getOutlookBadgeVariant = (outlook: 'positive' | 'negative' | 'neutral') => {
        switch (outlook) {
            case 'positive': return 'default';
            case 'negative': return 'destructive';
            case 'neutral': return 'secondary';
        }
    }

    return (
        <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen">
            <header>
                <h1 className="text-4xl font-bold font-retro text-primary glow-text mb-2">
                    Future Self Reflection 🔮
                </h1>
                <p className="text-muted-foreground font-mono">
                    {'>'} See a glimpse of your financial future based on today's habits.
                </p>
            </header>

            {!result && (
                 <Card className="max-w-2xl mx-auto text-center glassmorphism">
                    <CardHeader>
                        <CardTitle>Are you ready to look into the future?</CardTitle>
                        <CardDescription>
                            Our AI will analyze your spending habits and project an image of your future self. It's just for fun... mostly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleReflection} disabled={isLoading} size="lg" className="font-retro">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing the timeline...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Show me my future
                                </>
                            )}
                        </Button>
                    </CardContent>
                 </Card>
            )}

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <Card className="glassmorphism">
                        <CardHeader>
                           <CardTitle>Your Future Self</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {isImageLoading ? (
                               <Skeleton className="w-full aspect-square rounded-lg" />
                           ) : (
                                result.imageDataUri && (
                                     <Image
                                        src={result.imageDataUri}
                                        alt="A glimpse into your financial future"
                                        width={600}
                                        height={600}
                                        className="rounded-lg border-2 border-border shadow-lg w-full h-auto"
                                    />
                                )
                           )}
                        </CardContent>
                    </Card>
                     <div className="space-y-6">
                        <Card className="glassmorphism">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>The Verdict</span>
                                     <Badge variant={getOutlookBadgeVariant(result.futureOutlook)} className="capitalize">
                                        {result.futureOutlook} Outlook
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{result.reflection}</p>
                            </CardContent>
                        </Card>
                         <Button onClick={() => setResult(null)} variant="outline" className="w-full">
                            Reflect Again
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
