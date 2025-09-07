/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { createClient } from "@/lib/supabase/client";
import { DBUser, DBMentor, UserQuizData } from "../types/allTypes"; 


const expertiseGroups: Record<string, string[]> = {
  "career/ path guidance": [
    "career/ path guidance",
    "counseling & guidance",
    "choose career paths",
  ],
  "counseling & guidance": [
    "career/ path guidance",
    "counseling & guidance",
    "choose career paths",
  ],
  "choose career paths": [
    "career/ path guidance",
    "counseling & guidance",
    "choose career paths",
  ],
};

export async function getMatchingMentors(
  userMainFocus: string
): Promise<DBMentor[]> {
  const supabase = createClient();

  const focus = userMainFocus.toLowerCase().trim();

  let query = supabase.from("mentors").select("*");

  if (focus === "others") {
    query = query.order("created_at", { ascending: false }).limit(6);
  } else {
    const validFocuses = expertiseGroups[focus] || [focus];

    query = query.overlaps("expertise", validFocuses).limit(6);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Mentors fetch error:", error);
    return [];
  }

  return data || [];
}

export async function getRandomUsersByInstitution(institutionName: string, currentUserId: number): Promise<DBUser[]> {
  const supabase = createClient();

  // fetch users from same institution
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("institutionName", institutionName)
    .neq("id", currentUserId) 
    .limit(10); 

  if (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }

  if (!data) return [];

  // shuffle + take 5
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

export async function getUserQuizData(userId: any): Promise<UserQuizData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userQuizData")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }

  return data as UserQuizData[];
}
