// app/_components/home-contact-section.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeContactSection() {
  const t = useTranslations('Contact');
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t('error'));
      }

      setSuccess(t('success'));
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message ?? t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 成功提示 */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-100">
          {t('name')} *
        </Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder={t('namePlaceholder')}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-100">
          {t('email')} *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder={t('emailPlaceholder')}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-slate-100">
          {t('subject')}
        </Label>
        <Input
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder={t('subjectPlaceholder')}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-100">
          {t('message')} *
        </Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder={t('messagePlaceholder')}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('submitting')}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {t('submit')}
            <Send className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
}