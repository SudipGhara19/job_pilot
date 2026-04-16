'use client';

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import logo from "@/public/images/auth/logo.png";

export default function Topbar() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <header className="h-[76px] bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <Image src={logo} alt="JobPilot Logo" width={32} height={32} className="w-auto h-7" />
        <span className="text-xl font-semibold tracking-tight text-gray-900">JobPilot</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        <Link href="/post-job">
          <button className="px-6 py-2 rounded-full border border-[#7476F8] text-[#7476F8] font-semibold text-[14px] hover:bg-[#EBEDFF] transition-colors relative">
             Post a Job
          </button>
        </Link>
        
        {/* Company Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex-shrink-0 cursor-pointer">
          {currentUser?.company?.logo ? (
            <img 
              src={currentUser.company.logo} 
              alt="Company Logo" 
              className="w-full h-full object-cover" 
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
