"use client";
import { useUserData } from "@/context/UserDataProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  LuAArrowUp,
  LuArrowUpRight,
  LuGlobe,
  LuLoader,
  LuMessageCircleHeart,
  LuMic,
} from "react-icons/lu";
import { LucideGlobe, LucideSendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { UserQuizData } from "@/lib/types/allTypes";
import { getUserQuizData } from "@/lib/functions/dbActions";
import { Skeleton } from "@/components/ui/skeleton";

const CareerCoach = () => {
  const router = useRouter();
  const { user, loading } = useUserData();
  const supabase = createClient();
  const focus = user?.mainFocus?.toLowerCase();
  const [careerSkillOptions, setCareerSkillOptions] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<UserQuizData[] | null>(null); // data will always be in this format(as table structure , only the quizInfo differs so we have any for that)
  const [quizDataLoading, setQuizDataLoading] = useState(false);

  const userCareerFocuses =
    focus === "career/ path guidance" || focus === "choose career paths";

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setQuizDataLoading(true);
      const data = await getUserQuizData(user.id);
      setQuizData(data);

      //careerOptions--------------
      if (data.length > 0 && userCareerFocuses) {
        const firstQuiz = data[0];
        const options = firstQuiz.quizInfo?.careerOptions;

        if (Array.isArray(options)) {
          setCareerSkillOptions(options);
          // console.log("Career Options:", options);
        }
      }
      setQuizDataLoading(false);
    };

    fetchData();
  }, [user?.id]);

  if (loading) {
    return <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6">
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl font-sora"><LuLoader className="animate-spin inline mr-4 text-2xl" /> Loading content...</p>
      </div>
    </div>;
  }
  return (
    <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6">
      <div className="w-full h-full flex">
        {/* LEFT SIDE CHATS */}
        <div className="w-full mt-5">
          <div className="flex items-center gap-6 justify-center">
            <h1 className="text-4xl font-semibold font-sora">
              Welcome {user?.userName}
            </h1>
            <div className="bg-gradient-to-br from-blue-300 via-pink-300 to-yellow-400 w-12 h-12 rounded-full"></div>
          </div>
          <p className="mt-3 text-xl font-raleway text-center  ">
            Lets get started with defining your career goals, clearing your path
            to success.
          </p>
          {user?.isQuizDone ? (
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-[800px] mx-auto px-6">
              {quizDataLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-12 w-full rounded-xl" />
                  ))
                : careerSkillOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl shadow p-2 bg-gradient-to-br from-white to-blue-50 border hover:shadow-md hover:from-blue-50 hover:to-blue-100 transition justify-items-center"
                    >
                      <p className="text-sm font-inter font-medium text-black tracking-tight">
                        {option}
                      </p>
                    </div>
                  ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-3 gap-6 px-6">
              {/* 1 */}
              <div className="bg-slate-800 shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-inter text-base font-medium tracking-tight text-white">
                    AI Voice Assitant
                  </h2>
                  <div className="bg-gradient-to-tr from-blue-300 to-pink-300 py-1 px-2 rounded-full">
                    <p className="text-xs font-inter font-light tracking-tight">
                      Try Now <LuArrowUpRight className="text-black inline" />{" "}
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-[250px] mx-auto text-center font-inter text-gray-200 text-sm ">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet
                  tempore.
                </p>
              </div>
              {/* 2 */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-inter text-base font-medium text-blacl">
                    Clear Every Doubt
                  </h2>
                  <div className="bg-blue-100 w-9 h-9 flex items-center justify-center rounded-full">
                    <LuMessageCircleHeart className="text-blue-500 text-xl inline " />
                  </div>
                </div>
                <p className="mt-4 max-w-[250px] mx-auto text-center font-inter text-gray-600 text-sm ">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet
                  tempore blanditiis.
                </p>
              </div>
              {/* 3 */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-inter text-base font-medium text-blacl">
                    Live Web Search
                  </h2>
                  <div className="bg-blue-100 w-9 h-9 flex items-center justify-center rounded-full">
                    <LuGlobe className="text-blue-500 text-xl inline " />
                  </div>
                </div>
                <p className="mt-4 max-w-[250px] mx-auto text-center font-inter text-gray-600 text-sm ">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet
                  tempore blandit.
                </p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] mx-auto">
            <div className="bg-gray-200 rounded-md pb-2 pt-3 px-2">
              <div className="flex items-center justify-between px-6 mb-2">
                <p className="font-inter text-sm text-gray-600 tracking-tight">
                  Career Coach
                </p>
                <p className="text-gray-500 font-sora text-sm">5 searchs -</p>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Ask me anything"
                  rows={60}
                  // value={input}
                  // onChange={(e) => setInput(e.target.value)}
                  // onKeyDown={handleKeyDown}
                  className="resize-none h-[105px] bg-gray-50 placeholder:text-gray-800 text-gray-100 font-sora text-sm"
                />

                <div className="absolute bottom-2 left-4">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-500 text-blue-500">
                    <LucideGlobe size={18} />
                    <p className="text-sm tracking-tight">Web</p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-4">
                  <div
                    className="flex items-center gap-2 bg-blue-100 p-2 rounded  text-gray-600 hover:text-white cursor-pointer"
                    // onClick={sendMessage}
                  >
                    <LucideSendHorizontal size={18} className="-rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator orientation="vertical" className="h-full" />
        {/* RIGHT SIDE AI VOICE ASSITANT CARD */}
        <div className="w-[30%] h-full flex flex-col gap-3 p-2">
          <div className="bg-white overflow-hidden w-full h-[380px] shadow-md rounded-lg relative">
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
              }}
            />
            <div className="relative z-30">
              <h2 className="font-sora text-2xl font-semibold text-center mt-3">
                AI Voice Assistant
              </h2>
              <p className="text-center text-sm font-light tracking-tight font-inter mt-3 px-2">
                Need someone to help you? instead of just typing, you can
                actually clear doubts by using AI Voice Assistant
              </p>

              <div className="w-full flex items-center justify-center mt-5">
                <Button className="cursor-pointer bg-white text-black hover:bg-gray-100 ">
                  Talk Now <LuMic className="ml-2" />
                </Button>
              </div>
              <div className="absolute top-40 overflow-hidden">
                <Image
                  src="/ai_assistant.png"
                  alt="AI Assistant"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover "
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg w-full h-[268px]"></div>
        </div>
      </div>
    </div>
  );
};

export default CareerCoach;
