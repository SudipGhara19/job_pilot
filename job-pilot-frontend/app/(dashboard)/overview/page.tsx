'use client';

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import briefcase from "@/public/images/overview/briefcase-01.png";
import userAccount from "@/public/images/overview/user-account.png";
import edit03 from "@/public/images/common/edit-03.png";
import delete01 from "@/public/images/common/delete-01.png";
import checkmark from "@/public/images/common/checkmark-circle-02.png";
import usersGroup3 from "@/public/images/common/user-group-03.png";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle, MoreVertical,
} from "lucide-react";
import DeleteJobModal from "@/components/jobs/DeleteJobModal";

function getDaysRemaining(expirationDate: string): { label: string; expired: boolean } {
  if (!expirationDate) return { label: "No expiry", expired: false };
  const now = new Date();
  const exp = new Date(expirationDate);
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) {
    return {
      label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(exp),
      expired: true,
    };
  }
  return { label: `${diff} days remaining`, expired: false };
}

interface Job {
  _id: string;
  title: string;
  jobType: string;
  expirationDate: string;
}

export default function OverviewPage() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) { router.push("/login"); return; }
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentUser, router]);

  const handleDeleted = () => {
    setDeleteTarget(null);
    setLoading(true);
    api.get("/api/jobs").then(res => setJobs(res.data)).finally(() => setLoading(false));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!currentUser) return null;

  const openJobsCount = jobs.filter(j => {
    const exp = new Date(j.expirationDate);
    return exp > new Date();
  }).length;

  const displayName = currentUser.company?.companyName || currentUser.fullName || "there";

  return (
    <>
    <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-8 py-10 pb-28">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Hello, {displayName}</h1>
        <p className="text-gray-400 text-[14.5px] mt-1">Here is your daily activity and applications</p>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-5 mb-10">
        <div className="flex items-center justify-between bg-[#EBEDFF] rounded-[10px] px-7 py-6 w-[320px]">
          <div>
            <p className="text-[30px] font-bold text-gray-900 leading-none mb-1.5">{loading ? "—" : openJobsCount}</p>
            <p className="text-[14px] text-gray-600 font-medium">Open Jobs</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-[8px] border border-gray-200 flex items-center justify-center flex-shrink-0">
              <Image src={briefcase} alt="Open Jobs" width={32} height={32} />
            </div>
        </div>

        <div className="flex items-center justify-between bg-[#FFF3E8] rounded-[10px] px-7 py-6 w-[320px]">
          <div>
            <p className="text-[30px] font-bold text-gray-900 leading-none mb-1.5">0</p>
            <p className="text-[14px] text-gray-600 font-medium">Saved Candidates</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-[8px] border border-orange-100 flex items-center justify-center flex-shrink-0">
              <Image src={userAccount} alt="Saved Candidates" width={32} height={32} />
            </div>
        </div>
      </div>

      {/* Recently Posted Jobs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-gray-900">Recently Posted Jobs</h2>
          <Link href="/my-jobs" className="text-[14px] text-[#5B5CE2] hover:underline font-medium">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-[#5B5CE2]/30 border-t-[#5B5CE2] rounded-full animate-spin" />
          </div>
        ) : !jobs.length ? (
          <div className="bg-white border border-[#E9EAEF] rounded-[10px] p-12 text-center text-gray-400 text-[14px]">
            No jobs posted yet.{" "}
            <Link href="/post-job" className="text-[#5B5CE2] hover:underline">Post your first job →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-[#E9EAEF]" ref={menuRef}>
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_140px_180px_160px] bg-gray-50 border-b border-[#E9EAEF] px-7 py-3.5">
              <span className="text-[13px] font-medium text-gray-500">Jobs</span>
              <span className="text-[13px] font-medium text-gray-500">Status</span>
              <span className="text-[13px] font-medium text-gray-500">Applications</span>
              <span className="text-[13px] font-medium text-gray-500">Actions</span>
            </div>

            {jobs.map((job: Job, idx: number) => {
              const { label: daysLabel, expired } = getDaysRemaining(job.expirationDate);
              const isMenuOpen = openMenu === job._id;
              return (
                <div
                  key={job._id}
                  className={`grid grid-cols-[1fr_140px_180px_160px] items-center px-7 py-5 hover:bg-gray-50/60 transition-colors relative ${idx !== jobs.length - 1 ? "border-b border-[#F0F1F7]" : ""}`}
                >
                  {/* Job Info */}
                  <div>
                    <p className="font-semibold text-[15px] text-gray-900 mb-1">{job.title}</p>
                    <p className="text-[13px] text-gray-400">{job.jobType} &nbsp;•&nbsp; {daysLabel}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    {expired ? (
                      <><AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" /><span className="text-[13.5px] font-medium text-orange-500">Expired</span></>
                    ) : (
                      <><Image src={checkmark} alt="Active" width={16} height={16} className="flex-shrink-0" /><span className="text-[13.5px] font-medium text-[#2ECA7F]">Active</span></>
                    )}
                  </div>

                  {/* Applications */}
                  <div className="flex items-center gap-2 text-gray-500 text-[13.5px]">
                    <Image src={usersGroup3} alt="Applications" width={16} height={16} className="text-gray-400" />
                    <span>0 Applications</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 relative">
                    <Link href={`/my-jobs?tab=viewJob&jobId=${job._id}`}>
                      <button className="px-5 py-2 text-[13.5px] text-[#5B5CE2] bg-[#EBEDFF] hover:bg-[#dfe1fa] font-medium rounded-full transition-colors whitespace-nowrap">
                        View Job
                      </button>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(isMenuOpen ? null : job._id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-20 w-[148px] bg-white rounded-[10px] shadow-lg border border-[#E9EAEF] py-1.5 overflow-hidden">
                          <Link href={`/my-jobs?tab=update&jobId=${job._id}`}>
                            <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] text-gray-700 hover:bg-gray-50 transition-colors">
                              <Image src={edit03} alt="Edit" width={16} height={16} />
                              Edit Job
                            </button>
                          </Link>
                          <button
                            onClick={() => { setOpenMenu(null); setDeleteTarget({ id: job._id, title: job.title }); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Image src={delete01} alt="Delete" width={16} height={16} />
                            Delete Job
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

    {deleteTarget && (
      <DeleteJobModal
        jobId={deleteTarget.id}
        jobTitle={deleteTarget.title}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    )}
    </>
  );
}
