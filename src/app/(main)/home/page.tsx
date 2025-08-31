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
    <div>
      <h1>Home</h1>
      <Button onClick={handleSignOut}>Sign out</Button>

      {loading && "Loading..."}
      <p>{user?.userEmail}</p>
      <p>{user?.userName}</p>
    </div>
  );
}
