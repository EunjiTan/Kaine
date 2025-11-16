import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, TrendingUp, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  // Fetch analytics data
  const { data: analyticsData } = await supabase
    .from('email_analytics')
    .select('*')
    .eq('user_id', data.user.id)
    .order('sent_at', { ascending: false });

  // Fetch sent emails
  const { data: emailsData } = await supabase
    .from('emails')
    .select('*')
    .eq('user_id', data.user.id)
    .eq('status', 'sent');

  // Calculate metrics
  const totalEmailsSent = emailsData?.length || 0;
  const aiGeneratedEmails = analyticsData?.filter(a => a.was_ai_generated).length || 0;
  const totalTimeSaved = analyticsData?.reduce((sum, a) => sum + (a.time_saved_seconds || 0), 0) || 0;
  const avgTimePerEmail = totalEmailsSent > 0 ? Math.round(totalTimeSaved / totalEmailsSent) : 0;

  const recentActivity = analyticsData?.slice(0, 10) || [];

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
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Analytics</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Email Performance</h2>
          <p className="text-muted-foreground">
            Track your email activity and time saved with AI assistance
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Emails Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{totalEmailsSent}</span>
                <Mail className="w-5 h-5 text-blue-600 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Professional communications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{aiGeneratedEmails}</span>
                <TrendingUp className="w-5 h-5 text-purple-600 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalEmailsSent > 0 ? Math.round((aiGeneratedEmails / totalEmailsSent) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Time Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {Math.round(totalTimeSaved / 60)}h
                </span>
                <Clock className="w-5 h-5 text-green-600 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                With AI assistance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Time/Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{avgTimePerEmail}s</span>
                <Clock className="w-5 h-5 text-orange-600 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minutes saved per email
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest email actions and time saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.was_ai_generated ? 'AI Generated Email' : 'Email Sent'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.sent_at).toLocaleDateString()} at{' '}
                          {new Date(activity.sent_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +{Math.round((activity.time_saved_seconds || 0) / 60)}m saved
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time_saved_seconds || 0}s
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No email activity yet</p>
                <Link href="/protected/compose">
                  <Button variant="outline">Send Your First Email</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">AI Adoption Rate</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                    style={{ width: `${totalEmailsSent > 0 ? (aiGeneratedEmails / totalEmailsSent) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {totalEmailsSent > 0 ? Math.round((aiGeneratedEmails / totalEmailsSent) * 100) : 0}% of emails use AI assistance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Drafts Created</span>
                <span className="font-medium">{(emailsData?.length || 0) + (analyticsData?.length || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium">
                  {analyticsData?.filter(a => {
                    const date = new Date(a.sent_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length || 0} emails
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
