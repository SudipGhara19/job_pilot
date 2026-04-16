'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "@/public/images/auth/logo.png";
import facebookLogo from "@/public/images/auth/facebook.png";
import googleLogo from "@/public/images/auth/google.png";
import bgImage from "@/public/images/auth/bg.png";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "@/lib/features/user/userSlice";
import { RootState } from "@/lib/store";
import api from "@/lib/axios";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Dispatch user to Redux store
      dispatch(setCurrentUser(res.data));
      
      // Redirect logic based on company data
      if (!res.data.company?.companyName) {
        router.push("/account-setup");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      {/* Left Column: Form */}
      <div className="flex flex-col w-full lg:w-[55%] p-8 sm:p-12 xl:p-16 relative bg-white z-10 overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.35 }}
          className="flex-1 flex flex-col"
        >
          {/* Logo */}
          <div className="w-full max-w-[480px] mx-auto">
            <div className="flex items-center gap-2.5 mb-12">
              <Image src={logo} alt="JobPilot Logo" width={40} height={40} className="w-auto h-8" />
              <span className="text-2xl font-semibold tracking-tight text-gray-900">JobPilot</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[480px] mx-auto my-auto flex-1 flex flex-col justify-center">
            <h1 className="text-[28px] sm:text-3xl font-medium text-gray-900 mb-2">Log In to JobPilot</h1>
            <p className="text-[15px] font-normal text-gray-500 mb-8">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-gray-900 hover:text-gray-700 underline underline-offset-2 transition-colors">
                Sign Up
              </Link>
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[10px] text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-[14px] text-gray-400 mb-2 font-normal">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[14px] text-gray-400 mb-2 font-normal">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900 pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye className="w-[18px] h-[18px]" />
                    ) : (
                      <EyeOff className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="#" className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors underline underline-offset-2">
                    Forget your password
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-[14px] bg-[#5B5CE2] hover:bg-[#4d4eba] disabled:bg-[#a6a8eb] disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors mt-2 text-[15px]"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-[12px] text-gray-400 font-normal">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors bg-white">
                <Image src={facebookLogo} alt="Facebook" width={20} height={20} />
                <span className="text-[14px] font-normal text-gray-600">Log in with Facebook</span>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors bg-white">
                <Image src={googleLogo} alt="Google" width={20} height={20} />
                <span className="text-[14px] font-normal text-gray-600">Log in with Google</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Background Image */}
      <div className="hidden lg:block lg:w-[45%] relative bg-gray-100 h-full overflow-hidden">
        <Image
          src={bgImage}
          alt="Office space with people"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
