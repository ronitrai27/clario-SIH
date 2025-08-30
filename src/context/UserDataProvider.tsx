"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface DBUser {
  id: number;
  userName: string;
  userEmail: string;
  avatar: string;
  created_at: string;
  totalCredits: number;
  remainingCredits: number;
  invite_link: string;
  current_status: string;
  userPhone: string;
  institutionName: string;
  mainFocus: string;
  calendarConnected: boolean;
}

interface UserDataContextType {
  user: DBUser | null;
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
  loading: boolean;
  isNewUser: boolean;
  ensureUserInDB: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    ensureUserInDB();
  }, []);

  const ensureUserInDB = async () => {
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.log("❌ Error fetching auth user:", authError.message);
        setLoading(false);
        return;
      }

      const authUser = authData?.user;
      if (!authUser) {
        console.log("⚠️ No authenticated user");
        setLoading(false);
        return;
      }

      console.log("✅ Authenticated user:", authUser.email);

      // checking id user signed with email
      const provider = authUser.app_metadata?.provider;
      if (provider === "email") {
        localStorage.setItem("emailProvider", "true");
        console.log("✅ User signed in with email");
      } else {
        localStorage.setItem("emailProvider", "false");
        console.log("⚠️ User signed in with provider:", provider);
      }

      // check if user already exists
      const { data: existingUsers, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("userEmail", authUser.email);

      if (fetchError) {
        console.error("❌ Error fetching user from DB:", fetchError.message);
        setLoading(false);
        return;
      }

      if (!existingUsers || existingUsers.length === 0) {
        console.log("🟡 No user in DB, inserting new one...");

        const name =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "clarioUser";
        const avatar =
          authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;

        const { data: inserted, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              userName: name,
              userEmail: authUser.email,
              avatar,
              invite_link: uuidv4(),
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.log("❌ Error inserting user:", insertError.message);
        } else {
          console.log("✅ New user inserted into tables:");
          localStorage.setItem("isOnboardingDone", "false"); // set onboarding to false
          setUser(inserted);
          setIsNewUser(true);
        }
      } else {
        setUser(existingUsers[0]);
        setIsNewUser(false);
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        loading,
        isNewUser,
        ensureUserInDB,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
