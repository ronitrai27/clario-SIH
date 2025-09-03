/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import SlidingCards from "../_components/SlidingCard";
import ActionsButtons from "../_components/ActionButtonsHome";
import { getMatchingMentors } from "@/lib/functions/dbActions";
import { useEffect, useState } from "react";
import { DBMentor } from "@/lib/types/allTypes";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import { LuScreenShare, LuStar } from "react-icons/lu";

const fallbackAvatars = [
  "/a1.png",
  "/a2.png",
  "/a3.png",
  "/a4.png",
  "/a5.png",
  "/a6.png",
];

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading, ensureUserInDB } = useUserData();
  const [mentors, setMentors] = useState<DBMentor[]>([]);
  const [mentorLoading, setMentorLoading] = useState<boolean>(false);

  useEffect(() => {
    ensureUserInDB();
  }, []);

  const getAvatar = (mentor: any) => {
    if (mentor.avatar) return mentor.avatar;
    const randomIndex = Math.floor(Math.random() * fallbackAvatars.length);
    return fallbackAvatars[randomIndex];
  };

  useEffect(() => {
    if (!user || !user.mainFocus ) return;
    if (mentors.length > 0) return;
    setMentorLoading(true);
    getMatchingMentors(user?.mainFocus)
      .then((data) => setMentors(data))
      .finally(() => setMentorLoading(false));
  }, [user]);

  const avatarBgColors = [
    "bg-yellow-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-sky-200",
    "bg-green-200",
  ];

  const getRandomBgColor = () => {
    const index = Math.floor(Math.random() * avatarBgColors.length);
    return avatarBgColors[index];
  };

  return (
    <div className="h-full bg-gray-50 py-6 px-4">
      <SlidingCards />
      {loading ? (
        <div className="mt-3 max-w-[900px] mx-auto flex justify-between items-center">
          <Skeleton className="h-[40px] w-[300px] rounded-full" />
          <Skeleton className="h-[40px] w-[300px] rounded-full" />
        </div>
      ) : (
        <div className="mt-2 max-w-[900px] mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-semibold font-inter tracking-tight">
            Welcome, {user?.userName}
          </h1>
          <ActionsButtons />
        </div>
      )}
      {/* MENTORS !! */}

      <div className="max-w-[1060px] mx-auto  p-2 mt-10  overflow-hidden">
        <h2 className="text-[22px] tracking-tight font-medium font-inter mb-6 ">
          Recommended Mentors
        </h2>

        {mentorLoading || loading ? (
          <div className="flex space-x-6 overflow-x-auto px-2 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[320px] w-[260px] rounded-2xl flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <div className="flex space-x-6 overflow-x-auto px-2 scrollbar-hide">
              {mentors.map((m) => (
                <Card
                  key={m.id}
                  className="relative group max-w-[350px] max-h-[360px] flex-shrink-0 rounded-2xl shadow-md bg-white p-0 overflow-hidden hover:-translate-y-0.5 duration-200"
                >
                  {/* your existing content */}
                  <CardHeader className="flex flex-col  gap-2 p-0">
                    {/* <Rating
                      name="half-rating-read"
                      defaultValue={m.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    /> */}
                    <div className="relative w-full py-2">
                      <div
                        className={`absolute top-0 left-0 w-full h-[66%] rounded-t-2xl ${getRandomBgColor()}`}
                        style={{ zIndex: 0 }}
                      ></div>

                      <div className="absolute top-0 right-0 w-16 h-16">
                        <div className="w-full h-full bg-white/25 rounded-tr-2xl rotate-45 transform origin-top-right"></div>
                      </div>

                      <div className="absolute bottom-20 left-0 w-16 h-16">
                        <div className="w-full h-full bg-white/30 rounded-tr-2xl rotate-6 transform origin-top-right"></div>
                      </div>

                      {/* 🔹 Avatar */}
                      <div className="relative z-10">
                        <Image
                          src={getAvatar(m)}
                          alt={m.full_name}
                          width={120}
                          height={120}
                          className="rounded-full object-cover border mx-auto"
                        />

                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 bg-white border border-yellow-600 py-1 px-5 rounded-full">
                          <span className="font-inter text-sm font-medium text-amber-500 flex items-center gap-1">
                            {m.rating}{" "}
                            <LuStar className="inline fill-yellow-500 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardTitle className="text-lg  font-semibold text-center w-full font-raleway">
                      {m.full_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="-mt-3 w-full mx-auto pb-3">
                    <p className="font-inter bg-gradient-to-r from-blue-500 to-indigo-400 text-transparent bg-clip-text tracking-tight text-center capitalize text-base">
                      {m.current_position}
                    </p>
                    <p className="font-raleway text-sm tracking-tight text-center mt-2">
                      <span className="font-medium">Expertise:</span>{" "}
                      {m.expertise?.join(", ")}
                    </p>

                    <div className="flex justify-center mt-5">
                      <Button className="rounded-md text-xs font-inter bg-blue-500 text-white hover:bg-blue-600">
                        Book Session <LuScreenShare />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
