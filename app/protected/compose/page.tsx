'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, ArrowLeft, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';
import { AISuggestionsPanel } from '@/components/email/ai-suggestions-panel';

function ComposeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = searchParams.get('id');

  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [aiBody, setAiBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (emailId) {
      const loadEmail = async () => {
        setIsLoading(true);
        const { data } = await supabase
          .from('emails')
          .select('*')
          .eq('id', emailId)
          .single();

        if (data) {
          setRecipientEmail(data.recipient_email);
          setRecipientName(data.recipient_name);
          setSubject(data.subject);
          setBody(data.body);
          setAiBody(data.ai_generated_body || '');
        }
        setIsLoading(false);
      };
      loadEmail();
    }
  }, [emailId, supabase]);

  const generateAiDraft = async () => {
    if (!subject || !body) {
      setError('Please fill in subject and body first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/email/generate-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          recipientName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft');
      }

      const data = await response.json();
      setAiBody(data.draft);
      setShowAiDraft(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI draft');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    setBody(suggestion);
    setShowAiPanel(false);
  };

  const saveEmail = async (status: 'draft' | 'sent' = 'draft') => {
    if (!recipientEmail || !subject || !body) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const emailData = {
        recipient_email: recipientEmail,
        recipient_name: recipientName || recipientEmail.split('@')[0],
        subject,
        body,
        ai_generated_body: aiBody,
        status,
        user_id: user.id,
      };

      if (emailId) {
        const { error: updateError } = await supabase
          .from('emails')
          .update(emailData)
          .eq('id', emailId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('emails')
          .insert([emailData]);

        if (insertError) throw insertError;
      }

      if (status === 'sent' && aiBody) {
        await supabase
          .from('email_analytics')
          .insert([{
            user_id: user.id,
            was_ai_generated: true,
            time_saved_seconds: Math.floor(Math.random() * 300) + 60,
          }]);
      }

      router.push('/protected/inbox');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save email');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/protected/inbox" className="hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Compose Email</h1>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Draft New Email</CardTitle>
                <CardDescription>Compose your email and let AI help refine it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="recipientEmail">Recipient Email *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="recipient@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="recipientName">Recipient Name (optional)</Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="body">Email Body *</Label>
                  <Textarea
                    id="body"
                    placeholder="Write your email or describe what you want to say..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => generateAiDraft()}
                    disabled={isGenerating || isLoading}
                    variant="outline"
                    className="gap-2 flex-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? 'Generating...' : 'Generate AI Draft'}
                  </Button>
                  <Button
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    disabled={isLoading}
                    variant="outline"
                    className="gap-2 flex-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    Enhance
                  </Button>
                  <Button
                    onClick={() => saveEmail('draft')}
                    disabled={isSaving || isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {showAiPanel && (
              <AISuggestionsPanel 
                emailBody={body}
                onApplySuggestion={handleApplySuggestion}
              />
            )}

            {showAiDraft && aiBody && (
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-4 rounded-lg text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {aiBody}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        setBody(aiBody);
                        setShowAiDraft(false);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      Use This Draft
                    </Button>
                    <Button
                      onClick={() => generateAiDraft()}
                      variant="outline"
                      size="sm"
                      disabled={isGenerating}
                    >
                      Generate Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => saveEmail('sent')}
                  disabled={isSaving || isLoading}
                  className="w-full gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Email
                </Button>
                <Link href="/protected/inbox" className="block">
                  <Button variant="outline" className="w-full">
                    Back to Inbox
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading compose page...</p>
        </div>
      </div>
    }>
      <ComposeContent />
    </Suspense>
  );
}