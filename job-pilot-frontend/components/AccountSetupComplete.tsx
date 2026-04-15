'use client';

import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountSetupComplete() {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-[#EBEDFF] flex items-center justify-center mb-8"
      >
        <CheckCheck className="w-8 h-8 text-[#5B5CE2]" strokeWidth={2.5} />
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[22px] font-semibold text-gray-900 mb-3"
      >
        🎉 Congratulations, Your profile is 100% complete!
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[14px] text-gray-500 mb-10 font-medium flex items-center justify-center gap-1"
      >
        <span>🎉</span> Congratulations, Your profile is 100% complete!
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-4"
      >
        <button 
          onClick={() => router.push("/")}
          className="px-8 py-3 rounded-[10px] bg-[#EBEDFF] text-[#5B5CE2] font-semibold hover:bg-[#dce0fc] transition-colors text-[15px]"
        >
          View Dashboard
        </button>
        <button 
          onClick={() => router.push("/post-job")}
          className="px-8 py-3 rounded-[10px] bg-[#5B5CE2] text-white font-semibold hover:bg-[#4d4eba] transition-colors text-[15px]"
        >
          Post a Job
        </button>
      </motion.div>
    </motion.div>
  );
}
