"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";

function LoginForm() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    
    const origin = window.location.origin;
    const emailRedirectUrl = `${origin}/${locale}/auth/callback?redirect=${encodeURIComponent(
      redirectTo
    )}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: emailRedirectUrl,
      },
    });

    setPending(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage(t('successMessage'));
    }
  };

  return (
    <div className="w-full max-w-md border rounded-lg p-6 shadow-sm bg-white">
      <h1 className="text-2xl font-semibold mb-4">{t('loginTitle')}</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <Input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? t('sending') : t('sendMagicLink')}
        </Button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations('Auth');
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <Suspense fallback={<div className="text-slate-500">{t('loading')}</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}