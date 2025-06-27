'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseBankStatement } from '@/ai/flows/parse-bank-statement';
import { useData } from '@/context/data-context';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Upload, ClipboardPaste } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for text paste form
const pasteSchema = z.object({
  statementText: z.string().min(50, 'This statement looks a bit empty. Paste more content!'),
});

// Schema for file upload form
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ['text/plain', 'text/csv'];
const uploadSchema = z.object({
    file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'File is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 1MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Only .txt and .csv files are accepted.'
    ),
});

export default function StatementParser() {
  const { toast } = useToast();
  const { addTransaction } = useData();
  const [loading, setLoading] = useState(false);

  const pasteForm = useForm<z.infer<typeof pasteSchema>>({
    resolver: zodResolver(pasteSchema),
    defaultValues: {
      statementText: '',
    },
  });

  const uploadForm = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
  });

  // Shared function to run analysis
  const runAnalysis = async (text: string) => {
    setLoading(true);
    try {
      const output = await parseBankStatement({ statementText: text });
      if (output.transactions && output.transactions.length > 0) {
        output.transactions.forEach(tx => addTransaction(tx));
        toast({
            title: 'Statement Processed! ✨',
            description: `Successfully added ${output.transactions.length} new transactions.`,
        });
        pasteForm.reset();
        uploadForm.reset();
      } else {
         toast({
            variant: 'default',
            title: 'No transactions found.',
            description: 'The AI couldn\'t find any transactions to add from the text provided.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Parse party failed.',
        description: 'Could not analyze your statement. Please check the format and try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const onPasteSubmit = (values: z.infer<typeof pasteSchema>) => {
    runAnalysis(values.statementText);
  }

  const onUploadSubmit = (values: z.infer<typeof uploadSchema>) => {
    const file = values.file[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
            runAnalysis(text);
        } else {
             toast({
                variant: 'destructive',
                title: 'File is empty.',
                description: 'The uploaded file appears to be empty. Please check it and try again.',
            });
        }
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error reading file.',
            description: 'There was an issue reading your file. Please try again.',
        });
    }
    reader.readAsText(file);
  }


  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Statement Import 📄</CardTitle>
        <CardDescription>Import transactions by pasting text or uploading a file. The AI will do the heavy lifting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste"><ClipboardPaste className="mr-2 h-4 w-4"/>Paste Text</TabsTrigger>
                <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="mt-4">
                <Form {...pasteForm}>
                  <form onSubmit={pasteForm.handleSubmit(onPasteSubmit)} className="space-y-4">
                    <FormField
                      control={pasteForm.control}
                      name="statementText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statement Text</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste your statement here..." className="min-h-[200px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                      Analyze & Add Transactions
                    </Button>
                  </form>
                </Form>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
                 <Form {...uploadForm}>
                  <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)} className="space-y-4">
                    <FormField
                      control={uploadForm.control}
                      name="file"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormLabel>Statement File</FormLabel>
                          <FormControl>
                            <Input 
                                type="file" 
                                accept=".txt,.csv" 
                                onChange={(e) => onChange(e.target.files)} 
                                {...rest} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                      Analyze & Add Transactions
                    </Button>
                  </form>
                </Form>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
