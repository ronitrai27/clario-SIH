"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
   toast.success("Signed out successfully");

  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
