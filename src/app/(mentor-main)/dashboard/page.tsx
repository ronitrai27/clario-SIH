"use client";
import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import Link from "next/link";
import VideoUpload from "../_components/VideoUpload";
import VideoPlayer from "../_components/VideoPLayer";
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
      <div>
        <VideoUpload />
      </div>
      <div>
        <h1>watch video</h1>
        <VideoPlayer/>
      </div>
    </div>
  );
};

export default Dashbaord;
