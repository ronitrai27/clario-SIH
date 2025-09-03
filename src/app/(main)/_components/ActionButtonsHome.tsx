"use client";

import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataProvider";
import { Activity, ActivityIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { LuX } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function ActionsButtons() {
  const { user } = useUserData();
  const router = useRouter();

  // Mapping occupation + focus to button text (all lowercase keys!)
  const focusTextMap: Record<string, Record<string, string>> = {
    "10th student": {
      "career/ path guidance": "Plan Your Career",
      "startup support": "Start Your Venture",
      "board exam excellence": "Ace Your Boards",
      "skill building": "Boost Your Skills",
      others: "Explore More",
    },
    "12th student": {
      "crack competitive exams": "Prep for Exams",
      "choose career paths": "Plan Your Career",
      "counseling & guidance": "Get Guidance",
      "skill building": "Boost Your Skills",
      "startup support": "Start Your Venture",
      others: "Explore More",
    },
  };

  const occupation = user?.current_status?.toLowerCase().trim();
  const focus = user?.mainFocus?.toLowerCase().trim();

  const dynamicText =
    occupation && focus
      ? focusTextMap[occupation]?.[focus] || "Explore More"
      : null;

  return (
    <div className="flex items-center gap-10">
      {/* QUIZ BUTTON */}
      {user?.isQuizDone === false && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-md shadow-md cursor-pointer font-inter text-base bg-gradient-to-b from-blue-400 to-indigo-400 text-white hover:-translate-y-1 duration-200">
              Start Quiz <Activity className="ml-2" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-gradient-to-tr from-blue-200 to-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-sora mt-1 font-semibold text-center">Ready to start your quiz?</DialogTitle>
              <DialogDescription className=" font-inter  text-lg text-center leading-snug">
                This will help us generate personalized insights, customized
                roadmaps, and better career options for you.
              </DialogDescription>
            </DialogHeader>
            <div className="-mt-24">
              <Image
                src="/element1.png"
                alt="logo"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>

            <DialogFooter className="-mt-8">
                <div className="flex items-center justify-center w-full gap-20">
                    <DialogClose asChild>
                <Button variant="outline">Cancel <LuX className="ml-2" /></Button>
              </DialogClose>
              <Button onClick={() => router.push("/start-quiz")}  className="cursor-pointer bg-blue-500 hover:bg-blue-600">
               Start Quiz <ActivityIcon className="ml-2" />
              </Button>
                </div>
              
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DYNAMIC BUTTON */}
      {dynamicText && (
        <Button
          variant="outline"
          className="rounded-md shadow-md cursor-pointer font-inter text-base text-black hover:-translate-y-1 duration-200"
        >
          {dynamicText}
        </Button>
      )}
    </div>
  );
}
