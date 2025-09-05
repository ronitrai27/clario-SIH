/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
import SlidingCards from "../_components/SlidingCard";
import ActionsButtons from "../_components/ActionButtonsHome";
import {
  getMatchingMentors,
  getRandomUsersByInstitution,
} from "@/lib/functions/dbActions";
import { useEffect, useState } from "react";
import { DBMentor } from "@/lib/types/allTypes";
// import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
// import Rating from "@mui/material/Rating";
import {
  LuActivity,
  LuCircleFadingPlus,
  LuFilter,
  LuPen,
  LuScreenShare,
  LuSearch,
  LuStar,
} from "react-icons/lu";
import HomeCalendar from "../_components/HomeCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DBUser } from "@/lib/types/allTypes";
import ActionBox from "../_components/ActionBox";
import { Ghost, PlusCircle } from "lucide-react";

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
  const [discoverUsers, setDiscoverUsers] = useState<DBUser[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);

  useEffect(() => {
    ensureUserInDB();
  }, []);

  const getAvatar = (mentor: any) => {
    if (mentor.avatar) return mentor.avatar;
    const randomIndex = Math.floor(Math.random() * fallbackAvatars.length);
    return fallbackAvatars[randomIndex];
  };
  // SHOWING MENTORS---------------------------------------
  useEffect(() => {
    if (!user || !user.mainFocus) return;
    if (mentors.length > 0) return;
    setMentorLoading(true);
    getMatchingMentors(user?.mainFocus)
      .then((data) => setMentors(data))
      .finally(() => setMentorLoading(false));
  }, [user]);

  // DISCOVER USERS FROM SAME INSTITUTION---------------------------
  useEffect(() => {
    if (!user || !user.institutionName) return;
    if (discoverUsers.length > 0) return;

    setDiscoverLoading(true);
    getRandomUsersByInstitution(user.institutionName, user.id)
      .then((data) => setDiscoverUsers(data))
      .finally(() => setDiscoverLoading(false));
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
    <section className="h-full  bg-gray-50 py-6 pl-0 pr-4 w-full overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex h-full justify-between overflow-hidden ">
          {/*---------- Left side--------------- */}
          <div className="w-[75%] ">
            <SlidingCards />
            {loading ? (
              <div className="mt-3 max-w-[800px] mx-auto flex justify-between items-center">
                <Skeleton className="h-[40px] w-[300px] rounded-full" />
                <Skeleton className="h-[40px] w-[300px] rounded-full" />
              </div>
            ) : (
              <div className="mt-2 max-w-[800px]  mx-auto flex justify-between items-center">
                <h1 className="text-4xl font-semibold font-inter tracking-tight">
                  Welcome, {user?.userName}
                </h1>
                <ActionsButtons />
              </div>
            )}

            {/* ACTION BOX */}
            <ActionBox />

            {/* MENTORS !! */}
            <div className="max-w-[880px] mx-auto  p-2 mt-8  overflow-hidden">
              <h2 className="text-[26px] tracking-tight font-medium font-inter mb-6 pl-2">
                Recommended Mentors
              </h2>

              {mentorLoading || loading ? (
                <div className="flex space-x-6 overflow-x-auto px-2 scrollbar-hide">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-[300px] w-[260px] rounded-2xl flex-shrink-0"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full overflow-hidden">
                  <div className="flex space-x-6 overflow-x-auto px-2 scrollbar-hide">
                    {mentors.map((m) => (
                      <Card
                        key={m.id}
                        className="relative group max-w-[300px] max-h-[285px] flex-shrink-0 rounded-2xl shadow-md bg-white p-0 overflow-hidden hover:-translate-y-0.5 duration-200"
                      >
                        {/* your existing content */}
                        <CardHeader className="flex flex-col  gap-2 p-0">
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
                                width={95}
                                height={95}
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

                          <CardTitle className="text-lg font-semibold text-center w-full font-raleway -mt-2">
                            {m.full_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="-mt-5 w-full mx-auto pb-3">
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
          {/* --------------Right side--------------- */}
          <div className="w-[24%]  flex flex-col gap-14  items-center h-full ">
            <HomeCalendar />
            {/* Messages Container */}
            <div className="w-full h-[466px] bg-white rounded-xl shadow px-2 py-4">
              <div className="flex items-center justify-between px-4">
                <p className="text-base font-inter font-semibold">Activity</p>
                <LuActivity className="text-blue-600 text-xl" />
              </div>
              <div className="relative flex items-center  px-2 bg-gray-50 border border-gray-200 rounded-md mt-3">
                <LuSearch className=" text-gray-600 -mr-1" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="border-none rounded-none shadow-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-inter"
                />
                <LuFilter className=" text-gray-600" />
              </div>
              <Tabs
                defaultValue="messages"
                className="h-full flex flex-col mt-4 "
              >
                <TabsList className="flex w-full justify-start gap-4 bg-gray-50">
                  <TabsTrigger value="messages" className="font-inter">
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="discover" className="font-inter">
                    Discover
                  </TabsTrigger>
                </TabsList>
                <div className="flex-1 mt-4 overflow-y-auto">
                  <TabsContent value="messages" className="h-full">
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Ghost className="" size={50} />
                      <p className="text-base font-inter mt-3">
                        No messages yet...
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="discover" className="h-full">
                    {discoverUsers.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No users found
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {discoverUsers.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between  p-2 "
                          >
                            {/* Left: avatar + details */}
                            <div className="flex items-center gap-3">
                              <Image
                                src={u.avatar || "/user.png"}
                                alt={u.userName}
                                width={35}
                                height={35}
                                className=" rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm tracking-tight font-inter">
                                  {u.userName}
                                </p>
                                <p className="text-sm text-muted-foreground font-inter max-w-[120px] truncate">
                                  {u.institutionName}
                                </p>
                              </div>
                            </div>

                            {/* Right: message button */}
                            <button className="px-3 py-1 text-xs tracking-tight font-inter bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition">
                              Message
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="border border-dashed border-blue-500 bg-blue-50 rounded-md  pt-4 px-4 w-[880px] mx-auto -mt-5">
          <h2 className="text-[22px] font-semibold font-sora text-center">
            Complete Your Quiz To Unlock Your Career Potential
          </h2>
          <div className="flex justify-center my-8">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
              <LuCircleFadingPlus className="text-blue-500" size={40} />
            </div>
          </div>
          <div className="w-full my-6 flex justify-center">
            <Button className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-400 hover:to-blue-600 text-white">Get Started <LuActivity className="ml-2" /></Button>
          </div>
          <div className="flex items-center justify-between">
            <Image
              src="/element8.png"
              alt="Decorative Element"
              width={200}
              height={200}
              className=" object-cover -mt-48 -ml-3"
            />
            <Image
              src="/element7.png"
              alt="Decorative Element"
              width={200}
              height={200}
              className=" object-cover -mt-48"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
