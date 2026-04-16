import Image from "next/image";
import deleteIcon from "@/public/images/common/delete-01.png";
import Link from "next/link";

export default function JobHeader({ id, onDelete }: { id: string; onDelete?: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-5 sm:gap-0">
      <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">Job Details</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        >
          <Image src={deleteIcon} alt="Delete" width={18} height={18} />
        </button>
        <Link href={`/my-jobs?tab=update&jobId=${id}`}>
          <button className="px-8 py-[11px] bg-[#5B5CE2] hover:bg-[#4d4eba] text-white font-medium rounded-full transition-colors text-[14.5px]">
            Edit Job
          </button>
        </Link>
      </div>
    </div>
  );
}
