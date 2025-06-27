'use client';

import { Phone, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ParentAlert() {
  const { toast } = useToast();

  const handleAlert = () => {
    toast({
      title: '🚨 Parent Alert Sent!',
      description: "A mock SMS was 'sent' to your parent. You've spent $250 on boba this week.",
      action: (
        <div className="p-2 bg-primary/20 rounded-full">
          <Phone className="h-5 w-5 text-primary" />
        </div>
      ),
    });
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Parent Alert System 🆘</CardTitle>
        <CardDescription>Hit the button for a reality check. (Demo only)</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAlert} variant="destructive" className="w-full">
          <Siren className="mr-2 h-4 w-4" />
          Alert Parent
        </Button>
      </CardContent>
    </Card>
  );
}
