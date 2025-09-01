"use client";

import { useUserData } from "@/context/UserDataProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AnimatedAssistant from "./animated-assistant";
import { Input } from "@/components/ui/input";
import {
  LuArrowBigUp,
  LuArrowUpRight,
  LuBell,
  LuChevronDown,
  LuCoins,
  LuLogOut,
  LuMail,
  LuMoon,
  LuSearch,
  LuSun,
  LuUser,
} from "react-icons/lu";
import { Coins, CoinsIcon, LogOut, LogOutIcon } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ArrowUpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuMessageSquareMore } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { LuWallet } from "react-icons/lu";

export default function Navbar() {
  const { user, loading } = useUserData();
  return (
    <div className="bg-white py-4 px-4 pr-8 flex items-center gap-10 justify-between ">
      <div>
        <SidebarTrigger />
      </div>

      <AnimatedAssistant />

      <div className="flex items-center justify-between bg-blue-50 w-full max-w-[340px] px-2 rounded-full shadow-sm">
        <Input
          placeholder="Search"
          className="bg-transparent rounded-none border-none shadow-none focus-visible:border-0 focus-visible:ring-ring/0 focus-visible:ring-0"
        />
        <LuSearch className="text-xl text-black" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-8">
          <Tooltip>
            <TooltipTrigger>
              <LuBell className="text-[22px] text-black cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-inter text-xs">Notifications</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <LuMessageSquareMore className="text-[22px] text-black cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-inter text-xs">Messages</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {loading ? (
              <div className="flex items-center gap-2 pr-4 max-[1280px]:pr-0 rounded-full cursor-pointer">
                <div className="bg-gray-200 animate-pulse rounded-full h-12 w-12"></div>
                <div className="flex flex-col font-inter tracking-tight gap-2 max-[1280px]:hidden">
                  <p className="bg-gray-200 animate-pulse rounded-md h-5 w-28"></p>
                  <p className="bg-gray-200 animate-pulse rounded-md h-5 w-24"></p>
                </div>
              </div>
            ) : (
              <div className="">
                <Image
                  src={user?.avatar || "/user.png"}
                  alt="User Avatar"
                  width={52}
                  height={52}
                  className="rounded-full cursor-pointer"
                />
                {/* <div className="flex flex-col font-inter tracking-tight max-[1280px]:hidden">
                  <p className="font-medium font-raleway text-white capitalize tracking-tight">{user?.userName}</p>
                  <p className="font-light text-white text-sm max-w-[130px] truncate tracking-tight">
                    {user?.userEmail}
                  </p>
                </div>
                <LuChevronDown className="text-xl text-white max-[1280px]:hidden" /> */}
              </div>
            )}
          </DropdownMenuTrigger>

          {!loading && (
            <DropdownMenuContent
              align="end"
              className="min-w-60 mt-2 p-0 rounded-xl shadow-lg"
            >
              {/* Profile Section */}
              <DropdownMenuLabel className="flex items-center gap-5 px-3 py-2 bg-gradient-to-br from-blue-200 to-sky-100">
                <Image
                  src={user?.avatar || "/a1.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border -mt-3"
                />
                <div className="flex flex-col justify-end">
                  <p className="font-inter font-medium text-base">
                    {user?.userName}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground cursor-pointer">
                    Upgrade now <LuArrowUpRight className="inline" />
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Items */}

              <DropdownMenuItem className="cursor-pointer flex justify-between pl-3 pr-6 py-2  rounded-none hover:bg-blue-50">
                <p className="flex items-center gap-3">
                  <LuWallet className="h-6 w-6 text-black" />{" "}
                  <span className="font-inter text-base tracking-tight">
                    Coins:
                  </span>
                </p>

                <span className="font-semibold text-sm font-inter text-yellow-500 ">
                  {user?.remainingCredits} / {user?.totalCredits}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex gap-3 px-3 py-2 hover:bg-blue-50">
                <LuUser className="h-6 w-6 text-black" />
                <span className="font-inter text-base tracking-tight">
                  Profile
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer flex gap-3 px-3 py-2 hover:bg-blue-50">
                <LuSun className="h-6 w-6 text-black " />
                <span className="font-inter text-base tracking-tight">
                  Theme
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem asChild className="p-0 rounded-none ">
                <Button className="flex items-center gap-3 w-full bg-blue-600  py-2 px-3 cursor-pointer text-white">
                  <LuLogOut className="h-5 w-5 text-white " />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}
