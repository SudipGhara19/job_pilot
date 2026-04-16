import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import api from "@/lib/axios";
import axios from "axios";
import JobHeader from "@/components/jobs/JobHeader";
import SalaryLocationCard from "@/components/jobs/SalaryLocationCard";
import OverviewMetricsCard from "@/components/jobs/OverviewMetricsCard";
import DeleteJobModal from "@/components/jobs/DeleteJobModal";
import deleteIcon from "@/public/images/common/delete-01.png"

interface Job {
  _id: string;
  title: string;
  description: string;
  jobType: string;
  jobRole: string;
  jobLevel: string;
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  city?: string;
  country?: string;
  fullyRemote?: boolean;
  experience?: string;
  education?: string;
  createdAt: string;
  expirationDate: string;
}

export default function ViewJob({ jobId }: { jobId: string }) {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!currentUser || !jobId) return;

    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${jobId}`);
        setJob(res.data);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message
          : undefined;
        setError(message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-[#5B5CE2]/30 border-t-[#5B5CE2] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-500 p-4 border border-red-100 rounded-[10px] text-[14px]">
          {error || "Job not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-8 py-10 pb-28">
      {/* Header: "Job Details" + actions */}
      <JobHeader id={job._id} onDelete={() => setShowDeleteModal(true)} />

      {/* Two-column layout: description left, cards right */}
      <div className="flex flex-col lg:flex-row gap-8 min-w-0">

        {/* Left: Description */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[21px] font-semibold text-gray-900 mb-5">{job.title}</h2>
          <div
            className="
              text-[15px] leading-relaxed text-gray-600 break-words
              [&>p]:mb-4
              [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ul>li]:mb-1.5
              [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>ol>li]:mb-1.5
              [&>h1]:text-gray-900 [&>h1]:font-bold [&>h1]:text-xl [&>h1]:mb-4 [&>h1]:mt-6
              [&>h2]:text-gray-900 [&>h2]:font-semibold [&>h2]:text-[17px] [&>h2]:mb-3 [&>h2]:mt-5
              [&>h3]:text-gray-900 [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4
              [&>strong]:font-semibold [&>strong]:text-gray-800
            "
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Right: Cards — fixed width, never grows */}
        <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
          <SalaryLocationCard
            minSalary={job.minSalary}
            maxSalary={job.maxSalary}
            salaryType={job.salaryType}
            city={job.city || (job.fullyRemote ? "Remote" : "N/A")}
            country={job.country || (job.fullyRemote ? "Anywhere" : "N/A")}
          />
          <OverviewMetricsCard
            postedDate={job.createdAt}
            expirationDate={job.expirationDate}
            jobLevel={job.jobLevel}
            experience={job.experience ?? "N/A"}
            education={job.education ?? "N/A"}
          />
        </div>

      </div>

      {showDeleteModal && (
        <DeleteJobModal
          jobId={job._id}
          jobTitle={job.title}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
