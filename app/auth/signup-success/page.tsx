import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle } from 'lucide-react';
import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                Account Created!
              </CardTitle>
              <CardDescription className="text-center">
                Check your email to confirm your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation link to your email address. 
                Click the link to activate your account and start using Kaine.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Once confirmed, you can sign in and access your dashboard to 
                  start drafting emails with AI assistance.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/auth/login"
                  className="block text-center text-sm text-blue-600 hover:underline"
                >
                  Return to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
