// app/dashboard/view/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms Dashboard - Semiconductor CMS",
  description: "Modern dashboard for managing contact and quote forms",
};

export default function ViewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
