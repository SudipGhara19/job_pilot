import { useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCurrentUser } from "@/lib/features/user/userSlice";

interface Props {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete("/api/user/delete-account");
      dispatch(clearCurrentUser());
      onClose();
      router.push("/login");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message || "Failed to delete account.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] shadow-xl w-[420px] mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-semibold text-gray-900 mb-2">Delete Account</h2>
        <p className="text-[14px] text-gray-500 mb-7">
          Are you completely sure you want to delete your account? This action is <span className="font-medium text-gray-700">permanent</span> and will delete all your associated jobs.
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
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
