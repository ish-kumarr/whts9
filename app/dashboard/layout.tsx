"use client";

import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}