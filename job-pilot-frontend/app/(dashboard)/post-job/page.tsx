'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import api from "@/lib/axios";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { COUNTRY_CODES } from "@/lib/countries";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function PostJobPage() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    jobRole: "",
    minSalary: "",
    maxSalary: "",
    salaryType: "",
    education: "",
    experience: "",
    jobType: "",
    vacancies: "1",
    expirationDate: "",
    jobLevel: "",
    description: "",
    tags: "",
    country: "",
    city: "",
    fullyRemote: false,
  });

  useEffect(() => {
    if (!currentUser) router.push("/login");
  }, [currentUser, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'fullyRemote' && checked) {
        setFormData({ ...formData, [name]: checked, country: "", city: "" });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(
        "/api/jobs",
        {
          ...formData,
          minSalary: Number(formData.minSalary) || 0,
          maxSalary: Number(formData.maxSalary) || 0,
          vacancies: Number(formData.vacancies) || 1,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        }
      );
      router.push(`/my-jobs?tab=viewJob&jobId=${res.data._id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to post job.");
      } else {
        setError("Failed to post job.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-[1200px] bg-white w-full h-full p-8 md:p-12 pb-24 overflow-y-auto no-scrollbar">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[10px] text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10 w-full max-w-5xl">
        
        {/* Post a job */}
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-5">Post a job</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. React, Node (comma separated)"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 transition-colors placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Job Role</label>
              <div className="relative">
                <select
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled className="text-gray-400">Select</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Management">Management</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-5">Salary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Min Salary</label>
              <div className="flex border border-[#E9EAEF] rounded-[10px] overflow-hidden focus-within:border-blue-500 transition-colors">
                <input 
                  type="number" 
                  name="minSalary" 
                  value={formData.minSalary} 
                  onChange={handleInputChange} 
                  min="0"
                  required 
                  className="w-full px-3.5 py-2.5 outline-none text-[14px] text-gray-500" 
                />
                <div className="bg-[#F8F9FA] px-4 border-l border-[#E9EAEF] flex items-center justify-center text-[13px] font-medium text-gray-500">
                  USD
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Max Salary</label>
              <div className="flex border border-[#E9EAEF] rounded-[10px] overflow-hidden focus-within:border-blue-500 transition-colors">
                <input 
                  type="number" 
                  name="maxSalary" 
                  value={formData.maxSalary} 
                  onChange={handleInputChange} 
                  min="0"
                  required 
                  className="w-full px-3.5 py-2.5 outline-none text-[14px] text-gray-500" 
                />
                <div className="bg-[#F8F9FA] px-4 border-l border-[#E9EAEF] flex items-center justify-center text-[13px] font-medium text-gray-500">
                  USD
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Salary Type</label>
              <div className="relative">
                <select 
                  name="salaryType" 
                  value={formData.salaryType} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled>Select</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Advance Information */}
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-5">Advance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Education Level</label>
              <div className="relative">
                <select 
                  name="education" 
                  value={formData.education} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled>Select</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="PhD">PhD</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Experience Level</label>
              <div className="relative">
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled>Select</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
               <label className="block text-[13px] font-medium text-gray-500 mb-2">Job Type</label>
              <div className="relative">
                <select 
                  name="jobType" 
                  value={formData.jobType} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled>Select</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Job Level</label>
              <div className="relative">
                <select 
                  name="jobLevel" 
                  value={formData.jobLevel} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white"
                >
                  <option value="" disabled>Select</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Expiration Date</label>
              <input 
                type="date" 
                name="expirationDate" 
                value={formData.expirationDate} 
                onChange={handleInputChange} 
                required 
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500" 
              />
            </div>
            
            <div></div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-5">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">Country</label>
              <div className="relative">
                <select 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  required={!formData.fullyRemote}
                  disabled={formData.fullyRemote}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 appearance-none cursor-pointer bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select</option>
                  {COUNTRY_CODES.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

             <div>
              <label className="block text-[13px] font-medium text-gray-500 mb-2">City</label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Select or Type"
                  required={!formData.fullyRemote}
                  disabled={formData.fullyRemote}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E9EAEF] text-[14px] text-gray-500 outline-none focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer max-w-fit">
            <input 
              type="checkbox" 
              name="fullyRemote" 
              checked={formData.fullyRemote} 
              onChange={handleInputChange} 
              className="w-4 h-4 rounded border-gray-300 text-[#5B5CE2] focus:ring-[#5B5CE2] cursor-pointer" 
            />
            <span className="text-[13px] text-gray-700">Fully remote position</span>
          </label>
        </div>

        {/* Descriptions */}
        <div>
          <h2 className="text-[17px] font-semibold text-gray-800 mb-5">Job Descriptions</h2>
          <div className="bg-white rounded-t-[10px] [&_.ql-toolbar]:rounded-t-[8px] [&_.ql-toolbar]:border-[#E9EAEF] [&_.ql-container]:border-[#E9EAEF] [&_.ql-container]:rounded-b-[8px] [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-[14px] [&_.ql-editor]:text-gray-900 transition-colors focus-within:[&_.ql-toolbar]:border-blue-500 focus-within:[&_.ql-container]:border-blue-500">
            <ReactQuill 
              theme="snow"
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Add job description"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#5B5CE2] hover:bg-[#4d4eba] disabled:bg-[#a6a8eb] disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors text-[14.5px] flex items-center justify-center min-w-[140px]"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Post Job"}
          </button>
        </div>

      </form>
    </div>
  );
}
