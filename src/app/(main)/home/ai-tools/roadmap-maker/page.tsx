"use client";
import { useUserData } from "@/context/UserDataProvider";
import React from "react";
import { LuLoader } from "react-icons/lu";

const RoadmapMaker = () => {
  const { user, loading } = useUserData();

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
  return <div className="w-full h-[calc(100vh-44px)] bg-gray-50 py-6"></div>;
};

export default RoadmapMaker;
