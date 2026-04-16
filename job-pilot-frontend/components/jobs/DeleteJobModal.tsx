import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Props {
  jobId: string;
  jobTitle?: string;
  onClose: () => void;
  /** Called after successful delete. If omitted, redirects to /my-jobs */
  onDeleted?: () => void;
}

export default function DeleteJobModal({ jobId, jobTitle, onClose, onDeleted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/jobs/${jobId}`);
      onClose();
      if (onDeleted) {
        onDeleted();
      } else {
        router.push("/my-jobs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete job.");
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="bg-white rounded-[14px] shadow-xl w-[420px] mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-semibold text-gray-900 mb-2">Delete Job</h2>
        <p className="text-[14px] text-gray-500 mb-7">
          Are you sure you want to delete{jobTitle ? <> &quot;<span className="font-medium text-gray-700">{jobTitle}</span>&quot;</> : " this job"}?
        </p>

        {error && (
          <p className="text-[13px] text-red-500 mb-4 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-7 py-2.5 text-[14px] font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-7 py-2.5 text-[14px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
