import React from "react";
import { Toaster } from "@/components/ui/sonner";
import RoleGuard from "@/lib/RoleGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="">
        <RoleGuard allowedRoles={["mentor"]}>{children}</RoleGuard>
      </main>
      <Toaster />
    </>
  );
}
