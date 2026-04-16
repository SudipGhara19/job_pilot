'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MyJobsList from "@/components/jobs/MyJobsList";
import ViewJob from "@/components/jobs/ViewJob";
import UpdateJob from "@/components/jobs/UpdateJob";

function JobsRouter() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "myjobs";
  const jobId = searchParams.get("jobId");

  if (tab === "viewJob" && jobId) {
    return <ViewJob jobId={jobId} />;
  }

  if (tab === "update" && jobId) {
    return <UpdateJob jobId={jobId} />;
  }

  return <MyJobsList />;
}

export default function MyJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
          <div className="w-8 h-8 border-[3px] border-[#5B5CE2]/30 border-t-[#5B5CE2] rounded-full animate-spin" />
        </div>
      }
    >
      <JobsRouter />
    </Suspense>
  );
}
