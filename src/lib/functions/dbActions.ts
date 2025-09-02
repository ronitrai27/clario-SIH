"use server";

import { createClient } from "@/lib/supabase/client";

type DBMentor = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  bio: string | null;
  expertise: string[];
  current_position: string;
  availability: boolean;
  rating: number;
  avatar: string | null;
  created_at: string;
  is_verified: boolean;
};

// group mapping for similar expertise
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

  if (focus === "others" && data) {
    return data.sort(() => Math.random() - 0.5).slice(0, 6);
  }

  return data || [];
}
