"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import SlidingCards from "../_components/SlidingCard";
import ActionsButtons from "../_components/ActionButtonsHome";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading } = useUserData();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    toast.success("Signed out successfully");
  };

  return (
    <div className="w-full h-full bg-white py-6 px-4">
      <SlidingCards />
      {loading ? (
        <div className="mt-3 max-w-[900px] mx-auto flex justify-between items-center">
          <Skeleton className="h-[40px] w-[300px] rounded-full" />
          <Skeleton className="h-[40px] w-[300px] rounded-full" />
        </div>
      ) : (
        <div className="mt-3 max-w-[900px] mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-semibold font-inter tracking-tight">
            Welcome, {user?.userName}
          </h1>
          <ActionsButtons />
        </div>
      )}
    </div>
  );
}
