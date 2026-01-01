"use client";

import * as React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;
