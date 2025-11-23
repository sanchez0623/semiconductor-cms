"use client";

import { useState, Suspense } from "react"; // 引入 Suspense
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 1. 将主要逻辑抽取为 LoginForm 组件
function LoginForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    
    // 确保在客户端构建完整的 URL
    const origin = window.location.origin;
    const emailRedirectUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(
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
      setMessage("登录链接已发送到你的邮箱，请前往查收并点击链接完成登录。");
    }
  };

  return (
    <div className="w-full max-w-md border rounded-lg p-6 shadow-sm bg-white">
      <h1 className="text-2xl font-semibold mb-4">登录后台</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "发送中..." : "发送 Magic Link"}
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

// 2. 默认导出用 Suspense 包裹
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <Suspense fallback={<div className="text-slate-500">加载登录框...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}