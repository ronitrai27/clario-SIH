"use client";
import { useUserData } from "@/context/UserDataProvider";
import { useRouter } from "next/navigation";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { LuAArrowUp, LuArrowUpRight, LuGlobe, LuMessageCircleHeart } from "react-icons/lu";
import { LucideGlobe, LucideSendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const CareerCoach = () => {
  const router = useRouter();
  const { user, loading } = useUserData();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6">
      <div className="w-full h-full flex">
        {/* LEFT SIDE CHATS */}
        <div className="w-full mt-8">
          <div className="flex items-center gap-6 justify-center">
            <h1 className="text-4xl font-semibold font-sora">
              Welcome {user?.userName}
            </h1>
            <div className="bg-gradient-to-br from-blue-500 via-sky-400 to-purple-400 w-12 h-12 rounded-full"></div>
          </div>
          <p className="mt-3 text-xl font-raleway text-center  ">
            Lets get started with defining your career goals, clearing your path
            to success.
          </p>
          {user?.isQuizDone ? (
            <div></div>
          ) : (
            <div className="mt-10 grid grid-cols-3 gap-6 px-10">
              {/* 1 */}
              <div className="bg-slate-800 shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-inter text-base font-medium text-white">
                    AI Virtual Assitant
                  </h2>
                  <div className="bg-gradient-to-tr from-blue-300 to-pink-300 py-1 px-3 rounded-full">
                    <p className="text-xs font-inter">
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
                    AI Virtual Assitant
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
                    AI Virtual Assitant
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
        {/* RIGHT SIDE AI VOICE ASSITANT CARD */}
        <div className="w-[26%] h-full bg-red-200"></div>
      </div>
    </div>
  );
};

export default CareerCoach;
