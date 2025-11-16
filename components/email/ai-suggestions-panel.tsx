'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Copy, RefreshCw } from 'lucide-react';

interface AISuggestionsPanelProps {
  emailBody: string;
  onApplySuggestion: (text: string) => void;
}

export function AISuggestionsPanel({ emailBody, onApplySuggestion }: AISuggestionsPanelProps) {
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'friendly'>('professional');
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const improveEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: emailBody,
          tone: selectedTone,
        }),
      });

      if (!response.ok) throw new Error('Failed to improve email');
      const data = await response.json();
      setImprovedText(data.improved);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Enhancement
          </CardTitle>
          <CardDescription>
            Improve your email tone and clarity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['professional', 'casual', 'friendly'] as const).map((tone) => (
              <Button
                key={tone}
                variant={selectedTone === tone ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTone(tone)}
                className="capitalize"
              >
                {tone}
              </Button>
            ))}
          </div>

          <Button
            onClick={improveEmail}
            disabled={isLoading || !emailBody}
            className="w-full gap-2"
            variant="outline"
          >
            <Zap className="w-4 h-4" />
            {isLoading ? 'Improving...' : 'Improve Email'}
          </Button>

          {improvedText && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground">Improved version:</p>
              <div className="bg-muted p-3 rounded-lg text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
                {improvedText}
              </div>
              <Button
                onClick={() => {
                  onApplySuggestion(improvedText);
                  setImprovedText('');
                }}
                className="w-full gap-2"
                size="sm"
              >
                <Copy className="w-4 h-4" />
                Use This Version
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
