/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUserData } from "@/context/UserDataProvider";
import React, { useEffect, useState } from "react";
import { LuCombine, LuGlobe, LuLoader } from "react-icons/lu";
import { getUserQuizData } from "@/lib/functions/dbActions";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LucideGlobe, LucideSendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Roadmap from "@/app/(main)/_components/RoadmapCanvas";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  "Getting tools ready...",
  "Summarizing response...",
  "Generating 3D models...",
  "Almost there...",
];

const RoadmapMaker = () => {
  const { user, loading } = useUserData();
  const focus = user?.mainFocus?.toLowerCase();
  const [careerSkillOptions, setCareerSkillOptions] = useState<string[]>([]);
  const [quizDataLoading, setQuizDataLoading] = useState(false);
  const supabase = createClient();

  const [field, setField] = useState("");
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const userCareerFocuses =
    focus === "career/ path guidance" || focus === "choose career paths";

  // to show loading text
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setQuizDataLoading(true);
      const data = await getUserQuizData(user.id);
      // setQuizData(data);

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

  const fetchRoadmap = async () => {
    if (!field.trim()) return;
    setLoadingRoadmap(true);
    setError(null);
    setRoadmap(null);

    try {
      const res = await axios.post("/api/ai/roadmap-gen", { field });
      const roadmapJson = res.data;
      setRoadmap(roadmapJson);

      const { error: insertError } = await supabase
        .from("roadmapUsers")
        .insert([
          {
            user_id: user?.id,
            roadmap_data: roadmapJson,
          },
        ]);

      if (insertError) throw insertError;
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xl font-sora">
            <LuLoader className="animate-spin inline mr-4 text-2xl" /> Loading
            content...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6 pl-3">
      <div className="flex w-full h-full gap-5">
        {/* LEFT SIDE */}
        <div className="flex flex-col w-[30%] relative">
          <h2 className="text-2xl font-semibold font-sora text-center">
            AI Roadmap Maker
          </h2>
          <p className="mt-3 font-inter text-base text-center">
            Level up your career with AI-powered roadmaps. Personalised guidance
            for your path.
          </p>

          {user?.isQuizDone ? (
            <div className="mt-8 grid grid-cols-1 gap-3  mx-auto px-6 ">
              {quizDataLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-12 w-full rounded-xl" />
                  ))
                : careerSkillOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl shadow p-2 bg-blue-50 border border-blue-400 hover:scale-105 gover:bg-blue-100 duration-200 cursor-pointer  justify-items-center text-center"
                    >
                      <p className="text-xs font-inter font-medium text-black tracking-tight">
                        {option}
                      </p>
                    </div>
                  ))}
            </div>
          ) : (
            <div></div>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] mx-auto">
            <div className="bg-gray-200 rounded-md pb-2 pt-3 px-2">
              <div className="flex items-center justify-between px-6 mb-2">
                <p className="font-inter text-sm text-gray-600 tracking-tight">
                  Roadmap Maker
                </p>
                <p className="text-gray-500 font-sora text-sm">15 coins-</p>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Devops Engineer"
                  rows={60}
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="resize-none h-[105px] bg-gray-50 placeholder:text-gray-400 text-black font-sora text-sm"
                />

                <div className="absolute bottom-2 left-4">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-500 text-blue-500">
                    <LuCombine size={18} />
                    <p className="text-sm tracking-tight">Tool</p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-4">
                  <Button
                    className="flex items-center gap-2 bg-blue-100 p-2 rounded  text-gray-600 hover:text-white cursor-pointer"
                    onClick={fetchRoadmap}
                    disabled={loading}
                  >
                    <LucideSendHorizontal size={18} className="-rotate-45" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="w-[70%] h-full bg-white border">
          {loadingRoadmap ? (
            <div className="flex flex-col items-center justify-center h-full w-full bg-white">
              <div className="flex flex-col gap-3 w-full max-w-md">
                {steps.map((text, i) => {
                  const isActive = i === stepIndex;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        opacity: isActive ? 1 : 0.6,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                        isActive ? "bg-gray-100" : ""
                      }`}
                    >
                      {isActive && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                      <span
                        className={`text-lg font-medium ${
                          isActive ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        {text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            roadmap && <Roadmap roadmap={roadmap} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapMaker;
