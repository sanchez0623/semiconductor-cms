// lib/supabase/server.ts
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !anonKey) {
    throw new Error("Supabase 环境变量未配置完整");
  }

  return createBrowserClient(url, anonKey);
}