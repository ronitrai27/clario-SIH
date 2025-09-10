"use client";
import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import Link from "next/link";
const Dashbaord = () => {
  const supabase = createClient();
  const router = useRouter();
  const { mentor, loading, ensureUserInDB } = useUserData();

  useEffect(() => {
    ensureUserInDB();
  }, []);

  async function signOut() {
    try {
      await supabase.auth.signOut();
      router.push("/auth-mentor");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div>
      hello
      <Button onClick={signOut}>Sign out</Button>
      <div className="">
        {loading && "Loading..."}
        <p>{mentor?.full_name}</p>
        <p>{mentor?.email}</p>
        <Link href="/test-mentor">test</Link>
      </div>
    </div>
  );
};

export default Dashbaord;
