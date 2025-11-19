// app/auth/login/page.tsx
// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useRouter, useSearchParams } from "next/navigation";

// type Mode = "password" | "magic_link";

// export default function LoginPage() {
//   const [mode, setMode] = useState<Mode>("password");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setError(null);

//     try {
//       if (mode === "password") {
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         if (error) throw error;

//         // setMessage("登录成功，正在跳转到控制台...");
//         // 这里你可以用 router.push("/dashboard")，暂时先留在本页
//         const router = useRouter();
//         router.push("/dashboard");
//       } else {
//         const searchParams = useSearchParams();
//         const redirectTo = searchParams.get("redirect") || "/dashboard";
//         // magic link
//         const { error } = await supabase.auth.signInWithOtp({
//           email,
//           options: {
//             emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
//               redirectTo
//             )}`,
//           },
//         });
//         if (error) throw error;
//         setMessage("登录链接已发送到你的邮箱，请检查收件箱。");
//       }
//     } catch (err: any) {
//       setError(err.message ?? "登录失败，请稍后再试。");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-slate-100">
//       <div className="w-full max-w-md rounded-xl bg-white shadow p-8 space-y-6">
//         <div className="space-y-1">
//           <h1 className="text-2xl font-bold tracking-tight">
//             登录 Semiconductor CMS
//           </h1>
//           <p className="text-sm text-slate-500">
//             使用邮箱密码或 Magic Link 登录后台控制台。
//           </p>
//         </div>

//         {/* 模式切换 */}
//         <div className="flex gap-2 text-sm">
//           <button
//             type="button"
//             className={`px-3 py-1 rounded border ${
//               mode === "password"
//                 ? "bg-slate-900 text-white border-slate-900"
//                 : "bg-white text-slate-700 border-slate-200"
//             }`}
//             onClick={() => setMode("password")}
//           >
//             邮箱 + 密码
//           </button>
//           <button
//             type="button"
//             className={`px-3 py-1 rounded border ${
//               mode === "magic_link"
//                 ? "bg-slate-900 text-white border-slate-900"
//                 : "bg-white text-slate-700 border-slate-200"
//             }`}
//             onClick={() => setMode("magic_link")}
//           >
//             Magic Link
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-1">
//             <label htmlFor="email" className="text-sm font-medium text-slate-700">
//               邮箱
//             </label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {mode === "password" && (
//             <div className="space-y-1">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium text-slate-700"
//               >
//                 密码
//               </label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading
//               ? "处理中..."
//               : mode === "password"
//               ? "登录"
//               : "发送 Magic Link"}
//           </Button>
//         </form>

//         {message && <p className="text-sm text-green-600">{message}</p>}
//         {error && <p className="text-sm text-red-600">{error}</p>}
//       </div>
//     </main>
//   );
// }

// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // 回跳地址（例如未登录访问 /dashboard，会 redirect 到 /auth/login?redirect=/dashboard）
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    const emailRedirectUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
      redirectTo
    )}`;
    console.log("Generated emailRedirectTo URL:", emailRedirectUrl);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // magic link 点击后会回到这个 URL，上面我们要做 /auth/callback 处理
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4">登录后台</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded disabled:opacity-60"
          >
            {pending ? "发送中..." : "发送登录链接"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600 leading-relaxed">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 leading-relaxed">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

// 'use client'

// import { useState } from 'react'
// import { createBrowserSupabaseClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'

// interface AuthFormProps {
//   mode: 'login' | 'register'
// }

// export default function AuthForm({ mode }: AuthFormProps) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [successMessage, setSuccessMessage] = useState<string | null>(null)
//   const [authMethod, setAuthMethod] = useState<'password' | 'magiclink'>('password')
  
//   const router = useRouter()
//   const supabase = createBrowserSupabaseClient()

//   // 账号密码登录/注册
//   const handlePasswordAuth = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setSuccessMessage(null)

//     try {
//       if (mode === 'login') {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         })

//         if (error) throw error
        
//         router.push('/dashboard')
//         router.refresh()
//       } else {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             emailRedirectTo: `${location.origin}/auth/callback`,
//           },
//         })

//         if (error) throw error
        
//         setSuccessMessage('注册成功！请检查您的邮箱确认邮件。')
//       }
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 邮件链接登录
//   const handleMagicLinkAuth = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setSuccessMessage(null)

//     try {
//       const { error } = await supabase.auth.signInWithOtp({
//         email,
//         options: {
//           emailRedirectTo: `${location.origin}/auth/callback`,
//         },
//       })

//       if (error) throw error
      
//       setSuccessMessage('登录链接已发送到您的邮箱，请查收！')
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = authMethod === 'password' ? handlePasswordAuth : handleMagicLinkAuth
//   const isLogin = mode === 'login'

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       {/* 登录方式切换 */}
//       <div className="flex space-x-4 mb-6">
//         <button
//           type="button"
//           onClick={() => setAuthMethod('password')}
//           className={`flex-1 py-2 px-4 rounded-md font-medium ${
//             authMethod === 'password'
//               ? 'bg-blue-100 text-blue-700 border border-blue-300'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           账号密码{isLogin ? '登录' : '注册'}
//         </button>
//         <button
//           type="button"
//           onClick={() => setAuthMethod('magiclink')}
//           className={`flex-1 py-2 px-4 rounded-md font-medium ${
//             authMethod === 'magiclink'
//               ? 'bg-blue-100 text-blue-700 border border-blue-300'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           邮件链接登录
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             邮箱地址
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             placeholder="请输入您的邮箱"
//           />
//         </div>

//         {authMethod === 'password' && (
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               密码
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required={authMethod === 'password'}
//               minLength={6}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder={isLogin ? "请输入密码" : "请设置密码（至少6位）"}
//             />
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
//             {successMessage}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//         >
//           {loading ? (
//             <>处理中...</>
//           ) : authMethod === 'password' ? (
//             isLogin ? '登录' : '注册'
//           ) : (
//             '发送登录链接'
//           )}
//         </button>
//       </form>

//       <div className="mt-4 text-center">
//         {isLogin ? (
//           <p className="text-sm text-gray-600">
//             还没有账户？{' '}
//             <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
//               立即注册
//             </a>
//           </p>
//         ) : (
//           <p className="text-sm text-gray-600">
//             已有账户？{' '}
//             <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               立即登录
//             </a>
//           </p>
//         )}
//       </div>

//       {/* 邮件链接登录说明 */}
//       {authMethod === 'magiclink' && (
//         <div className="mt-4 p-3 bg-blue-50 rounded-md">
//           <p className="text-sm text-blue-700">
//             <strong>邮件链接登录：</strong>
//             输入您的邮箱地址，我们将发送一个安全的登录链接到您的邮箱。点击链接即可直接登录，无需记忆密码。
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }