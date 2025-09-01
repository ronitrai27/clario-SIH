"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const { user , loading} = useUserData();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    toast.success("Signed out successfully");
  };

  return (
    <div className="w-full h-full bg-gray-100">
     
    </div>
  );
}
