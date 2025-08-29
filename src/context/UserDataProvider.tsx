"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
interface DBUser {
  id: number;
  userName: string;
  userEmail: string;
  avatar: string;
  created_at: string;
  totalCredits: number;
  remainingCredits: number;
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

        // fallback values (for email/pass signup, since no metadata)
        const name =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "clarioUser";
        const avatar =
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ;

        const { data: inserted, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              userName: name,
              userEmail: authUser.email,
              avatar,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("❌ Error inserting user:", insertError.message);
        } else {
          console.log("✅ New user inserted:", inserted);
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
