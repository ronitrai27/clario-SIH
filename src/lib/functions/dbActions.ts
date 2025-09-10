/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { createClient } from "@/lib/supabase/client";
import { DBUser, DBMentor, UserQuizData } from "../types/allTypes";
import { redis } from "@/lib/redis";

// Interface for the response structure
interface PaginatedMentors {
  mentors: DBMentor[];
  hasMore: boolean;
  total: number;
}

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
  const cacheKey = `mentors:${focus}`; // create a unique key based on the focus

  const cachedMentors = await redis.get(cacheKey);

  if (cachedMentors) {
    console.log(`---- Mentors HIT from Redis for key---: ${cacheKey}`);
    // Ensure cachedMentors is an array
    if (Array.isArray(cachedMentors)) {
      return cachedMentors as DBMentor[];
    }
    console.warn(
      `Invalid cache data for key: ${cacheKey}, fetching from Supabase`
    );
  } else {
    console.log(`Cache miss for key: ${cacheKey}, querying Supabase`);
  }

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

  //  10-minute TTL (600 seconds)
  if (data && data.length > 0) {
    await redis.set(cacheKey, JSON.stringify(data), { ex: 600 });
    console.log("Mentors fetched db, cached in redis");
  }

  return data || [];
}

export async function getAllMentorsPaginated(
  page: number = 1,
  limit: number = 6
): Promise<PaginatedMentors> {
  const supabase = createClient();
  const cacheKey = `mentors:page:${page}:limit:${limit}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    try {
      let parsed: PaginatedMentors;

      // Check if cachedData is already an object (e.g., Redis client auto-parsed)
      if (typeof cachedData === 'object' && cachedData !== null) {
        parsed = cachedData as PaginatedMentors;
      } else if (typeof cachedData === 'string') {
        // Parse if it's a string
        parsed = JSON.parse(cachedData) as PaginatedMentors;
      } else {
        throw new Error('Cached data is neither an object nor a valid JSON string');
      }

      // Validate the parsed data structure
      if (
        parsed &&
        Array.isArray(parsed.mentors) &&
        typeof parsed.hasMore === 'boolean' &&
        typeof parsed.total === 'number'
      ) {
        console.log(`--- HIT from Redis for mentors-connect ${cacheKey} ---`);
        return parsed;
      }
      console.warn(`Invalid cache data structure for key: ${cacheKey}`);
    } catch (err) {
      console.warn(`Invalid cache data for key: ${cacheKey}`, err);
    }
  }
  console.log(`--- Cache miss for mentors-connect ${cacheKey} ---`);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error, count } = await supabase
    .from("mentors")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Mentors fetch error:", error);
    return { mentors: [], hasMore: false, total: 0 };
  }

  const hasMore = count !== null ? end + 1 < count : false;
  const total = count || 0;

  const result: PaginatedMentors = { mentors: data || [], hasMore, total };

  await redis.set(cacheKey, JSON.stringify(result), { ex: 600 });
  console.log(`--- Cached mentors for ${cacheKey} ---`);

  return result;
}

export async function getRandomUsersByInstitution(
  institutionName: string,
  currentUserId: number
): Promise<DBUser[]> {
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
  const cacheKey = `quizdata:${userId}`; // create a unique key based on the user ID

  try {
    const cached = await redis.get<UserQuizData[]>(cacheKey);
    if (cached) {
      console.log(`✅ Quiz data Hit in Redis for user: ${userId}`);
      return cached;
    }

    console.log(`❌ Cache miss for user: ${userId}, querying Supabase...`);

    const { data, error } = await supabase
      .from("userQuizData")
      .select("*")
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching quiz data:", error);
      return [];
    }

    const quizData = (data || []) as UserQuizData[];

    if (quizData.length > 0) {
      await redis.set(cacheKey, quizData, { ex: 600 });
      console.log(`✅ Quiz data cached in Redis for user: ${userId}`);
    }

    return quizData;
  } catch (err) {
    console.error(`Redis/Supabase error for user ${userId}:`, err);
    return [];
  }
}

export async function clearMentorCache(focus: string) {
  const cacheKey = `mentors:${focus.toLowerCase().trim()}`;
  try {
    await redis.del(cacheKey);
    console.log(`✅ Redis cache cleared for key: ${cacheKey}`);
  } catch (error) {
    console.error(`❌ Failed to clear Redis cache for key: ${cacheKey}`, error);
  }
}
