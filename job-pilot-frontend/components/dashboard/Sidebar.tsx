'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCurrentUser } from "@/lib/features/user/userSlice";
import dashboardSquare from "@/public/images/sidebar/dashboard-square-03.png";
import logoutSquare from "@/public/images/sidebar/logout-square-01.png";
import userCircle from "@/public/images/sidebar/user-circle.png";
import addCircle from "@/public/images/sidebar/add-circle.png";
import briefcaseImg from "@/public/images/sidebar/briefcase-01.png";
import bookmarkImg from "@/public/images/sidebar/bookmark-02.png";
import invoiceImg from "@/public/images/sidebar/invoice-03.png";
import settingsImg from "@/public/images/sidebar/settings-01.png";

const navItems = [
  { label: "Overview",          img: dashboardSquare, path: "/overview" },
  { label: "Employers profile", img: userCircle,      path: "/profile" },
  { label: "Post a Job",        img: addCircle,       path: "/post-job" },
  { label: "My Jobs",           img: briefcaseImg,    path: "/my-jobs" },
  { label: "Saved Candidate",   img: bookmarkImg,     path: "/candidates" },
  { label: "Plans & Billing",   img: invoiceImg,      path: "/billing" },
  { label: "Settings",          img: settingsImg,     path: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    router.push('/login');
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className="w-[280px] bg-white border-r border-[#E9EAEF] h-full flex flex-col pt-8 pb-10"
    >
      <div className="px-8 mb-5">
        <span className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">Employers Dashboard</span>
      </div>

      <nav className="flex-1 flex flex-col space-y-1">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.path || (item.path === '/my-jobs' && pathname.startsWith('/my-jobs'));
          return (
            <Link key={idx} href={item.path}>
              <motion.div
                whileHover={{ backgroundColor: isActive ? "" : "#fafafa", x: isActive ? 0 : 4 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3.5 py-3.5 transition-colors cursor-pointer border-l-[3px] ${
                  isActive
                    ? "bg-[#EBEDFF] text-[#5B5CE2] border-[#5B5CE2] ml-6 pl-[7px] pr-8"
                    : "text-gray-500 border-transparent font-medium pl-8 pr-8 hover:bg-[#fafafa]"
                }`}
              >
                <Image
                  src={item.img}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={isActive ? "opacity-100" : "opacity-60"}
                />
                <span className={`text-[14.5px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-8 mt-auto pt-6">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="flex items-center gap-3.5 text-gray-500 transition-colors font-medium w-full py-3"
        >
          <Image src={logoutSquare} alt="Log Out" width={20} height={20} className="opacity-60" />
          <span className="text-[14.5px]">Log Out</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
