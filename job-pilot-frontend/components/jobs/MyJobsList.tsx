'use client';

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import edit03 from "@/public/images/common/edit-03.png";
import delete01 from "@/public/images/common/delete-01.png";
import checkmark from "@/public/images/common/checkmark-circle-02.png";
import usersGroup3 from "@/public/images/common/user-group-03.png";
import DeleteJobModal from "@/components/jobs/DeleteJobModal";
import {
  Briefcase, AlertCircle, MoreVertical,
} from "lucide-react";

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

export default function MyJobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleted = () => {
    setDeleteTarget(null);
    // Re-fetch list after deletion
    setLoading(true);
    api.get("/api/jobs").then(res => setJobs(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-[#5B5CE2]/30 border-t-[#5B5CE2] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
    <div className="w-full h-full px-8 py-10 pb-28 overflow-y-auto overflow-x-hidden no-scrollbar">
      <h1 className="text-[26px] font-semibold text-gray-900 mb-7 tracking-tight">My Jobs</h1>

      {!jobs.length ? (
        <div className="bg-white border border-[#E9EAEF] rounded-[10px] p-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#EBEDFF] text-[#5B5CE2] rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm text-[14px]">
            You haven&apos;t posted any jobs yet. Create your first listing to start finding great candidates.
          </p>
          <Link href="/post-job" className="px-6 py-2.5 bg-[#5B5CE2] hover:bg-[#4d4eba] text-white font-medium rounded-full transition-colors text-[14px]">
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[10px] border border-[#E9EAEF]" ref={menuRef}>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_140px_180px_160px] bg-gray-50 border-b border-[#E9EAEF] px-7 py-3.5 rounded-t-[10px]">
            <span className="text-[13px] font-medium text-gray-500">Jobs</span>
            <span className="text-[13px] font-medium text-gray-500">Status</span>
            <span className="text-[13px] font-medium text-gray-500">Applications</span>
            <span className="text-[13px] font-medium text-gray-500">Actions</span>
          </div>

          {jobs.map((job: any, idx: number) => {
            const { label: daysLabel, expired } = getDaysRemaining(job.expirationDate);
            const isMenuOpen = openMenu === job._id;

            return (
              <div
                key={job._id}
                className={`grid grid-cols-[1fr_140px_180px_160px] items-center px-7 py-5 hover:bg-gray-50/60 transition-colors relative ${
                  idx !== jobs.length - 1 ? "border-b border-[#F0F1F7]" : ""
                }`}
              >
                {/* Job Info */}
                <div>
                  <p className="font-semibold text-[15px] text-gray-900 mb-1">{job.title}</p>
                  <p className="text-[13px] text-gray-400">{job.jobType}&nbsp;&nbsp;•&nbsp;&nbsp;{daysLabel}</p>
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
                  <Image src={usersGroup3} alt="Applications" width={16} height={16} />
                  <span>0 Applications</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
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
                      <div className="absolute right-0 top-8 z-20 w-[148px] bg-white rounded-[10px] shadow-lg border border-[#E9EAEF] py-1.5">
                        <Link href={`/my-jobs?tab=update&jobId=${job._id}`}>
                          <button
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] text-gray-700 hover:bg-gray-50 transition-colors"
                          >
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
