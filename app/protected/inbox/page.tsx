import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Trash2, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';
import { DeleteEmailButton } from '@/components/email/delete-email-button';

export default async function InboxPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  const { data: emails } = await supabase
    .from('emails')
    .select('*')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/protected/dashboard" className="hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Inbox</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.display_name || data.user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Email Drafts</h2>
            <p className="text-muted-foreground">
              Manage and send emails with AI assistance
            </p>
          </div>
          <Link href="/protected/compose">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Email
            </Button>
          </Link>
        </div>

        {/* Email List */}
        {emails && emails.length > 0 ? (
          <div className="grid gap-4">
            {emails.map((email: any) => (
              <Card key={email.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        To: {email.recipient_name || email.recipient_email}
                      </CardTitle>
                      <CardDescription>
                        {email.subject}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        email.status === 'sent'
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {email.status === 'sent' ? 'Sent' : 'Draft'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Body:</p>
                    <div className="bg-muted p-4 rounded-lg text-sm line-clamp-3">
                      {email.ai_generated_body || email.body}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Created: {new Date(email.created_at).toLocaleDateString()} at{' '}
                    {new Date(email.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/protected/compose?id=${email.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Edit & Review
                      </Button>
                    </Link>
                    <DeleteEmailButton emailId={email.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No drafts yet</CardTitle>
              <CardDescription>
                Create your first email and let AI help you compose the perfect response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/protected/compose">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Start Your First Email
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
