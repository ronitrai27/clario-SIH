"use client"

import { useUserData } from "@/context/UserDataProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar(){
    const {user, loading} = useUserData();
    return (
        <div className="bg-white py-5 px-4 flex border-[1px] border-gray-200">

            <div>
                <SidebarTrigger/>
            </div>

            
        </div>
    )
}