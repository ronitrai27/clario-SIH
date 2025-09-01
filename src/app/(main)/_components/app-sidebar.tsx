"use client";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUserData } from "@/context/UserDataProvider";
import Image from "next/image";
import {
  LuArrowUpRight,
  LuChevronsDownUp,
  LuCreditCard,
  LuLoader,
  LuLogOut,
  LuSettings,
  LuSun,
} from "react-icons/lu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AppSidebar() {
  const { user, loading } = useUserData();
  const supabase = createClient();
  const router = useRouter();
  const [signoutLoading, setSignoutLoading] = useState(false);

  async function signOut() {
    setSignoutLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }finally{
      setSignoutLoading(false);
    }
  }

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="">
        <div className={`flex items-center justify-center `}>
          <Image
            src="/clario.png"
            alt="logo"
            width={60}
            height={60}
            className=""
          />
          <h2 className="font-bold -ml-1 font-sora tracking-tight text-2xl">
            Clario
          </h2>
        </div>

        <Separator className="mt-1 mb-2 " />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="px-1 overflow-hidden">
        {loading ? (
          <div></div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <div className="bg-gradient-to-br from-blue-300 to-blue-500 py-2 px-2 flex items-center justify-between w-full rounded-md overflow-hidden cursor-pointer">
                <Image
                  src={user?.avatar || "/user.png"}
                  alt="logo"
                  width={46}
                  height={46}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-base font-inter tracking-tight text-white">
                    {user?.userName}
                  </p>
                  <p className="text-gray-200 max-w-[130px] truncate text-sm font-inter">
                    {user?.userEmail}
                  </p>
                </div>
                <LuChevronsDownUp className="text-2xl cursor-pointer text-white" />
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-0 rounded-xl shadow-lg mb-2 absolute left-[122px] bottom-8 overflow-hidden">
              {/* Top section with user details */}
              <div className="flex items-center gap-4 bg-blue-100/90 p-2 font-inter overflow-hidden">
                <Image
                  src={
                    user?.avatar || `/user${Math.ceil(Math.random() * 5)}.png`
                  }
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.userName}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {user?.userEmail}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start gap-2 w-full font-roboto hover:bg-gray-50 rounded-none cursor-pointer"
                >
                  <LuArrowUpRight className="text-[18px]" />
                  Upgrade to Pro
                </Button>

                <Separator />

                <Button
                  variant="ghost"
                  className="justify-between w-full font-roboto hover:bg-gray-50 rounded-none cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <LuSettings className="text-[18px]" />
                    Profile
                  </div>
                  <kbd className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                    Ctrl+Alt+P
                  </kbd>
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start gap-2 w-full font-roboto hover:bg-gray-50 rounded-none cursor-pointer"
                >
                  <LuCreditCard className="text-[18px]" />
                  Billing
                </Button>

                <Button
                  variant="ghost"
                  className="justify-between w-full font-roboto hover:bg-gray-50 rounded-none cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <LuSun className="text-[18px]" />
                    Theme
                  </div>
                  <kbd className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                    Ctrl+Alt+D
                  </kbd>
                </Button>

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-between text-red-600 hover:text-red-700 w-full font-roboto hover:bg-gray-50 rounded-none cursor-pointer"
                    >
                      <div className="flex gap-2 items-center font-inter">
                        <LuLogOut className="text-[18px]" />
                        Logout
                      </div>
                      <kbd className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                        Ctrl+Alt+L
                      </kbd>
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-semibold font-inter text-xl">
                        Are you sure you want to logout?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-inter text-muted-foreground tracking-tight text-base">
                        This will end your session and you&apos;ll need to sign
                        in again. Despite you can simply close the tab.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-inter cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-blue-500 text-white hover:bg-blue-700 font-inter cursor-pointer"
                        onClick={signOut}
                      >
                       {
                        signoutLoading ? (
                          <>
                          <LuLoader className="animate-spin mr-2 inline" />
                          <span>Signing Out..</span>
                          </>
                        ): (
                          <>
                          <LuLogOut className="mr-2 inline" />
                          <span>Logout</span> 
                          </>
                        )
                       }
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
