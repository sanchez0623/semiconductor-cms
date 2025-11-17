// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "password" | "magic_link";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (mode === "password") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("登录成功，正在跳转到控制台...");
        // 这里你可以用 router.push("/dashboard")，暂时先留在本页
        // const router = useRouter();
        // router.push("/dashboard");
      } else {
        // magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("登录链接已发送到你的邮箱，请检查收件箱。");
      }
    } catch (err: any) {
      setError(err.message ?? "登录失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white shadow p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            登录 Semiconductor CMS
          </h1>
          <p className="text-sm text-slate-500">
            使用邮箱密码或 Magic Link 登录后台控制台。
          </p>
        </div>

        {/* 模式切换 */}
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            className={`px-3 py-1 rounded border ${
              mode === "password"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
            onClick={() => setMode("password")}
          >
            邮箱 + 密码
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded border ${
              mode === "magic_link"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200"
            }`}
            onClick={() => setMode("magic_link")}
          >
            Magic Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              邮箱
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === "password" && (
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "处理中..."
              : mode === "password"
              ? "登录"
              : "发送 Magic Link"}
          </Button>
        </form>

        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}