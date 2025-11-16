import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, BarChart3, Brain, LogOut } from 'lucide-react';
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Kaine</h1>
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {profile?.display_name || "User"}!</CardTitle>
              <CardDescription>
                Start managing and drafting emails with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Use Kaine to compose, review, and send professional emails faster than ever.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Inbox</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  View and manage your email drafts with AI assistance
                </CardDescription>
                <Link href="/protected/inbox">
                  <Button variant="outline" className="w-full">
                    Go to Inbox
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">AI Composer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Compose new emails with intelligent suggestions
                </CardDescription>
                <Link href="/protected/compose">
                  <Button variant="outline" className="w-full">
                    Compose Email
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  View your email activity and time saved
                </CardDescription>
                <Link href="/protected/analytics">
                  <Button variant="outline" className="w-full">
                    View Analytics
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
